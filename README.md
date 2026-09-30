# lucasrafaldini.github.io

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026-ED5C9B?style=flat-square&logo=hacktoberfest&logoColor=white)](https://hacktoberfest.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-00d2ff?style=flat-square)](CONTRIBUTING.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-181717?style=flat-square&logo=github)](https://lucasrafaldini.github.io)

Repositório do meu site pessoal, blog e laboratório de sistemas. Desenvolvido sobre Jekyll, GitHub Pages e Vanilla JavaScript, adotando a estética visual **Swiss Technical Blueprint / RYVN**: superfícies escuras, coordenadas de engenharia, tipografia técnica, malha vetorial interativa a 60fps e telemetria de sistemas.

---

## 🎃 Hacktoberfest 2026

Este repositório participa ativamente do **Hacktoberfest**! Se você quer contribuir para projetos open source, melhorar ferramentas ou exercitar código limpo, é muito bem-vindo.

- 📖 **Guia de Contribuição**: Confira as regras e o passo a passo em [CONTRIBUTING.md](CONTRIBUTING.md).
- 📌 **Backlog de Tarefas**: Consulte as 8 issues preparadas para o evento em [.github/HACKTOBERFEST_ISSUES.md](.github/HACKTOBERFEST_ISSUES.md).
- 🏷️ **Labels Oficiais**: Fique atento às tags `hacktoberfest` e `good first issue`.

> **Regra de Estilo (Tipografia)**: O projeto segue uma convenção estrita de **não usar travessões (em-dash / en-dash)**. Use dois pontos (`:`), parênteses `( )` ou hífen comum (`-`).

---

## 🧭 Estrutura do Site

- **Home (`/`)**: Manifesto de engenharia com wireframe 3D interativo, telemetria ao vivo e composição simétrica de perfis.
- **Posts (`/posts/`)**: Artigos sobre arquitetura de software, inteligência artificial, privacidade e ecossistema de tecnologia.
- **Projetos (`/projetos/`)**: Integração dinâmica com a API do GitHub com cartões blueprint e rastreadores de calibração.
- **Estudos (`/estudos/`)**: Dossiês analíticos (ex: Símbolos da Era do Gelo na Europa e notação paleolítica).
- **Cardputer Bins (`/cardputer-bins/`)**: Catálogo interativo de firmwares portáteis para o dispositivo M5Cardputer.
- **O Décimo Círculo (`/decimo-circulo/`)**: Simulação em Canvas 2D de um aquário procedural a 60fps.

---

## 🛠️ Executando Localmente

### Opção 1: Jekyll (Completo)
```bash
git clone https://github.com/lucasrafaldini/lucasrafaldini.github.io.git
cd lucasrafaldini.github.io
bundle install
bundle exec jekyll serve
```
Acesse em: `http://localhost:4000`

### Opção 2: Python HTTP Server (Para páginas estáticas e JS)
```bash
python3 -m http.server 8000
```
Acesse em: `http://localhost:8000`

---

## 📜 Licença

Distribuído sob a licença MIT. Sinta-se livre para explorar, aprender, criar issues e enviar seus Pull Requests!
