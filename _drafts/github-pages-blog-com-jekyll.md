# GitHub Pages, Jekyll e Liquid

<https://pages.github.com/>
Github pages é uma forma fácil e gratuita de hospedar seu site estático, existindo a possibilidade de utilizar o Jekyll, mesmo sem saber absolutamente nada de Ruby, para gerar as páginas.

<https://jekyllrb.com/docs/structure/>
Para utilizar o jekyll para transformar seus arquivos em markdown em um blog, é necessário obedecer a estrutura de pastas do Jekyll  e configurar algumas opções. Diversos temas já quase configurados existem no github, um deles é o <https://github.com/mmistakes/so-simple-theme>, que é utilizado neste site.

Como meus conhecimentos de Web (HTML, CSS e JS) são rudimentares, usar o So Simple Theme me permitiu pular toda essa parte complicada de montar o site e pular direto para a escrita dos meus blogs. E junto disso com a capacidade de subir outras páginas estaticas junto que não necessariamente se adequam a estrutura apresentada.

<https://shopify.github.io/liquid/>
Engine para o template, parecido em proposito com o Flask

<https://jekyllrb.com/docs/front-matter/>
Aonde ficam as variaveis locais para a geração, titutlo, data, layout, categorias e tags a serem usadas e outras informações de configuração no formato YAML.

Principais arquivos e pastas:

_config.yml - Aonde estão as principais configurações, vai ser poucas vezes modificado.
_data/ - Pasta com os arquivos de dados, como json, csv, ou yml
_drafts/ - Pasta para deixar os posts não finalizados
_includes/ e _layout/ - Pastas com as estruturas e pedaços do site, para serem usados pelo Jekyll na montagem dos templates.
_posts/ - Pasta com as postagens do blog, elas tem um formato especial no nome e um header yaml para serem corretamente interpretadas pelo Jekyll.
index.md - Arquivo para o home do site
outros arquivos markdown - Outras páginas diferentes do site
pastas podem ser usadas para compor a url
