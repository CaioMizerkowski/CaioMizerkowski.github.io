---
title: "Dados Intransitivos e RPG"
date: 2023-11-18
---

Entre as muitas coisas que eu sou, ser um matemático não é uma delas. O que não me impede de achar certos fatos curiosos, por causa disso acompanho alguns canais sobre matemática no YouTube, dentre eles está o Numberphile. Em um vídeo recente (nos padrões geológicos), postado a somente 7 anos atrás, é apresentado os dados intransitivos. O professor Tadashi explica muito melhor do que eu jamais poderei fazer, então vejam: [The Most Powerful Dice - Numberphile](https://www.youtube.com/watch?v=zzKGnuvX6IQ).

Mas como o principal objetivo desse blog é me ajudar a reter conhecimento, vou resumir transitividade, intransitividade e antitransitividade.

## País da Transitividade

### Transitividade

Alice chegou ao maravilhoso país das transitividade. E como é lindo esse país, com elefalantes gigantes e minuscúlos ratos, um mundo ordenado e rankeado. E qual seria o primeiro pensamento de Alice, senão:

> "Como esse elefalante é ENORME, muito maior do que eu 🦣"

Seguido de um riso frouxo ao olhar para o ratinho:

> "Que ratinho piticutico, muito menor do que eu 🤏"

No mundo da transitividade, as coisas são simples. Se o elefalante é maior do que Alice, e Alice é maior do que o rato, logicamente, o elefalante é maior do que o rato. Simples, não? De uma forma um pouco mais precisa (mas não tanto, pois não sou um matemático), se $$a R b$$ e $$b R c$$, então $$a R c$$, aonde $$R$$ é uma relação binária transitiva. $$R$$ pode ser, entre outras casos: maior do que, menor do que, igual a, diferente de, ancestral de, etc.

### Intransitividade

Em um mundo intransitivo, as coisas não são tão simples. Podemos dizer que Alice é amiga do Chapeleiro, que o Chapeleiro é amigo do Coelho, mas que Alice não é amiga do Coelho (é dificil ser amigo de alguém que está sempre com atrasado e correndo contra o tempo). Ou seja, se $$a R b$$ e $$b R c$$, não necessariamente $$a R c$$.

Vamos adicionar o Gato de Cheshire a essa história, para termos 4 personagens: Alice, Chapeleiro, Coelho e Gato.

- Alice é amiga do Chapeleiro
- Alice é amiga do Gato
- **Alice não é amiga do Coelho**
- Chapeleiro é amigo do Coelho
- Chapeleiro é amigo do Gato
- Coelho é amigo do Gato

Se dentro desse conjunto de personagens, pegarmos somente: Alice, Chapeleiro e Gato. Teremos uma relação transitiva, pois Alice é amiga do Chapeleiro, que é amigo do Gato, logo Alice é amiga do Gato. Mas se pegarmos: Alice, Chapeleiro e Coelho, voltamos a relação intransitiva de antes.

### Antitransitividade

O que estou chamando de antitransitividade é um caso mais forte de intransitividade, aonde se $$a R b$$ e $$b R c$$, então $$a \bar R c$$. Um exemplo é o jogo Pedra, Papel e Tesoura. Se a Pedra ganha da Tesoura, e a Tesoura ganha do Papel, então a Pedra perde do Papel.

Essas relações antitransitivas permitem a criação de ciclos, o que possui aplicações legais em jogos. Outro exemplo é Pokemon, aonde o tipo Grama é forte contra o tipo Água, que é forte contra o tipo Fogo, que é forte contra o tipo Grama.

![Alt text](https://raw.githubusercontent.com/CaioMizerkowski/CaioMizerkowski.github.io/master/images/pokemon.png)

## Mas porque diabos tudo isso?

~~Hiperfoco temporário~~

Após ver o vídeo do Numberphile, me perguntei se algum RPG utiliza dados intransitivos. Não consegue encontrar nenhum exemplo (se alguém souber, por favor, me fale), então resolvi criar um sistema mínimo. Minha inspiração foi o vídeo do Numberphile e o jogo Disco Elysium, aonde o personagem possui 4 atributos: Inteligência, Psique, Físico e Motor.

### Poderes e Potências

Nesse proto-pseudo-quasi-pre-sistema existem 5 poderes (Físico, Motor, Intelectual, Espiritual e Psicológico) e 5 potências (Vigor, Agilidade, Foco, Aura e Volição). Cada poder possui uma potência associada, da seguinte forma:

- Físico: Vigor
- Motor: Equilíbrio
- Intelectual: Foco
- Espiritual: Aura
- Psicológico: Volição

Cada poder está relacionado a um dado de 6 faces, em que cada face possui um número de 0 a 6. Enquanto cada potência está relacionada a uma total, que é um número que varia entre 1 e 36, igual a soma dos números de cada face do dado associado.

### Ficha do Personagem

Cada personagem possui um total de pontos que vai de 5 a 180 (Para que o maior valor em uma face seja 6), propõem-se que os personagens iniciem com 40 pontos. Quando um personagem evolui, ele ganha mais pontos e os pontos são distribuidos nos poderes. Um personagem focado no Físico e com um Psicológico mais fraco, poderia ter a seguinte ficha:

|   Poder     | 1 | 2 | 3 | 4 | 5 | 6 | Potência  | Total |
|-------------|---|---|---|---|---|---|:----------|------:|
| Físico      | 6 | 4 | 4 | 2 | 2 | 2 | Vigor     |  20   |
| Motor       | 2 | 1 | 1 | 1 | 1 | 0 | Equilíbrio|   6   |
| Intelectual | 2 | 2 | 1 | 1 | 0 | 0 | Foco      |   6   |
| Espiritual  | 2 | 1 | 1 | 0 | 0 | 0 | Aura      |   4   |
| Psicológico | 2 | 2 | 0 | 0 | 0 | 0 | Volição   |   4   |

A sequência 1,2,3,4,5,6 representa as faces do dado, se cair aquela face, o valor usado é o associado aquela face.\
A sequência 6,4,4,2,2,2 é o valor associado a cada face do dado, sendo a quantidade de pontos distribuidos.\
O total de pontos é a soma dos valores associados para cada poder, sendo esse o valor da potência.

### Testes

Existem dois tipos de testes, aqueles contra o mundo e aqueles contra outros personagens. Em ambos os casos o jogador joga um dado se não tiver auxilio e joga dois dados se tiver auxilio (de outro personagem, de uma ferramenta, etc). Nos testes contra o mundo o nível de dificuldade é definido pelo mestre com um valor entre 0 a 12 (0 é um sucesso automático e 12 um teste quase impossível). Testes com um nível de dificuldade maior que 6 necessitam de um auxilio para serem realizados, pois o valor máximo em um dado é 6.

Por exemplo, um personagem quer escalar uma parede muito lisa, o mestre define que o nível de dificuldade é 8 no Poder Motor. O jogador vai precisar de um auxilio para realizar esse teste, como por exemplo um outro jogador dando apoio. Nesse caso, o jogador joga dois dados e soma os valores, se o resultado for maior ou igual a 8, o personagem consegue escalar a parede.

Nos testes contra outros personagens, cada personagem joga um ou dois dados (a depender do auxilio) e soma os valores. O personagem com o maior valor vence o teste e aplica um dano na potência do outro personagem, com o dano sendo igual a diferença entre os valores dos dados.

Numa batalha de rimas, por exemplo, o confronto aconteceria no Poder Psicológico. Os personagens A e B jogam seus dados e tiram, respectivamente, 4 e 6. O personagem B vence o teste e aplica um dano de 2 na potência Volição do personagem A. Quando a Volição de um dos personagens chegar a 0, o personagem A perde a batalha de rimas, o emocional dele foi abalado e ele não consegue mais rimar.

## Conclusão

Isso tudo foi feito com base no **Cult of Done Manifest**, estava com a ideia na cabeça e precisava ao menos esboçar ela. Vou usar isso algum dia? Não sei, mas agora está escrito e feito é melhor que perfeito.

### The Cult of Done Manifesto

1. There are three states of being. Not knowing, action and completion.
2. Accept that everything is a draft. It helps to get it done.
3. There is no editing stage.
4. Pretending you know what you’re doing is almost the same as knowing what you are doing, so just accept that you know what you’re doing even if you don’t and do it.
5. Banish procrastination. If you wait more than a week to get an idea done, abandon it.
6. The point of being done is not to finish but to get other things done.
7. Once you’re done you can throw it away.
8. Laugh at perfection. It’s boring and keeps you from being done.
9. People without dirty hands are wrong. Doing something makes you right.
10. Failure counts as done. So do mistakes.
11. Destruction is a variant of done.
12. If you have an idea and publish it on the internet, that counts as a ghost of done.
13. Done is the engine of more.
