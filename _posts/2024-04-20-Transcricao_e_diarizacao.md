---
title: "Transcrição e Diarização de Podcast"
date: 2024-04-20
---

Existe um podcast que eu ouço faz bastante tempo e que eu gosto muito, é o [RPGuaxa](https://www.deviante.com.br/podcasts/rpguaxa/) ([linktree](https://linktr.ee/Rpguaxa)). É um podcast de RPG muito bem feito, pois além dos jogadores e do narrador, vários NPCs são dublados pelos ouvintes do podcast, isso o torna muito gostoso de ouvir. Decidi fazer a transcrição e a diarização dos episódios com a ajuda de algumas ferramentas de Inteligência Artificial voltadas para o processamento de áudio e foi um aprendizado muito interessante.

O código pode ser encontrado no [repositório](https://github.com/CaioMizerkowski/guaxa), assim como os arquivos gerados.

## Transcrição

O primeiro passo foi a transcrição, ou seja, pegar o áudio e transformar as palavras faladas em texto. A openAI tem uma ferramenta que ajuda nesse processo, a [Whisper](https://github.com/openai/whisper). Eu já tinha feito um teste a meses com essa ferramenta usando uma versão menor dos modelos disponíveis, mas como comprei recentemente uma GPU nova com 16GB de VRAM, resolvi testar o maior modelo disponível.

Após fazer a instalação da biblioteca e o download dos episódios, o processo foi simples, rodando o seguinte código:

```sh
for f in *.mp3; do echo $f; whisper $f --model large --language Portuguese ; done
```

O processo ser simples não significa que ele seja rápido, como o modelo é bem grande, ele leva aproximadamente o tempo do áudio para fazer a transcrição. O resultado no final é muito bom pelo o que averiguei. Acabei fazendo esse processo para todos os episódios disponíveis, o que levou alguns dias para terminar.

Um pequeno exemplo da saída em formato srt, outros exemplos estão no repositório do [projeto](https://github.com/CaioMizerkowski/guaxa) na pasta `transcricoes`:

```srt
1
00:00:00,000 --> 00:00:09,000
As vezes ao tentar criar uma coisa, criamos outra.

2
00:00:09,160 --> 00:00:11,200
A humanidade está cheia de bons exemplos disso.

3
00:00:11,520 --> 00:00:15,440
Marca passos, micro-ondas, raio-x, penicilina, cookies.

4
00:00:16,040 --> 00:00:18,840
As vezes o que criamos até funciona para o que queríamos,

5
00:00:19,060 --> 00:00:22,260
mas possui um efeito colateral melhor que o efeito primário.
```

## Diarização

O processo de diarização é aquele que se faz para se identificar quem está falando em cada momento, como é possível observar no exemplo acima, não existe nenhuma informação sobre quem é o autor das falas ou sobre uma mudança de falante. A diarização foi feita utilizando a ferramenta [pyannote](https://github.com/pyannote/pyannote-audio), uma ferramenta de uso supostamente simples.

O grande problema dela foi alcançar uma boa performance, visto que por algum motivo a ferramenta não utilizava a GPU ao se enviar o áudio através de um caminho para o arquivo, consegui resolver isso carregando o áudio na memória. Eu espero que esse problema seja corrigido nas próximas versões da biblioteca.

Um exemplo de código em Python para a diarização, aonde eu carrego o áudio na memória e passo para a ferramenta:

```python
from pathlib import Path

import torch
import torchaudio
from dotenv import dotenv_values
from pyannote.audio import Pipeline
from pyannote.audio.pipelines.utils.hook import ProgressHook

env = dotenv_values(".env")
pipeline = Pipeline.from_pretrained(
    "pyannote/speaker-diarization-3.0",
    use_auth_token=env["HUGGINGFACE_ACCESS_TOKEN"],
)
pipeline.to(torch.device("cuda"))


def diarize(audio_path):
    waveform, sample_rate = torchaudio.load(str(audio_path))
    audio_in_memory = {"waveform": waveform, "sample_rate": sample_rate}

    with ProgressHook() as hook:
        diarization = pipeline(
            audio_in_memory,
            hook=hook,
        )

    output_path = Path(audio_path).parent / "diarization.txt"
    with open(output_path, "w") as f:
        for turn, _, speaker in diarization.itertracks(yield_label=True):
            f.write(
                f"start={int(turn.start*1000)}ms stop={int(turn.end*1000)}ms speaker_{speaker}\n"
            )


if __name__ == "__main__":
    root = Path("transcricoes")

    for mp3 in root.rglob("*.mp3"):
        audio_path = Path(mp3)

        if not (audio_path.parent / "diarization.txt").exists():
            print(audio_path)
            diarize(audio_path)
```

Um trecho do episódio e a diarização gerada, com os valores em milissegundos, as atribuições de falas foram feitas manualmente (processo ainda a ser automatizado):

| Id | Início | Fim | Fala |
| --- | --- | --- | --- |
| 01 | *218180* | 220780 | *A oeste está Aldrin, que é a Isabela.* |
| 02 | 220920 | *221820* | *Qual é a aparência do seu personagem?* |
| 03 | *222100* | 223020 | Ela é jovem, né? |
| 04 | 223340 | 225060 | Ela tem uma estatura média. |
| 05 | 225060 | *227800* | Tá com um vestido preto, curto. |
| 06 | 228040 | 230060 | Um casaco bem confortável. |
| 07 | 231180 | 232640 | E sapatos de salto. |
| 08 | 232960 | 234840 | E um cabelo bem arrumado, maquiado. |
| 09 | 235200 | *235820* | Bem vestida. |
| 10 | *235960* | 239220 | *Ao norte, um homem muito alto e forte, sem camisa.* |
| 11 | 239640 | *241620* | *Sua cabeça é a cabeça de um corvo.* |

| Início | Fim | Pessoa | Ids |
| --- | --- | --- | --- |
| 216443 | 222079 | SPEAKER_13 | 01, 02 |
| 222079 | 227003 | SPEAKER_08 | 03, 04, 05 |
| 227071 | 235882 | SPEAKER_08 | 05, 06, 07, 08, 09 |
| 235882 | 251332 | SPEAKER_13 | 10, 11 |

Nesse pequeno trecho é possível perceber que a diarização conseguiu separar razoavelmente bem as falas, separando as duas pessoas que estão falando nesse trecho do episódio.

## União

Para se unir as falas, eu usei um algoritmo em Python que calcula a intersecção entre os intervalos de tempo da transcrição e da diarização, assim é possível saber quem está falando em cada momento. A parte do código relevante para a intersecção é a seguinte:

```py
def intersection_1d(start_a: int, stop_a: int, start_b: int, stop_b: int) -> int:
    return max(0, min(stop_a, stop_b) - max(start_a, start_b))
```

| Início | Fim | Falantes | Fala |
| --- | --- | --- | --- |
| 218180 | 220780 | 13 | A oeste está Aldrin, que é a Isabela. |
| 220920 | 221820 | 13 | Qual é a aparência do seu personagem? |
| 222100 | 223020 | 08 | Ela é jovem, né? |
| 223340 | 225060 | 08 | Ela tem uma estatura média. |
| 225060 | 227800 | 08 | Tá com um vestido preto, curto. |
| 228040 | 230060 | 08 | Um casaco bem confortável. |
| 231180 | 232640 | 08 | E sapatos de salto. |
| 232960 | 234840 | 08 | E um cabelo bem arrumado, maquiado. |
| 235200 | 235820 | 08 | Bem vestida. |
| 235960 | 239220 | 13 | Ao norte, um homem muito alto e forte, sem camisa. |
| 239640 | 241620 | 13 | Sua cabeça é a cabeça de um corvo. |

Uma revisão manual sempre vai ser importante para se garantir a qualidade do resultado, além de que sem informações adicionais, não tem como se marcar quem é o autor de cada fala. Com a ajuda de uma pessoa que tenha ouvido o episódio, é possível se fazer essa atribuição entre os ids dos falantes e os nomes dos personagens.
