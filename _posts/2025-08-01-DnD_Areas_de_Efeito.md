---
title: "Cilindros, Quadrados e Círculos - DND 2014"
date: 2026-08-02
---

Dungeons and Dragons (2014) tem um problema e esse problema é a geometria. E não estou falando sobre o movimento na diagonal não ser sequer uma aproximação da distância percorrida de forma imaginária pelos personagens, para esse caso é só imaginar que todos os personagens se movem como o rei do xadrez (distância de Chebyshev); Também não é sobre a inconsistência entre o formato de um círculo, pois seguindo a distância de Chebyshev, um círculo se torna um quadrado no mapa, enquanto que a outra opção é tornar o movimento dos personagens e a geometria dos feitiços incompatíveis.

![Distâncias](https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Minkowski_distance_examples.svg/500px-Minkowski_distance_examples.svg.png)

Não, o problema é que a parte sobre as áreas de efeito é mal escrita e deixa muito pontos em semi-aberto. Para começo de conversa, todas as áreas de efeito citadas especificamente são volumes e não áreas, exceto uma que é descrita como uma linha, mas na verdade é alguma outra coisa que não uma linha. Daí tu se pergunta: não existem então áreas de efeito e é tudo volume? A resposta é que não é tudo volume, existem feitiços que afetam um espaço definido por uma área, mas estas regiões não estão descritas. As _áreas_ descritas são as seguintes: Cone, Cubo, Cilindro, Linha e Esfera.

Agora você deve estar pensando que esse texto é um exagero? Sim! Mas é um exagero originado de tentar entender corretamente as regras e me deparar com particularidades que fazem muito pouco sentido. E também uma forma de fixar as noções mais importantes e de tomar decisões sobre como lidar com estas particularidades.

Então...

Para tentar resolver esse problema, vamos fazer como Euclides e começar definindo alguns axiomas extraídos do livro do jogador (lembrando sempre que o específico substitui o geral). O texto diz:

> Every area of effect has a point of origin, a location from which the spell's energy erupts. The rules for each shape specify how you position its point of origin. Typically, a point of origin is a point in space, but some spells have an area whose origin is a creature or an object.
>
> A spell's effect expands in straight lines from the point of origin. If no unblocked straight line extends from the point of origin to a location within the area of effect, that location isn't included in the spell's area. To block one of these imaginary lines, an obstruction must provide total cover, as explained in chapter 9.

Disso podemos extrair:

- Todo feitiço inicia em um ponto de origem.
- Cada forma determina como o ponto de origem é posicionado.
- A área de efeito se expande em linhas retas a partir do ponto de origem.
- Uma subregião é afetada se houver uma linha reta do ponto de origem até ela.
- Caso exista um obstáculo que forneça cobertura total, a subregião não é afetada.

## Regiões

Partindo da região mais simples textualmente até a mais complexa.

### Esfera

>You select a sphere's point of origin, and the sphere extends outward from that point. The sphere's size is expressed as a radius in feet that extends from the point.
>
>A sphere's point of origin is included in the sphere's area of effect.

O ponto de origem é o centro da esfera, com ela se expandindo de dentro para fora em todas as direções. Vamos pegar de exemplo a Fireball.

> A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw.

Esse feitiço já começa diferente, pois determina que embora o ponto de origem não seja o seu dedo, o feitiço parte dele até o ponto de origem escolhido. Você também não precisa ver o ponto de origem, só necessita de _A Clear Path to the Target_, o que pode ou não ser uma linha reta, pois o texto está mal escrito.

> The fire spreads around corners. It ignites flammable objects in the area that aren't being worn or carried.

Aqui é simples, o específico substitui o geral, ela vai pelos cantinhos. Mas só ela porque está escrito.

### Cone

> A cone extends in a direction you choose from its point of origin. A cone's width at a given point along its length is equal to that point's distance from the point of origin. A cone's area of effect specifies its maximum length.
>
> A cone's point of origin is not included in the cone's area of effect, unless you decide otherwise.

O cone é simples, o único problema é ele não especificar o ângulo da projeção do cone, mas ele pode ser calculado, partindo do princípio que o cone possui simetria radial e portanto a projeção pode ser dividida em dois triângulos retângulos. Em cada um destes triângulos, o cateto adjacente terá o comprimento do cone e o cateto oposto terá a metade da largura do cone. Lembrando que o comprimento é igual a largura.

Definindo $\theta$ como o ângulo do triângulo:
$$
\tan(\theta) = \frac{C_{oposto}}{C_{adj}} = \frac{0.5*X}{X} = 0.5
$$

Invertendo-se a equação:
$$
\arctan(0.5) = \theta = 26.565°
$$

Multiplicando-se por 2:
$$
2*\theta = 53.13°
$$

Felizmente o Roll20 tem uma opção para permitir que o ângulo da projeção esteja correto com apenas um botão. Vamos ver um exemplo com o Burning Hands:

