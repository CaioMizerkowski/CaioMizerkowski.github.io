---
title: Evolução Diferencial vs Jade vs Algoritmo Genético
date: 2022-03-02
---

## Motivação

Na disciplina de Inteligência Artificial e Aprendizagem de Máquina ministrada pelo professor Leandro Coelho no curso de Engenharia Elétrica da UFPR, foi requisitada a comparação entre o funcionamento do algoritmo genético e a evolução diferencial. Aproveitando o incentivo da disciplina também comparei estes dois algoritmos, implementados por mim, com a [evolução diferencial](https://link.springer.com/article/10.1023/A:1008202821328) presente no [scipy](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.differential_evolution.html) e com uma implementação da [jade](https://ieeexplore.ieee.org/document/5208221).

Todos os códigos produzidos por mim podem ser encontrados em [AIML](https://github.com/CaioMizerkowski/AIML), construídos em Python e utilizando principalmente a biblioteca [numpy](https://numpy.org/) e com o uso do [pandas](https://pandas.pydata.org/) para o describe final dos dados. O material aqui expresso são anotações minhas da disciplina, sendo qualquer equívoco presente de minha total responsabilidade. Maiores detalhes podem ser encontrados nos links disponibilizados com os artigos para os algoritmos.

## Algoritmo Genético com números com ponto flutuantes

Algoritmos genéticos constituem uma família de métodos para realizar a otimização de funções, encontrar seus pontos mínimos ou máximos dentro de uma série de restrições. Eles são baseados na teoria da evolução e apresentam uma versão simplificada, mas bastante potente, dos genes através de valores arrays de valores numéricos que codificam os parâmetros a serem otimizados. Estes valores podem ser codificados em valores binários, em valores inteiros (usados para problemas de permutação) ou em valores reais (ponto flutuante). Em razão dos problemas apresentados para a otimização terem seus parâmetros definidos dentre os números reais, foi implementada a última opção.

Os algoritmos genéticos começam com a geração de uma população, na qual cada indivíduo possui um conjunto aleatório de genes. Três processos, derivados da teoria da evolução, são realizados nesta população: Mutação, recombinação e seleção. O seguinte trecho de código mostra esse processo, no qual a população **X** possui seus indivíduos _x_ sofrendo estes três processos de forma a melhorar seu fitness.

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

Uma alteração nos algoritmos genéticos clássicos, a evolução diferencial se distancia um pouco da analogia evolucionária clássica de cruzamento somente entre dois indivíduos da população. Sendo o resultado do processo de mutação um cruzamento de três ou mais indivíduos, mediado por um fator de mutação _mr_.

Diferentes estratégias de mutação existem, mas a mais comum é a utilizada neste trabalho foi a DE/rand/1/bin, no qual o operador de mutação é:

$$ V_{i} = X_{r^{i}_{1}} + mr*(X_{r^{i}_{2}}-X_{r^{i}_{3}}) $$

Sendo o fator diferencial, que da o nome ao algoritmo, a diferença $$X_{r^{i}_{2}}-X_{r^{i}_{3}}$$, ambos individuos escolhidos de maneira aleatória, pois quanto maior a proximidade de ambos, menor o seu efeito será e a busca se tornará mais regional, ao invés de ser global.

Outro parâmetro do algoritmo é o _cr_, que determina qual a probabilidade de recombinação entre os genes de **X** e de **V**. No caso clássico da Evolução Diferencial estes valores são ajustados a mão, enquanto que técnicas mais avançadas como a JADE permitem que estes parâmetros sejam ajustados durante a execução.

 
## JADE com Arquivo
 
Como diferentes valores de _mr_ e _cr_ podem gerar resultados bastante discrepantes nos mínimos encontrados e como o ajuste destes valores na mão pelo cientista responsável acaba por ser um processo repetitivo, variantes que permitem o ajustes destes parâmetros durante a execução do programa são bastantes estudadas na literatura e usadas na prática.
 
Uma variante popular e poderosa é a JADE, no qual a cada iteração _mr_ e _cr_ individuais são ajustados conforme os que tiveram os melhores resultados na iteração anterior.
 
O ajuste dos _mr_ se dá por meio de uma distribuição normal cujo centro é definido pelos _mr_ de sucesso na etapa anterior. O análogo ocorre para os _cr_, mas utilizando-se uma distribuição de Cauchy cujo centro é calculado através dos _cr_ de sucesso da iteração anterior.
 
Outra modificação da JADE é o operador de mutação utilizado, conhecido como DE/current-to-pbest/1:
 
$$ V_{i} = X_{i} + mr_{i}*(X^{P}_{best}-X_{i}) + mr*(X_{r^{i}_{1}}-X_{r^{i}_{2}}) $$
 
No qual $$X^{P}_{best}$$ é um dos p% melhores indivíduos da população, escolhido aleatoriamente, evitando que o algoritmo seja muito guloso na sua busca por mínimos locais. O uso de Arquivo se encontra na seleção dos valores $$X_{r^{i}_{2}}$$, cujo pool de escolhas inclui também uma lista de individuos rejeitados nas gerações anteriores.
 
## Resultados

Considerando-se um total de 200 gerações e 30 execuções para se coletar as informações, foram resolvidos os seguintes problemas: Design of Pressure Vessel, Design of Tension/Compression Spring e Design of a Speed Reducer. Estes estando presentes no livro [Mechanical Design Optimization Using Advanced Optimization Techniques](https://www.amazon.com/Mechanical-Optimization-Advanced-Techniques-Manufacturing-dp-1447159780/dp/1447159780/).

### 4.3.1 Example 8: Design of Pressure Vessel

A minimização do custo de material e produção de um vaso de pressão, este apresentando com 4 dimensões (grossura do casco, grossura da cabeça, radio interno e comprimento do cilindro) para serem adequadas pelo algoritmo. Estando a minimização sujeita a 4 desigualdades.

| Setup        | MR  | CR  | Mean f    | Std f       | Min f     | Median f  | Max f     |
| ------------ | --- | --- | --------- | ----------- | --------- | --------- | --------- |
| 1 - Scipy DE | 0.7 | 0.7 | 6129.0639 | 123.36478   | 6059.9327 | 6091.1514 | 6419.8829 |
| 2 - Scipy DE | 0.6 | 0.8 | 6344.1261 | 291.98089   | 6059.7339 | 6371.0546 | 6824.3386 |
| 3 - Scipy DE | 0.8 | 0.6 | 6092.3740 | 82.67993    | 6059.7319 | 6063.4808 | 6411.7920 |
| 1 - DE       | 0.7 | 0.7 | 6061.7832 | 2.77104     | 6059.8993 | 6061.0437 | 6074.8365 |
| 2 - DE       | 0.6 | 0.8 | **6059.7297** | **0.02093**     | 6059.7148 | 6059.7227 | **6059.8071** |
| 3 - DE       | 0.8 | 0.6 | 6081.5229 | 15.72926    | 6060.2527 | 6077.5373 | 6119.8120 |
| 1 - GA       | 0.7 | 0.7 | 144982.73 | 76191.43861 | 39242.22  | 116963.92 | 295073.87 |
| 2 - GA       | 0.6 | 0.8 | 144813.27 | 71965.93740 | 38202.47  | 133820.16 | 333127.07 |
| 3 - GA       | 0.8 | 0.6 | 107247.74 | 47021.36849 | 42807.43  | 98952.76  | 216083.14 |
| 1 - Jade     | 0.7 | 0.7 | 6063.8459 | 10.64597    | 6059.7144 | 6059.7297 | 6090.5437 |
| 2 - Jade     | 0.6 | 0.8 | 6076.2475 | 57.01107    | **6059.7143** | **6059.7149** | 6370.7797 |
| 3 - Jade     | 0.8 | 0.6 | 6064.2956 | 10.66028    | 6059.7208 | 6059.9390 | 6091.5658 |

Os resultados da evolução diferencial e sua variação jade foram os que melhor funcionaram. Enquanto que o algoritmo genético não foi capaz de entrar em uma região de mínimo.

### 4.3.3 Example 10: Design of Tension/Compression Spring

Sujeita a 4 desigualdades e possuindo 3 dimensões (diâmetro do fio, diâmetro média da mola e número de espiras), o problema é a minimização do peso de uma mola de tensão/compressão.
A minimização de um vaso de pressão, com 4 dimensões (grossura do casco, grossura da cabeça, radio interno e comprimento do cilindro) e cuja função a ser minimizada representa o custo do material e da manufatura do mesmo. Estando a minimização sujeita a 4 desigualdades.

| Setup        | MR  | CR  | Mean f    | Std f     | Min f     | Median f  | Max f      |
| ------------ | --- | --- | --------- | --------- | --------- | --------- | ---------- |
| 1 - Scipy DE | 0.7 | 0.7 | 0.0127100 | 0.0000540 | 0.0126680 | 0.0126900 | 0.0129320  |
| 2 - Scipy DE | 0.6 | 0.8 | 0.0127490 | 0.0000970 | 0.0126710 | 0.0127190 | 0.0131740  |
| 3 - Scipy DE | 0.8 | 0.6 | 0.0126970 | 0.0000260 | 0.0126670 | 0.0126900 | 0.0127870  |
| 1 - DE       | 0.7 | 0.7 | 0.0126690 | 0.0000040 | 0.0126660 | 0.0126670 | 0.0126810  |
| 2 - DE       | 0.6 | 0.8 | **0.0126655** | **0.0000002** | 0.0126653 | 0.0126654 | **0.0126663**  |
| 3 - DE       | 0.8 | 0.6 | 0.0126970 | 0.0000330 | 0.0126670 | 0.0126890 | 0.0128310  |
| 1 - GA       | 0.7 | 0.7 | 1.1595160 | 2.6133680 | 0.0141440 | 0.0962900 | 10.0908200 |
| 2 - GA       | 0.6 | 0.8 | 1.9278430 | 3.0943570 | 0.0197850 | 0.1150270 | 10.1133800 |
| 3 - GA       | 0.8 | 0.6 | 1.2968170 | 2.7926110 | 0.0197850 | 0.0968220 | 10.1060150 |
| 1 - Jade     | 0.7 | 0.7 | 0.0126670 | 0.0000060 | **0.0126650** | **0.0126650** | 0.0126970  |
| 2 - Jade     | 0.6 | 0.8 | 0.0126660 | 0.0000010 | **0.0126650** | **0.0126650** | 0.0126710  |
| 3 - Jade     | 0.8 | 0.6 | 0.0126680 | 0.0000110 | **0.0126650** | **0.0126650** | 0.0127270  |

Todos os três casos da JADE chegaram aos menores valores da função encontrados na literatura, enquanto que a evolução diferencial teve um menor desvio padrão e valores mínimos próximos aos da literatura.

### 4.3.4 Example 11: Design of a Speed Reducer

Possuindo 7 dimensões e 11 restrições por meio de desigualdades, o problema é a redução do peso de um redutor de velocidade.

| Setup        | MR  | CR  | Mean f    | Std f    | Min f     | Median f  | Max f     |
| ------------ | --- | --- | --------- | -------- | --------- | --------- | --------- |
| 1 - Scipy DE | 0.7 | 0.7 | 3006.3157 | 3.3031   | 3000.1138 | 3006.0532 | 3013.3462 |
| 2 - Scipy DE | 0.6 | 0.8 | 3005.8056 | 3.5508   | 3000.4592 | 3005.5116 | 3013.2711 |
| 3 - Scipy DE | 0.8 | 0.6 | 3007.4730 | 3.7225   | 3001.9525 | 3006.9781 | 3017.4809 |
| 1 - DE       | 0.7 | 0.7 | 2996.2112 | 0.0259   | 2996.2047 | 2996.2062 | 2996.3483 |
| 2 - DE       | 0.6 | 0.8 | 2996.2044 | 0.0007   | 2996.2035 | 2996.2042 | 2996.2065 |
| 3 - DE       | 0.8 | 0.6 | 2996.2088 | 0.0021   | 2996.2047 | 2996.2092 | 2996.2138 |
| 1 - GA       | 0.7 | 0.7 | 3539.3181 | 625.9205 | 3098.8281 | 3249.6107 | 5265.8771 |
| 2 - GA       | 0.6 | 0.8 | 3719.3259 | 867.6367 | 3095.4512 | 3249.8505 | 6594.9698 |
| 3 - GA       | 0.8 | 0.6 | 3314.1743 | 397.7548 | 3080.2399 | 3204.1956 | 5081.9358 |
| 1 - Jade     | 0.7 | 0.7 | 2996.2027 | 0.0000   | 2996.2026 | 2996.2027 | 2996.2027 |
| 2 - Jade     | 0.6 | 0.8 | **2996.2026** | **0.0000**   | **2996.2026** | **2996.2026** | **2996.2026** |
| 3 - Jade     | 0.8 | 0.6 | 2996.2028 | 0.0000   | 2996.2027 | 2996.2028 | 2996.2029 |

A JADE teve os melhores resultados entre os encontrados em todos os quesitos.
