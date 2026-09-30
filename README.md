# lucasrafaldini.github.io

[![Agentic Repo](https://img.shields.io/badge/Agentic-CLAUDE.md-00d2ff?style=flat-square)](CLAUDE.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-181717?style=flat-square&logo=github)](https://lucasrafaldini.github.io)

Repositório do meu site pessoal, blog e laboratório de sistemas. Desenvolvido sobre Jekyll, GitHub Pages e Vanilla JavaScript, adotando a estética visual **Swiss Technical Blueprint / RYVN**: superfícies escuras, coordenadas de engenharia, tipografia técnica, malha vetorial interativa a 60fps e telemetria de sistemas.

---

## 🤖 Arquitetura Agêntica (Agentic Repo)

Este repositório é totalmente otimizado para desenvolvimento com agentes autônomos e LLMs (Claude Code, Antigravity, Cursor, Windsurf):

- 📜 **[CLAUDE.md](CLAUDE.md)**: Guia canônico com tokens de design, regras de arquitetura e convenções técnicas.
- 🛠️ **[skills/](skills/)**: Habilidades modulares reutilizáveis com especificação padrão `SKILL.md`:
  - `skills/zero-dash-linter/`: Linter automatizado em Python que valida a regra estrita de não usar travessões.
  - `skills/swiss-blueprint-styler/`: Receitas de design system para cards, telemetria e botões técnicos.
  - `skills/cardputer-bin-curator/`: Validação e curadoria de firmwares portáteis em `cardputer-bins`.
  - `skills/bilingual-content-sync/`: Protocolo de sincronismo e paridade entre inglês e português.
- 👥 **[.agents/](.agents/)**: Perfis especializados de agentes (`blueprint-architect`, `typography-linter`, `cardputer-curator`, `dossier-author`).

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

### Opção 3: Executar Linter de Tipografia
```bash
python3 skills/zero-dash-linter/lint.py
```

---

## 📜 Licença

Distribuído sob a licença MIT. Sinta-se livre para explorar, aprender, criar issues e enviar seus Pull Requests!
