---
layout: post
comments: true
title: "Back to Basics #1 - O Protocolo HTTP"
date: 2020-06-02
---

Para iniciar os trabalhos neste blog, eu decidi iniciar uma série de posts sobre tópicos que são básicos, porém essenciais para desenvolvedores iniciantes. Como primeiro assunto, achei que seria legal falar sobre o famoso HTTP que todo mundo uso e pouca gente entende. Então, vamos às entranhas do protocolo.

## O que é um protocolo?

Sabem quando te chamam para uma festa e o traje é esporte fino? Sabe quando dizem que, por exemplo, um juiz ou um presidente da república não devem usar palavras de baixo-calão (ao menos, não em público)? Isso é o que chamamos de "decoro" e, grosso modo, podemos dizer que isso é um protocolo social. Um protocolo é basicamente algo que todo mundo combina mesmo sem falar nada, então fica entendido entre todos que as coisas devem acontecer de um jeito e somente desse jeito, ou não acontecerão de nenhuma forma.

Trazendo isso para a Web, o protocolo HTTP (sigla para _Hyper Text Transfer Protocol_) é um acordo que estabelece um decoro para a transferência de dados entre Clientes e servidores, assim ninguém fala "línguas" diferentes na hora de trocar informações.

## Como isso funciona?

O HTTP é um protocolo da camada de aplicação do modelo TCP/IP. Ou seja, algo nada inteligível para um iniciante, mas vamos lá: o protocolo funciona em cima do modelo Cliente-Servidor, que pressupõe que um Cliente (um computador, um celular, um smartwatch, etc) faz requisições de recursos para um Servidor (bem, isso não tem muitas analogias prontas, mas por ora vamos dizer que é um computadorzasso que fica só armazenando arquivos em geral). Quando você acessa um site, por exemplo, você está fazendo uma requisição para um servidor de um ou mais arquivos que compõem o site que você deseja acessar; o servidor verifica se a sua requisição é válida e te envia esses arquivos; assim, você finalmente vê o site na sua tela. Geralmente, a página vem _renderizada_ em um arquivo HTML (sigla para _Hyper Text Markup Language_).

## Tipos de requisições

A primeira linha de toda requisição identifica o seu tipo. Requisições podem ter _alguns_ tipos.Os principais tipos são:

- **GET**: Requisição para pegar dados do servidor, sejam esses dados uma página, uma imagem ou a resposta para algum comportamento feito pelo Cliente;

- **HEAD**: Semelhante ao GET, mas retorna somente o header da página para o Cliente;

- **POST**: Esse tipo de requisição pode ser compreendido como o oposto ao GET. Aqui, o Cliente envia dados para o servidor, sejam eles dados de login, upload de imagens ou até uma mensagem em um serviço como o Whatsapp, por exemplo;

- **PUT**: Semelhante ao POST, com a diferença de que é usado para quando o Cliente quer enviar somente uma parte de um registro e não um registro completo novo, como, por exemplo, quando você altera o seu nome de usuário em uma rede social. Para que o Cliente não precise enviar todos os seus dados novamente, sobrescrevendo o seu antigo cadastro, ele envia um PUT somente com o novo nome;

- **DELETE**: Requisição de deleção de algum registro no servidor.

## Cabeçalhos (headers) de Requisições

Toda requisição, portanto, tem um tipo e esse tipo é discriminado no seu cabeçalho. Um exemplo de cabeçalho seria:

```
GET / HTTP/1.1
Host: www.google.com
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:76.0) Gecko/20100101 Firefox/76.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3
Connection: close
Cookie:
```

A primeira linha desse cabeçalho identifica o tipo (método) da requisição. Como podemos ver, trata-se de um **GET**. Ainda na primeira linha, podemos ver qual é o caminho dentro do Servidor (Host) para onde está sendo feita a requisição. Nesse caso, o Cliente quer acessar a página raiz, " / ". O terceiro e último dado da primeira linha diz para o servidor qual é a versão do protocolo HTTP utilizada. Nesse caso, **HTTP/1.1**.

O restante do conteúdo do header pode variar, relativamente. Sua representação sempre é estruturada seguindo uma ordem de **Nome:Valor**.

Os dados mais comuns enviados em um header são:

- **Host**: Nome de domínio do servidor, ou seja, o domínio para o qual você está tentando enviar a sua requisição, como, por exemplo, _www.facebook.com_ ou _www.google.com_;

- **User-Agent**: Esse dados serve para identificar para o Servidor (Host) quem está fazendo a requisição, contendo dados como o navegador, a versão e o sistema operacional do Cliente;

- **Accept**: Diz para o Servidor(Host) quais tipos de dados o Cliente é capaz de entender. Isso é essencial para que o Servidor possa responder a requisição do Cliente de uma maneira que ele entenda. Exemplos desse dado são _text/plain_ e _application/json_;

- **Content-Type**: Esse dado é semelhante ao já mencionado _Accept_. A diferença é que nesse caso, estamos identificando qual é o tipo de dados enviado na requisição. Os exemplos _text/plain_ e _application/json_ também se aplicam;

- **Connection**: Define se a conexão com o Servidor (Host) deve ser mantida aberta para requisições futuras ou não. Quando a conexão é mantida, envia-se **keep-alive**; quando não, envia-se **close**;

