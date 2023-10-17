---
title: "Espaço de Tuplas e Abelhas"
date: 2023-10-16
---

## A little night youtube video

É engraçado como as vezes conhecemos conceitos ao acaso, por exemplo: vendo uma discussão na rede caótica ao lado. Nestes acasos da vida, descobri sobre a linguagem Linda (nome cuja origem está ligado a alguns assuntos complicados) e sobre o conceito de espaço de tuplas. Tudo começou enquanto eu via um [vídeo](https://www.youtube.com/watch?v=jPhvic-eqbc) criticando o uso de uma analogia bastante comum: dizer que o corpo humano, e em especial a bioquímica do corpo humano, funciona de maneira similar a uma máquina.

Posso trazer uma reflexão sobre isso ser ou não um obstáculo epistemológico ao entendimento do funcionamento da bioquímica humana, sobre ser uma analogia válida e até mesmo falar que as analogias e modelos, embora incompletos, podem ajudar a entender coisas mais complexas, mas a verdade é que não entendo nada de bioquímica. O que eu sei é que em um comentário falou-se sobre a linguagem Linda e sobre esse paradigma (será que dá para se chamar assim?) de programação baseado em espaços de tuplas.

A ideia (se não entendi tudo errado) é que existe um único espaço de memória compartilhado nesse modelo e que diferentes programas se comunicam por meio desse espaço. Para isso eles podem adicionar uma tupla ou retirar uma tupla deste espaço, deste que essa tupla se adeque ao padrão de entrada do programa.

Então vamos dizer que um programa só aceite como entrada tuplas no formato `(int, int)`, e retorne uma tupla no formato `(int)` para o espaço de tuplas, com o resultado da soma. Caso uma tupla nesse formato não exista no espaço de tuplas: o programa não retornará nada. Mas caso a tupla seja adicionada por outro programa ao espaço de tuplas: o programa vai executar e retornar o resultado da soma.

Eu acho essa ideia interessante por ser caótica e não-determinística, o que talvez seja uma analogia mais próxima a bioquímica, já que uma proteína pode agir em diferentes moléculas (segundo o que o vídeo explicava, não conheço nada de bioquímica) e diferentes proteínas podem agir na mesma molécula. Embora totalmente ignorante na bioquímica e com pouco conhecimento sobre o espaço de tuplas, resolvi testar essa ideia em Python.

Claro, de uma forma muito simples, boba até, pois no momento falta qualquer paralelismo, o espaço de tuplas é uma lista e os programas são simples classes. Mas considerando estas limitações, foi algo que eu me diverti fazendo e acho que isso é o principal. Então vou omitir alguns detalhes da implementação, para tornar a escrita desse texto mais fácil e apresentar as ideias.

## O espaço de tuplas

Para a implementação *"completa"* acesse: [Tuple Space](https://github.com/CaioMizerkowski/tuple_space).

A primeira coisa que programei, foi uma representação desse tal de espaço de tuplas:

```python
class TupleSpace:
    """Based on:
    https://en.wikipedia.org/wiki/Tuple_space
    https://github.com/pSpaces/Programming-with-Spaces/blob/master/tutorial-tuple-spaces.md
    """

    def __init__(self) -> None:
        self._space = list()

    def put(self, item: NamedTuple) -> None:
        self._space.append(item)
        shuffle(self._space) # Add some chaos

    def get(self, template: NamedTuple) -> NamedTuple:
        if len(self) == 0:
            return None

        for item in self._space:
            if self._match(template, item):
                self._space.remove(item)
                return item

    def _match(self, template: NamedTuple, item: NamedTuple) -> bool:
        return template._fields == item._fields
```

A primeira coisa a se notar, é o meu uso insistente da classe *NamedTuple*, cuja culpa é do Luciano Ramalho e seu espetacular livro [Python Fluente](https://pythonfluente.com/). Essa estrutura permite que se criem tuplas em que cada campo possui um nome e um tipo atribuído, o que é meio essencial quando se deseja fazer uma comparação da estrutura de duas tuplas e não somente de seus tamanhos (comparação realizada no método *_match*).

Os dois principais métodos são *put* e *get*, cujos nomes são autoexplicativos. O primeiro adiciona a tupla no espaço de tuplas, enquanto o segundo faz a busca por uma tupla que se adeque ao padrão e a retorna. Bem simples, não?

## Criaturas sombrias e himenópteras

Mas bem, quais programas podem consumir e produzir tuplas? Eu pensei em algumas ideias, tipo vampiros, ou monstros, mas elas acabavam ficando muito complexas na minha cabeça e se afastando do principal. Querendo a simplicidade, resolvi focar nas flores, abelhas e ursos... você pode falar que não é uma aplicação real dos conceitos, e eu digo que a aplicação em um problema real fica a cargo do leitor.

Primeiro construí uma classe abstrata para definir os principais comportamentos:

```python
class EntityABC(ABC):
    def __init__(self, name: str, entities: list[Self]):
        self.in_format: NamedTuple = None
        self.out_format: NamedTuple = None
        self.value = None
        self.name = name

    @abstractmethod
    def __call__(self, space: TupleSpace):
        pass

    def _put(self, space: TupleSpace):
        space.put(self.value)

    def _get(self, space: TupleSpace):
        self.value = space.get(self.in_format)
        if self.value is None:
            print(f"{self.name} failed to get {self.in_format}")
```

Temos nessa classe definido qual o formato da tupla que a entidade vai buscar, qual o formato da tupla que ela vai devolver e alguns outros atributos. Novamente, os métodos *_put* e *_get* são óbvios em seu funcionamento, eles adicionam ou retiram tuplas do espaço de tuplas. Enquanto o método *\_\_call\_\_* é o que vai definir o comportamento de cada entidade.

## Flores

Plantas são produtores primários, se alimentam de luz (assim como os jovens místicos) e dos nutrientes do solo. Portanto, nessa analogia talvez não tanto educacional, que nos afasta da abstração, elas são nossos produtores de néctar e só adicionam recursos ao espaço de tuplas, sem nunca retirar.

```python
class Flower(EntityABC):
    def __init__(self, name: str, entities: list[Self]):
        super().__init__(name, entities)
        self.out_format = NECTAR
        self.value: NECTAR

    def __call__(self, space):
        self.value = self.out_format(g=randint(1, 5))
        self._put(space)
        print(f"{self.name} produced {self.value.g}g of nectar")

```

## Abelhas

Himenópteras é um nome bonito que engloba abelhas, vespas, formigas e vai saber quais outros insetos. No caso das abelhas, elas servem como polinizadoras e também produzem o doce mel ao consumires o nectar as flores. São criaturas angelicais, que as vezes possuem ferrões afiados como a espada dos próprios anjos. São nosso prossumidores.

```python
class Bee(EntityABC):
    def __init__(self, name: str, entities: list[Self]):
        super().__init__(name, entities)
        self.in_format = NECTAR
        self.out_format = HONEY
        self.value: NECTAR | HONEY

    def __call__(self, space):
        self._get(space)

        if self.value:
            print(f"{self.name} got {self.value.g}g of nectar")
            self.value = self.out_format(ml=self.value.g * 2)
            self._put(space)
            print(f"{self.name} produced {self.value.ml}ml of honey")

```

## Ursos

O grande marrom, cujo nome ancestral foi esquecido pelos protoindo-europeus. Ele é o grande predador, uma fera voraz que precisa de muitas calorias para o inverno. Ele é o nosso consumidor e também quem vai definir o fim da simulação.

```python
class Bear(EntityABC):
    def __init__(self, name: str, entities: list[Self]):
        super().__init__(name, entities)
        self.in_format = HONEY
        self.value: HONEY
        self.hunger = -1000

    def __call__(self, space):
        self._get(space)

        if self.value:
            print(f"{self.name} eat {self.value.ml}ml of honey")
            self.hunger += self.value.ml

        if self.hunger >= 0:
            print(f"{self.name} is full")
            raise StopIteration
```

## A simulação

I'm a bear girl in a bear world, life in plastic, it's fantastic. A simulação é extremamente simples, com uma lista de entidades para povoar o nosso mundo, com produtores, prossumidores e consumidores. Depois disso é esperar que o urso esteja satisfeito ao ter consumido mel o bastante e possa finalmente hibernar.

```python
entities: list[EntityABC] = list()


def main_loop():
    space = TupleSpace()

    while len(entities) > 1:
        shuffle(entities)

        try:
            for entity in entities:
                entity(space)
        except StopIteration:
            break


if __name__ == "__main__":
    entities.append(Flower("Lar", entities))
    entities.append(Flower("Ran", entities))
    entities.append(Flower("Jeira", entities))

    entities.append(Bee("Abe", entities))
    entities.append(Bee("Bel", entities))
    entities.append(Bee("Elha", entities))

    entities.append(Bear("Zé", entities))

    main_loop()

```

E é isso, no pior dos casos serviu para escrever algumas classes e pesquisar na wikipedia sobre o comportamento das abelhas.
