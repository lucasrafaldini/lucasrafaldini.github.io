---
layout: default
title: "Incidente da AWS de 20/10: por trás da queda"
title_en: "AWS Outage on 10/20: Behind the Collapse"
description: "Uma leitura resumida e crítica do incidente da AWS de 20/10, com foco nas falhas em DynamoDB, EC2, NLB e serviços dependentes."
author: "Lucas Rafaldini"
tags: ["aws", "devops", "sre", "awsoutage", "postmortem", "dynamodb", "rca"]
summary: "Uma análise do grande incidente da AWS em 20/10 e de como uma falha de DNS no DynamoDB se propagou por EC2, NLB e serviços dependentes."
summary_en: "An analysis of the major AWS incident on 10/20 and how a DynamoDB DNS failure propagated through EC2, NLB, and dependent services."
published: true
---

<section class="lang-en" markdown="1">

# AWS Outage on 10/20: Behind the Collapse

I read the breakdown of AWS's 10/20 incident that took down the internet so you don't have to.

Total impact window: 19/10 23:48 PDT - 20/10 14:20 PDT.

Three distinct failure periods affected multiple AWS services.

Mainly affected: DynamoDB, EC2, NLB, and services depending on them such as Lambda, ECS/EKS, Connect, STS, IAM, Redshift, and others.

## Summary Timeline

### DynamoDB API errors

23:48 19/10 - 02:40 20/10

The failure was caused by a race condition in DynamoDB's automated DNS management system.

The regional endpoint lost its IP records, blocking connections.
Full recovery at 02:40 after DNS restoration and cache expiration.

### EC2 new instances / networking

23:48 19/10 - 13:50 20/10

The DWFM subsystem could not validate leases for physical servers (“droplets”) because it depended on DynamoDB.

After DNS came back, lease recovery took time and caused “insufficient capacity” issues plus Network Manager delays in network propagation.

Recovery in phases:

- Leases normalized: 05:28
- Network normalized: 10:36
- Throttles removed: 13:50

### Network Load Balancer (NLB)

05:30 - 14:09 20/10

Health check failures occurred while bringing up new instances before network propagation had completed.

This caused oscillation between “healthy node” and “node removed.”

Automatic failover was disabled at 09:36 and returned to stable capacity.
It was re-enabled at 14:09.

## Service Impact

- Lambda: creation/update errors, SQS/Kinesis delays, partial throttling until 14:15.
- ECS/EKS/Fargate: launch and scaling failures until 14:20.
- Amazon Connect: errors in calls, chats, routing, and APIs; recovery at 13:20.
- STS/IAM: authentication failures between 23:45 - 01:25; a second degradation between 08:31 - 09:59.
- Redshift: IAM query/function failures until 02:21; degraded clusters until 21/10 04:05.
- Other services: Airflow, Outposts, Support Center, and more were indirectly impacted.

## Main Technical Causes

- Race condition between two DynamoDB DNS Enactor components: an incorrect plan removed IP records.
- Critical dependencies on DynamoDB for core systems such as DWFM for EC2 and Network Manager.
- Network propagation backlog causing failures in NLB and dependent services.

## Planned Corrective Actions

- Disable and fix DNS Planner/DNS Enactor automation, including the race condition and extra safeguards.
- Add rate control to NLB to avoid excessive capacity removal.
- Create a new DWFM test suite focused on large-scale recovery.
- Improve EC2 throttling based on queue size.
- Review critical dependencies and recovery time across the stack.

This was a complex, cascading incident caused by a latent defect in DynamoDB DNS management, propagating failures into EC2, NLB, and many dependent services.

AWS promised stronger automation, controls, and test processes to mitigate similar events.

</section>

<section class="lang-pt" markdown="1">

# Incidente da AWS de 20/10: por trás da queda

Eu li o detalhamento do incidente da AWS do dia 20/10 que derrubou a internet toda para que você não tenha que ler.

Período total de impacto: 19/10 23:48 PDT - 20/10 14:20 PDT.

Três períodos distintos de falha afetaram múltiplos serviços AWS.

Principais afetados: DynamoDB, EC2, NLB e serviços que dependem deles, como Lambda, ECS/EKS, Connect, STS, IAM, Redshift, entre outros.

## Linha do Tempo Resumida

### DynamoDB API erros

23:48 19/10 - 02:40 20/10

Falha causada por race condition no sistema automatizado de gerenciamento DNS da DynamoDB.

Endpoint regional ficou sem registros IP, bloqueando conexões.
Recuperação completa às 02:40, com DNS restaurado e caches expirados.

### EC2 novas instâncias / rede

23:48 19/10 - 13:50 20/10

O subsystem DWFM não conseguia validar leases de servidores físicos (“droplets”) por depender da DynamoDB.

Após o DNS voltar, o restabelecimento de leases demorou e causou problemas de “insufficient capacity” e atrasos no Network Manager para propagação de rede.

Recuperação em fases:

- Leases normalizados: 05:28
- Rede normalizada: 10:36
- Throttles removidos: 13:50

### Network Load Balancer (NLB)

05:30 - 14:09 20/10

Falhas no health check ao trazer novas instâncias sem a rede já propagada.

Isso resultou em alternância entre “node saudável” e “node removido”.

O failover automático foi desativado às 09:36, voltando à capacidade estável.
Foi reativado às 14:09.

## Impacto por Serviço

- Lambda: erros em criação e updates, atrasos em SQS/Kinesis, throttling parcial até às 14:15.
- ECS/EKS/Fargate: falhas de lançamento e escalonamento até às 14:20.
- Amazon Connect: erros em chamadas, chats, roteamento e APIs; recuperação às 13:20.
- STS/IAM: falhas de autenticação entre 23:45 - 01:25; nova degradação entre 08:31 - 09:59.
- Redshift: queries/funções IAM falhando até 02:21; clusters degradados até 21/10 às 04:05.
- Outros serviços: Airflow, Outposts, Support Center e mais foram impactados indiretamente.

## Causas Técnicas Principais

- Race condition entre dois componentes DNS Enactor da DynamoDB: um plano incorreto removeu registros IP.
- Dependência crítica de DynamoDB por sistemas centrais como DWFM no EC2 e Network Manager.
- Backlog na propagação de rede causando falhas no NLB e nos serviços dependentes.

## Ações Corretivas Planejadas

- Desativar e corrigir a automação DNS Planner/DNS Enactor, incluindo a race condition e proteções extras.
- Adicionar controle de velocidade no NLB para evitar remoção excessiva de capacidade.
- Criar nova suíte de testes para DWFM voltada à recuperação em escala.
- Melhorar o mecanismo de throttling no EC2 com base no tamanho da fila.
- Revisar dependências críticas e tempo de recuperação em toda a stack.

Foi um incidente complexo e escalonado, originado por um defeito latente no gerenciamento DNS da DynamoDB, propagando falhas para EC2, NLB e diversos serviços dependentes.

A AWS prometeu fortalecer automações, controles e processos de teste para mitigar eventos similares.

</section>