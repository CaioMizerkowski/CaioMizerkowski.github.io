---
title: Simulando o .bind do JS em Python (com closure)
date: 2022-02-06
---

## Motivação

Tudo começou durante um [curso da Alura de JS](https://cursos.alura.com.br/course/javascript-es6-orientacao-a-objetos-parte-1) que estava realizando e no qual aprendi que em JS existia o método [_bind_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind), que quando chamado cria uma nova função que passa a estar conectada a alguma classe especificada.

O exemplo do curso é o seguinte:

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

E nisso, pensei comigo mesmo se conseguiria reproduzir esse comportamento em Python. Parti criar uma classe com dois atributos e uma função get_nome para comparar com a que criaria e faria o "bind" na instância.


```python
class Foo:
    def __init__(self, nome, idade):
        self._nome = nome
        self._idade = idade

    def get_nome(self):
        return self._nome
```

Como da para observar, um método em Python possui uma classe diferente das funções. Mas eu me preocupei somente em reproduzir o mesmo comportamento.


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
    

Após um bocado de experimentações, cheguei a uma solução a partir da criação de uma [closure](https://www.geeksforgeeks.org/python-closures). No código, a função inner da closure é salva em foo.get_idade, recebendo como parâmetro no momento de sua criação a própria instância foo. Esse parâmetro passado no momento da criação é lembrado pela função e permite a chamada dos atributos da instância em seu interior.


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
Após conseguir chegar a uma solução minha, procurei na internet mais informações sobre, chegando a essa questão no [stack overflow](https://stackoverflow.com/questions/972/adding-a-method-to-an-existing-object-instance). Isso me permitiu ver algumas soluções variadas e entender melhor essa questão de _binding_ uma função em uma classe em Python.

Dentre as diversas soluções presentes, duas se destacam por fazer com que a função seja vista como um método da instância foo e não somente uma função salva em um atributo da instância. 


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
    

Outra forma que eu achei divertida por usar um lambda fuction. 


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
    

Uma forma um tanto mais sofisticada de realizar o mesmo que eu fiz, considerando os argumentos que a função possa ter e que me gerou o estalo para transformar esse processo em um decorador.


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
    

Criação de uma partial function, algo que já usei algumas vezes no Matlab de formas não tão agradáveis ao olhar, mas que nunca tinha visto sendo usadas em Python.


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
Bem, uma coisa é realizar esse processo para uma função especifica, outra é deixar isso de forma genérica para várias funções. Então resolvi transformar esse processo em um [decorador](https://towardsdatascience.com/how-to-use-decorators-in-python-by-example-b398328163b).


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
    

Com um pouco mais de esforço e usando a biblioteca types, deu até para transformar em um bound method da instância foo.


```python
import types
def bind(self):
    def inner_bind(function):
        def inner(*args, **kwargs):
            return function(*args, **kwargs)
        return types.MethodType(inner, self)
    return inner_bind

```

Adicionando outro atributo ao objeto foo, testei e funcionou.


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

Tudo isso é bem similar a algo conhecimento como [monkey patching](https://medium.com/analytics-vidhya/monkey-patching-in-python-dc3b3f52906c). A principal diferença é que no monkey patching se altera a própria classe, enquanto que nesse processo está sendo alterado a instância. Portando, caso se crie uma nova instância da classe estes métodos adicionados não estarão presentes. O erro a seguir mostra bem isso.


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