- **Cookie**: O _Cookie_ auxilia nos processos de manteneção da sessão do usuário e de identificação do cliente. Como o HTTP é um protocolo [stateless](https://pt.wikipedia.org/wiki/Protocolo_sem_estado), ele não tem como manter um "estado" do Cliente. Dessa forma, quando você faz login em algum site e, em seguida, deseja executar alguma tarefa que necessita que o usuário esteja logado, você precisaria se logar novamente. Para que esse processo redundante seja evitado para o Cliente, utilizamos os _Cookies_. Ele nada mais é, _grosso modo_, que uma string [hasheada](https://pt.wikipedia.org/wiki/Fun%C3%A7%C3%A3o_hash) que pode carregar dados do usuário, como seu login, senha e dados complementares ao já mencionado _User-Agent_;
- **Referer**: Esse dado fornece ao Servidor(Host) o endereço de onde a requisição partiu, o que pode ser usado para rastreamento e análises de uso de um site, por exemplo;
- **Origin**: Esse dado é bastante semelhante com o _Referer_, mas leva um dado mais simplificado sobre a origem da requisição para o Servidor(Host). Enquanto o _Referer_ costuma enviar o caminho inteiro de uma URL (como, por exemplo, www.exemplo.com/home/login), o _Origin_ enviaria algo como www.exemplo.com.

## Tudo que sobe, desce

E não é diferente com as requisições. Assim como o cliente precisa enviar a sua requisição, identificando-se e segindo os padrões de _Header_, o Servidor(Host) precisa enviar uma resposta a essa requisição, o que chamamos de _**Response**_.

Um exemplo de _**Response**_ é:

```
HTTP/1.1 200 OK
Date: Tue, 02 Jun 2020 21:45:35 GMT
Expires: -1
Cache-Control: private, max-age=0
Content-Type: text/html; charset=UTF-8
Strict-Transport-Security: max-age=31536000
Server: Apache/2.2.14
X-Frame-Options: SAMEORIGIN
Set-Cookie:
Connection: close
Content-Length: 194814
```

Como já vimos, a primeira linha é bastante semelhante a primeira linha do Header enviado pelo cliente, com a diferença de que, nesse caso, o cliente recebe a versão do HTTP e o estado da resposta ([**Response Status**](https://pt.wikipedia.org/wiki/Lista_de_c%C3%B3digos_de_estado_HTTP)).

Há dezenas de códigos de estado e cabe ao desenvolvedor investigar qual é mais adequado, caso ele seja o responsável por enviá-lo do servidor. Para os casos nos quais o desenolvedor encontra-se do lado do Cliente, uma rápida busca pelo número do código fornece respostas esclarecedoras.

De qualquer forma, é importante que tenhamos um conhecimento _genérico_ sobre esses códigos para que não sejamos pegos totalmente desprevinidos quando surgir um código inédito. Para facilitar a memorização, podemos classificar genericamente os códigos pelo seu digito inicial:

- **Iniciados em 1 (101, 102, etc)**: Retorna informações sobre a solicitação, se ela foi aceita ou se o processo continua em andamento;

- **Iniciados em 2(201, 202, etc)**: Retorna que a solicitação foi executada com sucesso, sendo seus tipos referenciados aos diferentes tipos de solicitações que podem ser executadas;

- **Iniciados em 3(301, 302, etc)**: Retorna a informação de que há necessidade de redirecionamento para que a execução da solicitação possa ser concluída;

- **Iniciados em 4(401, 402, etc)**: Retorna a informação de que há um erro por parte do Cliente na solicitação;

- **Iniciados em 5(501, 502, etc)**: Retorna a informação de que há um erro por parte do Servidor(Host) na solicitação.

Outros dados retornados em uma _**Response**_ são:

- **Date**: Data na qual a resposta foi originada;

- **Expires**: Informação sobre quando o conteúdo deve ser considerado desatualizado. O valor _-1_ indica que o conteúdo expira imediatamente após ser enviado;

- **Cache-Control**: Fornece informações sobre políticas de [_cache_](https://pt.wikipedia.org/wiki/Cache);

- **Server**: Fornece informações sobre o servidor;

- **Set-Cookie**: Fornece cookies enviados do servidor para o Cliente;

- **X-Frame-Options**: Fornece informações para que o navegador renderize (ou não) uma página em `<frame>` ou `<iframe>`.

## Mas e o body?

É claro, além dos cabeçalhos, há o corpo (body) das requisições (_requests_) e das respostas (_responses_). Nele geralmente são incluídos dados referentes à solicitação que não identificam o Cliente/Servidor ou que não possuem dados sensíveis que, se interceptados, podem causar problemas de segurança.

## HTTP x HTTPS

O **HTTPS** (_Hypertext Transfer Protocol Secure_) nada mais é que uma versão mais segura do HTTP. Trata-se de uma junção do HTTP com o protocolo SSL(_Secure Sockets Layer_)/TLS(_Transport Layer Security_) criada para que seja segura a trasmissão de informações sensíveis como dados pessoais, dados de pagamentos e de login. Os protocolos SSL/TLS permitem que os dados sejam transmitidos por meio de uma conexão criptografada e exige que o Servidor(Host) e o Cliente seja autênticos. O HTTPS se tornou primariamente necessário por conta do aumento massivo de utilização de conexões Wi-Fi, nas quais torna-se possível realizar ataques interceptando os dados entre a saída do Cliente e a entrada no modem Wi-Fi, por exemplo. Tais ataques são conhecidos como _Man in the Middle_.

**E aí? Gostou do artigo? Acha que faltou abordar alguma questão?**

**Comenta aqui e me deixa saber se esse conteúdo te ajudou de alguma forma.**

_**Até a próxima!**_
