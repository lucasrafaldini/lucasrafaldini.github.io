---
layout: post
comments: true
title: "Back to Basics #2 - O Básico do Git"
date: 2020-06-22
---

Houve um tempo no qual os desenvolvedores não controlavam muito bem as alterações de uma equipe inteira em um projeto. Eu não vivi esse tempo e acredito que você também não o tenha vivído. Entretanto, muitas empresas hoje em dia ainda sofrem com o controle de versão dos softwares produzidos pelo time de desenvolvimento. Pastas como "Final", "Final 2.0", e "Final de verdade" ainda existem em muitos times de desenvolvimento e isso é, no mínimo, triste. Por isso, é essencial que desenvolvedores saibam como fazer esse controle de versão da maneira certa, entendendo que controlar alterações no trabalho e registrar quem fez cada alteração não é assim um bixo de sete cabeças.

## Conhecendo o Git

O git atualmente é o sistema de controle de versões mais usado no mundo. Isso se dá devido à facilidade no seu uso, ao quão enxuto ele é desde o seu desenvolvimento e, também, por ele ser uma tecnologia nativa em todos as máquinas que rodam um kernel linux. De fato, o Git é uma invenção do nosso amigo [Linus Torvalds](https://pt.wikipedia.org/wiki/Linus_Torvalds) e surgiu de uma necessidade real (como todas as boas ideias surgem): assim que o Linux deixou de ser somente um projeto individual e Linus resolveu compartilhá-lo com alguns amigos, muitas alterações em arquivos não faziam sentido ou, ao menos, não faziam sentido ao primeiro olhar. Para Linus, isso demonstrou algumas necessidades ao trabalhar em equipe naquele projeto que ele tanto estimava:

- É preciso que o desenvolvedor adicione algum tipo de explicação para a alteração que foi feita, assim ninguém fica perdido ao ver um código alterado e possivelmente ilegível;

- É preciso que a alteração fique registrada com a sua data, um histórico do dado antigo comparada com o dado novo e quem é o responsável por aquela alteração;

- É preciso que essas alterações, caso sejam interpretadas como pouco importantes ou improdutivas, possam ser descartadas sem prejudicar o código legado, ou simplesmente o que havia antes da alteração;

Pensando nisso, Linus, _a grosso modo_, criou o Git. O git separava o código legado em uma _branch_ prioritária, obrigando que cada desenvolvedor, ao desejar fazer uma alteração, não alterasse essa _branch_ diretamente, mas copiasse uma nova _branch_ na qual ele incluiria suas modificações e, posteriormente, submeteria uma solicitação de _merge_ com a _branch_ prioritária. Dessa forma, ele conseguiria controlar o código legado e escolheria ele mesmo o que deveria e o que não deveria ser alterado no seu código.

## A metáfora da árvore

Talvez seja um pouco difícil para algumas pessoas entender o conceito de _branch_. Para falantes de língua inglesa, a metáfora é um pouco mais inteligível, pois aplica-se a outras áreas, como nos casos de empresas que possuem matrizes(_head offices_) e filiais(_branches_), mas a coisa é bem simples de se entender:

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 232"><style>.st0{display:none;} .st1{display:inline;} .st2{fill:#FFFFFF;} .st3{fill:none;stroke:#9882CE;stroke-width:4;stroke-miterlimit:10;} .st4{fill:#FFFFFF;stroke:#404040;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st5{fill:#FFFFFF;stroke:#404040;stroke-width:4;stroke-miterlimit:10;} .st6{fill:#B3E3FF;stroke:#404040;stroke-width:4;stroke-miterlimit:10;} .st7{fill:#B18BE8;stroke:#404040;stroke-width:4;stroke-miterlimit:10;} .st8{fill:#FFFFFF;stroke:#404040;stroke-width:6;stroke-miterlimit:10;} .st9{fill:#B3E3FF;stroke:#404040;stroke-width:6;stroke-miterlimit:10;} .st10{fill:#404040;} .st11{fill:none;stroke:#404040;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st12{fill:#B18BE8;stroke:#404040;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st13{fill:#444444;} .st14{fill:none;stroke:#404040;stroke-width:4;stroke-miterlimit:10;} .st15{fill:#4ED1A1;stroke:#404040;stroke-width:4;stroke-miterlimit:10;} .st16{fill:none;stroke:#CCCCCC;stroke-width:7;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st17{fill:#FFFFFF;stroke:#CCCCCC;stroke-width:7;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st18{fill:none;stroke:#404040;stroke-width:7;stroke-miterlimit:10;} .st19{fill:#B3E3FF;stroke:#404040;stroke-width:7;stroke-miterlimit:10;} .st20{fill:none;stroke:#CCCCCC;stroke-width:8;stroke-linecap:round;stroke-miterlimit:10;} .st21{fill:none;stroke:#404040;stroke-width:8;stroke-linecap:round;stroke-miterlimit:10;} .st22{fill:#FFFFFF;stroke:#404040;stroke-width:4;stroke-linejoin:round;stroke-miterlimit:10;} .st23{fill:#B3E3FF;stroke:#404040;stroke-width:4;stroke-linejoin:round;stroke-miterlimit:10;} .st24{fill:none;stroke:#CCCCCC;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st25{fill:#999999;} .st26{fill:#4ED1A1;stroke:#404040;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st27{fill:#4CD3D6;stroke:#404040;stroke-width:4;stroke-linejoin:round;stroke-miterlimit:10;} .st28{fill:none;stroke:#59AFE1;stroke-width:4;stroke-miterlimit:10;} .st29{fill:#59AFE1;stroke:#404040;stroke-width:4;stroke-linejoin:round;stroke-miterlimit:10;} .st30{fill:none;stroke:#404040;stroke-width:8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:0,30;} .st31{fill:#FFFFFF;stroke:#59AFE1;stroke-width:4;stroke-miterlimit:10;} .st32{fill:#FC8363;stroke:#404040;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st33{fill:#CCCCCC;stroke:#404040;stroke-width:4;stroke-miterlimit:10;} .st34{fill:#FFFFFF;stroke:#6693ED;stroke-width:4;stroke-miterlimit:10;} .st35{fill:none;stroke:#A97CDD;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st36{fill:none;stroke:#B3E3FF;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st37{fill:none;stroke:#4ED1A1;stroke-width:4;stroke-linecap:round;stroke-miterlimit:10;} .st38{fill:none;stroke:#4ED1A1;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st39{fill:#E24B88;stroke:#404040;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st40{fill:none;stroke:#DEEFF8;stroke-width:4;stroke-miterlimit:10;} .st41{fill:none;stroke:#CCCCCC;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;} .st42{fill:none;stroke:#CCCCCC;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:0,14.3051;} .st43{fill:none;stroke:#CCCCCC;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:0,14.1689;} .st44{fill:none;stroke:#CCCCCC;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:0,13.9788;} .st45{fill:none;stroke:#CCCCCC;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:0,14.7877;} .st46{fill:none;stroke:#CCCCCC;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:0,14.9632;} .st47{fill:#B3E3FF;stroke:#404040;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st48{fill:none;stroke:#CCCCCC;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:0,12.543;} .st49{fill:none;stroke:#CCCCCC;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:0,13.6844;} .st50{fill:none;stroke:#CCCCCC;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:0,13.7717;} .st51{fill:none;stroke:#CCCCCC;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:0,13.6492;} .st52{fill:none;stroke:#CCCCCC;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:0,13.907;} .st53{fill:#4CD3D6;stroke:#404040;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st54{fill:none;stroke:#CCCCCC;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:0,14.9858;} .st55{fill:none;stroke:#CCCCCC;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:0,14.0118;} .st56{fill:none;stroke:#CCCCCC;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:0,14.1243;} .st57{fill:none;} .st58{fill:#FFFFFF;stroke:#404040;stroke-width:7;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st59{fill:#59AFE1;stroke:#404040;stroke-width:7;stroke-linejoin:round;stroke-miterlimit:10;} .st60{fill:#E24B88;stroke:#404040;stroke-width:7;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st61{fill:none;stroke:#404040;stroke-width:7;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st62{fill:none;stroke:#CCCCCC;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st63{fill:#FFFFFF;stroke:#CCCCCC;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st64{fill:#F5F5F5;} .st65{fill:#3873AE;} .st66{fill:#75706C;} .st67{fill:none;stroke:#B3E3FF;stroke-width:4;stroke-miterlimit:10;} .st68{fill:#6F6F6F;} .st69{fill:none;stroke:#6F6F6F;stroke-width:2;stroke-miterlimit:10;} .st70{fill:none;stroke:#6F6F6F;stroke-width:3;stroke-miterlimit:10;}</style><g id="using_x5F_branches"><path class="st14" d="M264.5 74.2c0 22.6-18.4 41-41 41m41-41c0-22.6 18.4-41 41-41h160.4"/><circle class="st7" cx="348.9" cy="33.2" r="21"/><circle class="st7" cx="444.9" cy="33.2" r="21"/><path class="st14" d="M545.2 156.2c0-22.6-18.4-41-41-41m41 41c0 22.6 18.4 41 41 41h160.4"/><circle class="st15" cx="629.5" cy="197.2" r="21"/><circle class="st15" cx="725.5" cy="197.2" r="21"/><path class="st6" d="M53.5 115.2h555"/><circle class="st6" cx="74.5" cy="115.2" r="21"/><circle class="st6" cx="170.5" cy="115.2" r="21"/><circle class="st6" cx="347.9" cy="115.2" r="21"/><circle class="st6" cx="444.9" cy="115.2" r="21"/><circle class="st6" cx="629.5" cy="115.2" r="21"/></g></svg>

No exemplo acima, vemos em azul o que seria a tal _branch_ prioritária. Após a sua segunda versão, algum desenvolvedor deseja programar uma nova funcionalidade ou uma correção. O que ele faz é abrir uma segunda _branch_, representada em roxo. Assim, tanto a _branch_ prioritária não precisa parar o seu avanço esperando que essa funcionalidade nova saia da frente no fluxo de trabalha: ambas evoluem paralelamente. O mesmo processo pode ser visto posteriormente no exemplo representado em verde.

Um fato essencial para entender o controle de versão do Git que não está exemplificado na imagem é o já citado _merge_. O _merge_ se dá quando o desenvolvedor termina a funcionalidade que ele tinha em mente desenvolver quando abriu a sua _branch_. O objetivo é fazer essa funcionalidade entrar no código legado, na _branch_ prioritária. O _merge_ pode ser entendido como uma mescla, um processo que mantêm o que está lá e insere o que é novo sem quebrar tudo.

Dessa forma, podemos ver que o controle de versões comporta-se seguindo a metáfora de uma árvore, na qual há um tronco (a _branch_ prioritária) e para cada alteração, cria-se um galho que carrega consigo todas as propriedades da árvore ao qual ele pertence.

## Mas e o Github?

O Github é uma interface web para visualização do fluxo do Git. É algo como uma rede social para controle e visualização dos repositórios e controles de versão em Git que anteriormente ficavam somente em uma máquina ou em uma rede privada de usuários. Podemos dizer que o Github está para o Git como Wix está para o desenvolvimento Front End. Ele permite que essa tecnologia que foi feita pensando em possibilitar e aprimorar o desenvolvimento coletivo de software seja ainda mais ampla, colaborativa e fácil de usar.

## Mão na massa

Agora que você já sabe um pouco mais sobre o porquê do Git existir e a sua importância para um desenvolvedor, tá na hora de você colocar a mão na massa e destravar com o Git (e o Github) de uma vez por todas!

Primeiramente, se você ainda não tem uma conta no Github, crie agora em [Criar a sua conta](https://github.com/join).

### Repositórios

Os repositórios podem ser locais ou remotos. Local significa que ele está sendo salvo na sua máquina, tendo o controle de versão registrado no seu computador. Um repositório remoto é um repositório de código que tem o seu controle de versão e _branches_ armazenados em um portal de distribuição e controle de repositórios online, como o Github, o [GitLab](https://about.gitlab.com/) e o [BitBucket](https://bitbucket.org/). Copiando um repositório remoto, você pode entrar para o fluxo de trabalho de um projeto novo ou já em andamento, trazendo para o seu computador o código de todas as _branches_ que você tenha autorização para acessar e alterar.

### Adicionando repositórios remotos

Como já dito, os repositórios remotos são versões de projetos seus ou de outros que estão armazenados em algum lugar da internet. Adicionar um repositório remoto é basicamente indicar para o seu Git onde o seu código está sendo armazenado. Você pode adicionar utilizando a URL do repositório (ou do fork de algum usuário).

```
git remote add <nome> <url-do-repositorio>
```

O **nome** trata-se de um nome único de repositório remoto na sua máquina. Ele pode ser qualquer coisa, mas necessariamente precisa ser diferente de outros nomes que você já tenha dado para repositórios que você já tenha adicionado.

Para ver a lista de repositórios remotos que você já adicionou, execute o seguinte comando:

```
git remote -v
```

### Alterando repositórios remotos

Pode ser que você queira mudar a URL atribuída a algum dos repositórios remotos que você adicionou.

Para fazer isso, use o seguinte comando:

```
git remote set-url <um-nome-de-repositorio-existente> <nova-url>
```

Lembre-se de executar o _**git remote -v**_ depois de alterar a URL para confirmar se a sua alteração funcionou.

### Criando uma branch (localmente e remotamente)

Então você escolhe um repositório (ou o cria) e quer começar a codar. Tudo bem, mas antes disso você precisa de um _branch_ para chamar de sua. Para criar uma _branch_ localmente, roda o seguinte comando:

```
git branch <nome-da-nova-branch>
```

Em seguida, confira se a sua _branch_ aparece listada entre as suas _branches_ com

```
git branch
```

Para mudar de _branch_ de trabalho, basta digitar

```
git checkout <nome-da-branch>
```

Para simplificar o trabalho e você não ter que criar e fazer o _checkout_ com dois comandos, basta usar o seguinte comando:

```
git checkout -b <nome-da-nova-branch>
```

Legal, agora a sua nova _branch_ está criada localmente! Agora, supondo que você fez alterações bem legais no código e quer subir um [Pull Request](https://help.github.com/pt/github/collaborating-with-issues-and-pull-requests/about-pull-requests), basta você executar os seguintes comandos:

```
git add .
git commit -m 'Sua descrição de commit'
git push origin <nome-da-branch>
```

O primeiro comando (_**add**_) adiciona os arquivos alterados ao seu _commit_, o ponto seguinte indica que todos os arquivos alterados devem ser adicionados ao _commit_. Caso você deseje adicionar somente uma ou mais alterações, basta adicionar o caminho do arquivo referente à alteração. Caso você não lembre do caminho, basta usar o comando que lista todas as alterações:

```
git status
```

O segundo comando (_**commit**_) cria um novo commit para a sua _branch_. A flag **-m** serve para você adicionar a mensagem do _commit_ diretamente no mesmo comando, que é o parâmetro que vem em seguida entra aspas simples.

### Deletando uma _branch_ (localmente e remotamente)

Para deletar uma _branch_ local, não tem segredo. Basta utilizar o comando:

```
git branch -d <nome-da-branch>
```

Lembre-se sempre de confirmar se a _branch_ foi realmente deletada utilizando o _**git branch**_.

Agora, para deletar uma _branch_ remota, basta que você use o seguinte comando:

```
git push origin --delete <nome-da-branch>
```

Lembrando que para o Git, **_origin_** indica a origem desse repositório, ou seja, o repositório que está online, enquanto a sua cópia é remota. Por isso usa-se a referência **_origin_**.

### Desfazer um _commit_

Para desafazer um commit localmente, basta utilizar o comando _**git reset**_. Por exemplo, se você quer desfazer o seu último _commit_, execute o seguinte comando:

```
git reset --soft HEAD~1
```

A flag **_--soft_** mantém as alterações feitas nos arquivos que você adicionou ao _comitt_, apenas o _commit_ é revertido. Entretanto, se você preferir reverter o _commit_ e as alterações feitas e adicionadas a ele, execute esse comando no lugar do anterior:

```
git reset --hard HEAD~1
```

O parâmetro _**HEAD~1**_ aponta para o seu último commit. Se você prefere desfazer algum _commit_ anterior a esse, você pode utilizar o comando **_git reflog_** para ter um registro de todos os _commits_ anteriores. Tendo acesso aos _commits_ anteriores, basta utilizar o mesmo comando _**reset**_ substituindo o _**HEAD~1**_ pelo hash referente ao _commit_ que você deseja desfazer:

```
git reset --soft <hash-do-commit>
```

Para desfazer um _commit_ remoto, você pode utilizar o comando **_git revert_** para desfazer o _commit_ localmente e, então, fazer o _**push**_ das alterações para a _branch_ remota.

Para isso, primeiro execute o _**reflog**_ e depois o _**revert**_:

```
git reflog
git revert <hash-do-commit>
```

Por fim, faça o push para a _branch_ remota desejada.

**E aí? Gostou do artigo? Acha que faltou abordar alguma questão?**

**Comenta aqui e me deixa saber se esse conteúdo te ajudou de alguma forma.**

_**Até a próxima!**_
