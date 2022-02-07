---
title: Simulando o .bind do JS em Python (com closure)
date: 2022-02-06
---

## Motivação

Por meio de um [curso na Alura](https://cursos.alura.com.br/course/javascript-es6-orientacao-a-objetos-parte-1) descobri que no JS existe o método [_bind_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind), que permite conectar uma função a uma instância de uma classe. Isso sem a necessidade de criar a função como um método interno da classe.

O exemplo no curso é o seguinte:

```javascript
class Pessoa {
    constructor(nome) {
        this.nome = nome;
    }
}

function exibeNome() {
    alert(this.nome);
}

let pessoa = new Pessoa('Fulano');
exibeNome = exibeNome.bind(pessoa);
exibeNome();
```

Em vista disso, me desafiei a conseguir o mesmo resultado através do Python. Precisava para tal criar uma classe com dois atributos e um método para ser comparado a função que será integrada a posteriore na instância.


```python
class Foo:
    def __init__(self, nome, idade):
        self._nome = nome
        self._idade = idade

    def get_nome(self):
        return self._nome
```

Enquanto o objetivo principal é reproduzir o mesmo comportamento de um método, é importante notar que métodos e funções possuem tipos diferentes dentro do Python.

```python
foo = Foo('Caio', 25)
print('foo:',foo)

print(foo.get_nome())
print(type(foo.get_nome))
print(foo.get_nome)
```

    foo: <__main__.Foo object at 0x00000218FC8EE280>
    Caio
    <class 'method'>
    <bound method Foo.get_nome of <__main__.Foo object at 0x00000218FC8EE280>>
    

Tendo estes pormenores em mente, comecei a fazer algumas experimentações com [closures](https://www.geeksforgeeks.org/python-closures). Chegando a esse código, no qual a função inner da closure é salva para foo.get_idade, recebendo como parâmetro em sua criação a instância foo. Esse parâmetro é lembrado pela função e permite a chamada dos atributos da instância em seu interior.


```python
def get_idade(self):
    def inner():
        return self._idade
    return inner

foo.get_idade = get_idade(foo)
print(foo.get_idade())
print(type(foo.get_idade))
print(foo.get_idade)
```

    25
    <class 'function'>
    <function get_idade.<locals>.inner at 0x00000218FC8DF8B0>
    

## Stackoverflow
Após chegar a uma das soluções para o problema, procurei para ver se encontrava maiores discussões sobre isso e formas mais canonicas de realizar o mesmo processo. A principal página que consultei foi esta [questão no stack overflow](https://stackoverflow.com/questions/972/adding-a-method-to-an-existing-object-instance). As diversas respostas me permitiram ver soluções variadas para o problema e entender um pouco melhor o que acontecia.

Duas soluções se destacam entre as apresentadas, por funcionarem não somente conectando a função a classe como também alterando o seu tipo para _bound method_ e, pelo menos numa primeira analise, tornando-as tais quais os métodos nativos da classe. Como a chamada direta dos _dunder methods_ não é aconselhada, o uso da biblioteca _types_ me parece a solução mais aconselhada para o problema.


```python
def get_idade(self):
    return self._idade

foo.get_idade = get_idade.__get__(foo, Foo)
print(foo.get_idade())
print(type(foo.get_idade))
print(foo.get_idade)
```

    25
    <class 'method'>
    <bound method get_idade of <__main__.Foo object at 0x00000218FC8EE280>>
    


```python
import types
foo.get_idade = types.MethodType(get_idade, foo)
print(foo.get_idade())
print(type(foo.get_idade))
print(foo.get_idade)
```

    25
    <class 'method'>
    <bound method get_idade of <__main__.Foo object at 0x00000218FC8EE280>>
    

Outras formas de se conseguir o mesmo efeito também estão presentes, como o uso da _lambda function_ que nesse contexto não deixa de se comportar como uma closure.


```python
def get_idade(self):
    return self._idade

foo.get_idade = lambda: get_idade(foo)
print(foo.get_idade())
print(type(foo.get_idade))
print(foo.get_idade)
```

    25
    <class 'function'>
    <function <lambda> at 0x00000218FC901310>
    

Uma forma mais sofisticada de usar funções aninhadas também está presente, o que me gerou o estalo para produzir o _decorador_ que vou apresentar. Esse método permite com que diversos parâmetros sejam passados a função por esta se preocupar em trata-los.


```python
def bind(instance, method):
    def binding_scope_fn(*args, **kwargs): 
        return method(instance, *args, **kwargs)
    return binding_scope_fn

foo.get_idade = bind(foo, get_idade)    
print(foo.get_idade())
print(type(foo.get_idade))
print(foo.get_idade)
```

    25
    <class 'function'>
    <function bind.<locals>.binding_scope_fn at 0x00000218FC9015E0>
    

Descobri também nas respostas a possibilidade de se usar uma _partial function_, algo que nunca usei em Python mas já possui a necessidade de usar enquanto fazia meus projetos de IC no Matlab.


```python
from functools import partial
foo.get_idade = partial(get_idade, foo)
print(foo.get_idade())
print(type(foo.get_idade))
print(foo.get_idade)
```

    25
    <class 'functools.partial'>
    functools.partial(<function get_idade at 0x00000218FC901280>, <__main__.Foo object at 0x00000218FC8EE280>)

## Transformando num decorador
Inspirado nas diversas respostas, resolvi montar um [decorador](https://towardsdatascience.com/how-to-use-decorators-in-python-by-example-b398328163b) para estes casos. Permitindo então aplicar o mesmo a qualquer função e a integrar em uma instância já em funcionamento.

```python
def bind(self):
    def inner_bind(function):
        def inner(*args, **kwargs):
            return function(self, *args, **kwargs)
        return inner
    return inner_bind

@bind(foo)
def get_idade(self):
    return self._idade

foo.get_idade = get_idade
print(foo.get_idade())
print(type(foo.get_idade))
print(foo.get_idade)
```

    25
    <class 'function'>
    <function bind.<locals>.inner_bind.<locals>.inner at 0x00000218FC9010D0>
    
Como se pode ver, embora se comporte como esperado, ainda não é visto pelo Python como um _bound method_ da instância. Vamos arrumar isso usando a biblioteca _types_, conseguindo assim o efeito e o tipo pretendido para o agora método.


```python
import types
def bind(self):
    def inner_bind(function):
        def inner(*args, **kwargs):
            return function(*args, **kwargs)
        return types.MethodType(inner, self)
    return inner_bind

```

E vamos testar o mesmo com outra variável, para vermos seu funcionamento no modo esperado.


```python
foo._universidade = 'UFPR'

@bind(foo)
def get_universidade(self):
    return self._universidade

foo.get_universidade = get_universidade
print(foo.get_universidade())
print(type(foo.get_universidade))
print(foo.get_universidade)
```

    UFPR
    <class 'method'>
    <bound method bind.<locals>.inner_bind.<locals>.inner of <__main__.Foo object at 0x00000218FC8EE280>>
    

## Monkey Patching

Esse processo é bem similar ao [monkey patching](https://medium.com/analytics-vidhya/monkey-patching-in-python-dc3b3f52906c). A principal diferença é que no monkey patching se altera a própria classe, enquanto que nesse processo está sendo alterado a instância. Portando, caso se crie uma nova instância da classe estes métodos adicionados não estarão presentes. O erro a seguir mostra bem isso.


```python
foo2 = Foo('Fulano',55)
foo2.get_idade()
```


    ---------------------------------------------------------------------------

    AttributeError                            Traceback (most recent call last)

    ~\AppData\Local\Temp/ipykernel_7552/2613053042.py in <module>
          1 foo2 = Foo('Fulano',55)
    ----> 2 foo2.get_idade()
    

    AttributeError: 'Foo' object has no attribute 'get_idade'


