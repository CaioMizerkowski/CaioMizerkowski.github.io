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
    
foo = Foo('Caio', 25)
print(foo.get_nome)
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
##

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

##

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

##
def get_idade(self):
    return self._idade

foo.get_idade = get_idade.__get__(foo, Foo)
print(foo.get_nome())
print(foo.get_idade())
print(foo.get_idade)

#https://stackoverflow.com/questions/972/adding-a-method-to-an-existing-object-instance
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