> As you hold your hands with thumbs touching and fingers spread, a thin sheet of flames shoots forth from your outstretched fingertips. Each creature in a 15-foot cone must make a Dexterity saving throw.

Ou seja, nesse caso não é realmente um cone, pois é um "thin sheet of flames". Se é fino, não é um cone... Mas a projeção é definida da mesma forma... Mas é um triângulo e não um cone.

### Linha

> A line extends from its point of origin in a straight path up to its length and covers an area defined by its width.
>
> A line's point of origin is not included in the line's area of effect, unless you decide otherwise.

O nome é linha, é definido a partir do comprimento e da largura, então é um retângulo. Então a área de efeito ocupa o espaço como se fosse uma folha de papel gigante? Não tem três dimensões?

O nome é linha, a _área de efeito_ é definida como uma superfície, e no teatro da mente todo mundo imagina como um volume.

### Cubo

> You select a cube's point of origin, which lies anywhere on a face of the cubic effect. The cube's size is expressed as the length of each side.
>
> A cube's point of origin is not included in the cube's area of effect, unless you decide otherwise.

O ponto de origem é em qualquer parte da superfície do cubo. Fácil. O cubo também pode possuir rotações [sageadvice.eu](https://www.sageadvice.eu/can-the-faces-of-a-cube-effect-be-rotated-along-any-axis/).

![Rotações de um avião](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Yaw_Axis_Corrected.svg/960px-Yaw_Axis_Corrected.svg.png)

Isso implica que a projeção do cubo no solo possa ser maior que a área de uma das faces do cubo. [Exemplo no geogebra](https://www.geogebra.org/m/xtwmnekg). Isso também permite, em alguns casos, que um efeito em cubo afete somente um inimigo cercado de personagens aliados.

## Continua…

Quando eu tiver mais tempo para escrever.

<!-- 
### Cilindro

> A cylinder's point of origin is the center of a circle of a particular radius, as given in the spell description. The circle must either be on the ground or at the height of the spell effect. The energy in a cylinder expands in straight lines from the point of origin to the perimeter of the circle, forming the base of the cylinder. The spell's effect then shoots up from the base or down from the top, to a distance equal to the height of the cylinder.
>
> A cylinder's point of origin is included in the cylinder's area of effect.

Para se criar um cilindro, primeiro se cria um círculo, geralmente, mas não necessariamente, esse círculo estará no chão. A outra opção é "at the height of the spell effect", onde fica implícito que é a altura é em relação ao chão.

Após isso o efeito ou segue para cima ou para baixo do círculo. Novamente fica implícito que quando o círculo inicial está na altura do feitiço, o efeito acontece para baixo. Depois, conferir como está no 2024.

Exceto que ao ser esclarecido, parece que não: [sageadvice.eu](https://www.sageadvice.eu/can-moonbeam-be-cast-on-a-person-that-is-flying/)

## Feitiços

### Moonbeam

> A silvery beam of pale light shines down in a 5-foot-radius, 40-foot-high cylinder centered on a point within range. Until the spell ends, dim light fills the cylinder.

Moonbeam vem de cima para baixo 'shines down', mas seria isso o suficiente para limitar em lugares com menos de 40ft de altura? Não me parece razoável.

E talvez a restrição ao ponto de origem não continue após o feitiço ter sido lançado: [sageadvice.eu](https://www.sageadvice.eu/moonbeam-says-it-can-be-moved-in-any-direction-does-that-include-up-and-down/)

### Call Lightning

> A storm cloud appears in the shape of a cylinder that is 10 feet tall with a 60-foot radius, centered on a point you can see within range directly above you. The spell fails if you can't see a point in the air where the storm cloud could appear (for example, if you are in a room that can't accommodate the cloud).

Somente 10ft de altura, mas precisa ser um lugar que acomode a nuvem. Aparentemente embaixo d'água funciona: [sageadvice.eu](https://www.sageadvice.eu/can-call-lightning-ice-storm-and-sleet-storm-be-cast-underwater/)

Foi removido no 2024. Assim como foi removida a necessidade do cilindro estar no chão.

### Earthquake

> You create a seismic disturbance at a point on the ground that you can see within range. For the duration, an intense tremor rips through the ground in a 100-foot-radius circle centered on that point and shakes creatures and structures in contact with the ground in that area.

Eeeeh, círculo no chão: não descrito em nenhum lugar essa área de efeito. Mesmo que a magia esteja no mesmo livro (livro do jogador).

### Entangle

> Grasping weeds and vines sprout from the ground in a 20-foot square starting from a point within range. For the duration, these plants turn the ground in the area into difficult terrain.

Um quadrado no chão de 20 ft, ou seja, do centro do quadrado até cada lado são 10 ft. Ou será que do centro do quadrado até cada lado são 20 ft? Ou será que são 20ft², um quadrado com cada lado com 4.5ft? Qual o ponto de origem válido? Vai saber.

### Lightning Bolt

> A stroke of lightning forming a line 100 feet long and 5 feet wide blasts out from you in a direction you choose.

Fácil de entender. -->