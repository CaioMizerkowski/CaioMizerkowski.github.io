---
title: Simulando o .bind do JS em Python (com closure)
date: 2022-02-04
---

##### Código em Python

```python
class Foo:
    def __init__(self, nome, idade):
        self._nome = nome
        self._idade = idade

    def get_nome(self):
        return self._nome
```


```python
foo = Foo('Caio', 25)
print(foo.get_nome)
```

    <bound method Foo.get_nome of <__main__.Foo object at 0x0000027E62311D00>>
    


```python
def get_idade():
    _self = None

    def _get_idade():
        nonlocal _self
        return _self._idade

    def bind(self):
        nonlocal _self
        _self = self
        return _get_idade
    
    return bind

get_idade = get_idade()(foo)
foo.get_idade = get_idade

print(foo.get_nome())
print(get_idade())
print(foo.get_idade)
```


```python
def get_idade2(self):
    return self._idade

foo.get_idade = get_idade2
print(foo.get_nome())
print(foo.get_idade(foo))
print(foo.get_idade)

foo.get_idade = lambda: get_idade2(foo)
print(foo.get_nome())
print(foo.get_idade())
print(foo.get_idade)
```


```python
def get_idade3(self):
    _self = self

    def _get_idade():
        nonlocal _self
        return _self._idade

    return _get_idade

foo.get_idade = get_idade3(foo)
print(foo.get_nome())
print(foo.get_idade())
print(foo.get_idade)
```

## Stackoverflow 
https://stackoverflow.com/questions/972/adding-a-method-to-an-existing-object-instance


```python
def get_idade(self):
    return self._idade

foo.get_idade = get_idade.__get__(foo, Foo)
print(foo.get_nome())
print(foo.get_idade())
print(foo.get_idade)
```


```python

##
import types
foo.get_idade = types.MethodType(get_idade, foo)
print(foo.get_nome())
print(foo.get_idade())
print(foo.get_idade)

##
def bind(instance, method):
    def binding_scope_fn(*args, **kwargs): 
        return method(instance, *args, **kwargs)
    return binding_scope_fn

foo.get_idade = bind(foo, get_idade)    
foo.get_idade()

print(foo.get_nome())
print(foo.get_idade())
print(foo.get_idade)

##
from functools import partial
foo.get_idade = partial(get_idade, foo)
foo.get_idade()

print(foo.get_nome())
print(foo.get_idade())
print(foo.get_idade)

#https://stackoverflow.com/questions/5626193/what-is-monkey-patching
```

    <bound method Foo.get_nome of <__main__.Foo object at 0x0000027E6230BEB0>>
    Caio
    25
    <function get_idade.<locals>._get_idade at 0x0000027E622E3B80>
    Caio
    25
    <function get_idade2 at 0x0000027E62327DC0>
    Caio
    25
    <function <lambda> at 0x0000027E623279D0>
    Caio
    25
    <function get_idade3.<locals>._get_idade at 0x0000027E62327700>
    Caio
    25
    <bound method get_idade of <__main__.Foo object at 0x0000027E6230BEB0>>
    Caio
    25
    <bound method get_idade of <__main__.Foo object at 0x0000027E6230BEB0>>
    Caio
    25
    <function bind.<locals>.binding_scope_fn at 0x0000027E622E3E50>
    Caio
    25
    functools.partial(<function get_idade at 0x0000027E622E3F70>, <__main__.Foo object at 0x0000027E6230BEB0>)
    
