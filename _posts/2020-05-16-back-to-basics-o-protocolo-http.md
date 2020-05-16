---
layout: post
comments: true
title: "Back to Basics #1 - O Protocolo HTTP"
date: 2020-05-16
---

Para iniciar os trabalhos neste blog, eu decidi iniciar uma série de posts sobre tópicos que são básicos, porém essenciais para desenvolvedores iniciantes. Como primeiro assunto, achei que seria legal falar sobre o famoso HTTP que todo mundo uso e pouca gente entende. Então, vamos às entranhas do protocolo.

## O que é um protocolo?

Sabem quando te chamam para uma festa e o traje é esporte fino? Sabe quando dizem que, por exemplo, um juiz ou um presidente da república não devem usar palavras de baixo-calão (ao menos, não em público)? Isso é o que chamamos de "decoro" e, grosso modo, podemos dizer que isso é um protocolo social. Um protocolo é basicamente algo que todo mundo combina mesmo sem falar nada, então fica entendido entre todos que as coisas devem acontecer de um jeito e somente desse jeito, ou não acontecerão de nenhuma forma.

Trazendo isso para a Web, o protocolo HTTP (sigla para *Hyper Text Transfer Protocol*) é um acordo que estabelece um decoro para a transferência de dados entre clientes e servidores, assim ninguém fala "línguas" diferentes na hora de trocar informações.

## Como isso funciona?

O HTTP é um protocolo da camada de aplicação do modelo TCP/IP. Ou seja, algo nada inteligível para um iniciante, mas vamos lá: o protocolo funciona em cima do modelo Cliente-Servidor, que pressupõe que um Cliente (um computador, um celular, um smartwatch, etc) faz requisições de recursos para um Servidor (bem, isso não tem muitas analogias prontas, mas por ora vamos dizer que é um computadorzasso que fica só armazenando arquivos em geral). Quando você acessa um site, por exemplo, você está fazendo uma requisição para um servidor de um ou mais arquivos que compõem o site que você deseja acessar; o servidor verifica se a sua requisição é válida e te envia esses arquivos; assim, você finalmente vê o site na sua tela. Geralmente, a página vem *renderizada* em um arquivo HTML (sigla para *Hyper Text Markup Language*).

## Tipos de requisições