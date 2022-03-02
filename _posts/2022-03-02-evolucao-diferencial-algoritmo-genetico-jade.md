---
title: Evolução Diferencial vs Jade vs Algoritmo Genético
date: 2022-03-02
---

## Motivação

Na disciplina de Inteligência Artificial e Aprendizagem de Máquina ministrada pelo professor Leandro Coelho no curso de Engenharia Elétrica da UFPR, foi requisitado a comparação entre o funcionamento do algoritmo genético e a evolução diferencial. Aproveitando o incentivo da disciplina também comparei estes dois algoritmos, implementados por mim, com a [evolução diferencial](https://link.springer.com/article/10.1023/A:1008202821328) presente no [scipy](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.differential_evolution.html) e com uma implementação do [jade](https://ieeexplore.ieee.org/document/5208221).

Todos os códigos produzidos por mim podem ser encontrados em [AIML](https://github.com/CaioMizerkowski/AIML), construídos em Python e utilizando principalmente a biblioteca [numpy](https://numpy.org/), com o uso do [pandas](https://pandas.pydata.org/) para o describe final dos dados. O matéria aqui expresso é em grande parte derivado do aprendizado realizado na disciplina, sendo qualquer equivoco expresso aqui de responsabilidade totalmente minha.

## Algoritmo Genético com números com ponto flutuantes

Algoritmos genéticos constituem uma familia de métodos para realizar a otimização de funções, encontrar seus pontos minimos ou máximos dentro de uma série de restrições. Eles são baseados na teoria da evolução e apresentam uma versão simplificada, mas bastante potente, dos genes através de valores arrays de valores númericos que codificam os parametros a serem otimizados. Estes valores podem ser codificados em valores binários, em valores inteiros (usados para problemas de permutação) ou em valores reais (ponto flutuante). Em razão dos problemas apresentados para a otimização terem seus parametros definidos dentre os números reais, esse última opção que foi implementada.

Os algoritmos genéticos começam com a geração de uma população, na qual cada individuo possui um conjunto aleatório de genes. Três processos, derivados da teoria da evolução, são realizados nessa população: Mutação, recombinação e seleção. O seguinte trecho de código mostra esse processo, no qual a população *X* possui seus individuos _x_ sofrendo estes três processos de forma a melhorar seu fitness.

```python
def genetic_algorithm(self):
    self.X_vector = [self.X]
    self._g = 0
    while self._g < self._G:
        X_new = np.zeros(self._shape)
        self.best_x = self.X[np.array(map(self._fitness, self.X)).argmin()]
        for idx, x in enumerate(self.X):
            v = self._mutation(x)
            v = self._crossover(v)
            X_new[idx] = self._selection(x, v)
        self.X = X_new
        self.X_vector.append(self.X)
        self._g += 1
```

## Evolução diferencial

Uma alteração nos algoritmos genéticos classicos, a evolução diferencial se distancia um pouco da analogia evolucionária classica de cruzamento somente entre dois individuos da população. Sendo o resultado do processo de mutação um cruzamento de três ou mais individuos, mediado por um fator de mutação _mr_.

Diferentes estratégias de mutação existem, mas a mais comum e a utilizada nesse trabalho foi a DE/rand/1/bin, no qual o operador de mutação é:

\\[ V_{i} = X_{r{i}{1}} + mr*(X_{r{i}{2}}-X_{r{i}{3}}) \\]

Sendo o fator diferencial, que da o nome ao algoritmo, a diferença $$X_{r{i}{2}}-X_{r{i}{3}}$$, pois quanto maior a proximidade de ambos, menor o seu efeito será e a busca se tornará mais regional, ao invés de ser global.

Outro parametro do algoritmo é o _cr_, que determina qual a probabilidade de recombinação entre os genes de *X* e de *V*. No caso classico da Evolução Diferencial estes valores são ajustados a mão, enquanto que técnicas mais avançadas como a JADE permitem que estes parametros sejam ajustados durante a execução.

## JADE com Arquivo

Lorem Ipsum
