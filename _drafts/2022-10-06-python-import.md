---
title: "Importante arquivos com Python"
date: 2022-10-06
---

# pip e imports

Um dos grandes pontos fortes do Python é a quantidade e a qualidade de suas bibliotecas, assim como a facilidade de importar
as mesmas. Com o uso do comando *python -m pip install \<lib\>*<sup>1</sup> é possível se instalar uma infinitude de bibliotecas e após isso elas podem ser
adicionadas ao código com um simples comando **import**.
```py
import numpy
```

Para se evitar a chamada de um nome muito longo ao se fazer referência a bibliotecas conhecidas o comando **as** deve ser usado para a criação de um alias:

```py
import numpy as np
```

Caso se queira importar somente uma parte da biblioteca existe o comando **from**:

```py
from numpy import random as rd
```

E para se navegar mais a fundo nas entranhas das bibliotecas, um simples ponto pode ser utilizado<sup>2</sup>:
```py
from numpy.random import normal as nm
```

<sup>1</sup>Recomenda-se esse uso ao invés do uso direto do *pip*. Isso dificulta que se instale uma biblioteca na versão errada do Python.

<sup>2</sup>Nesse ponto, o alias já não seria recomendado pois por deixar o código pouco legivel. Foi utilizado somente para mostrar a versatilidade.
