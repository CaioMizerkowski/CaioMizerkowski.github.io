# Transformando meu notebook antigo em um servidor doméstico

## Preparação

Após comprar um notebook novo, fiquei em dúvida sobre o que fazer com o notebook antigo e inspirado por um [postagem em um blog](https://medium.com/@manujarvinen/setting-up-a-multi-boot-of-5-linux-distributions-ca1fcf8d502), resolvi reproduzir e instalar diversas distros Linux ao lado do Windows 11 nele e usar como um servidor doméstico. O notebook que submeti a estes testes, afinal o máximo que tinha instalado era o PopOS ao lado do Windows 10, é um Lenovo Ideapad 330, o qual troquei o HD por um SSD, deixando o HD no espaço para o leitor do DVD como um espaço armazenamento adicional.

Na preparação, a primeira coisa que fiz foi um backup de todos os arquivos importantes que existiam no SSD, já que iria zerar ele completamente para realizar esse processo. Após o backup dos arquivos, retirei o HD para evitar uma formatação acidental e baixei o Xubuntu em um pendrive.

## Formatando o SSD

Utilizando a ferramenta GParted através do pendrive com o Xubuntu, criei uma nova tabela de partições no SSD, apagando todos os dados, então não façam isso antes de terem feito o backup.

IMAGEM AQUI

Seguindo o exemplo dado pela postagem, a primeira coisa que fiz foi criar duas partições para o boot, uma EFI e outra para ser usado caso necessário pelo CentOS, e uma partição para a área de trocas/swap.

## Instalando o Windows 11

Com estas três partições definidas, instalei finalmente o Windows 11 na quarta partição. Tinha baixado a ISO no notebook novo e jogado para o pendrive para fazer a instalação, o Windows infelizmente criou mais algumas partições cujo próposito eu não tenho tanta certeza, uma delas é do próprio EFI, uma reservada e outra de NTFS. Por precaução, deixei todas lá, incluindo o espaço de 1 MB entre as partições NTFS e a EFI.

IMAGEM DAS PARTIÇÕES AQUI

## Resto das partições

IMAGEM DAS PARTIÇÕES 2 AQUI

## Instalando o Xubuntu e o refind

## Instalando o PopOS

## Tudo deu errado e arrumando

## Instalando o CentOS

Usando Xubunto para refazer as partições
Duas partições de boot
Uma partição de Swap de 8GB
Criando uma partição NTFS para o Windows 11 com 65GB, ele pede no minimo 52.5 para instalar
Criar partições de 20GB para as distros Linux
Criar pasta work e data

instalar manjaro
aparece duas versões para iniciar o manjaro, só preciso de uma delas
agora como diabos fazer isso?
Mover pasta Manjaro para o IGNORE, some com o icone, mas continua com o caminho para o grub
showtools hidden_tags
https://www.rodsbooks.com/refind/configfile.html#hiding

https://askubuntu.com/questions/681422/grub-menu-not-showing-with-dual-boot-uefi-mode-installation

deu merda, remover a efi, instalar tudo de novo, windows filho da puta

fazer o backup, instalar de novo, instalar o CentOS e deu certo