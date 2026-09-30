# Contribuindo para lucasrafaldini.github.io 🎃 (Hacktoberfest Ready)

Primeiramente, obrigado pelo interesse em contribuir! Este projeto é um blog e laboratório pessoal de engenharia de software, sistemas e cibersegurança, construído sobre Jekyll, GitHub Pages e Vanilla JavaScript, com um design system autoral inspirado no estilo **Swiss Technical Blueprint / RYVN**.

---

## 🎃 Hacktoberfest Guidelines

Este repositório participa ativamente do **Hacktoberfest**. Valorizamos contribuições com foco em qualidade, acessibilidade, performance e documentação.

### Regras do Hacktoberfest
1. **Qualidade em Primeiro Lugar**: PRs contendo apenas pequenas alterações cosméticas triviais (ex: adicionar uma quebra de linha aleatória ou corrigir um único espaço) não serão aceitos como válidos.
2. **Issues Vinculadas**: Antes de abrir um Pull Request, comente na Issue correspondente para que ela seja atribuída a você, evitando trabalho duplicado.
3. **Labels**:
   - `hacktoberfest`: Marca a issue e PR como parte do evento.
   - `good first issue`: Ideal para quem está começando.
   - `hacktoberfest-accepted`: Aplicado quando o PR for aprovado e fundido (ou considerado válido pelos mantenedores).
4. **Respeito ao Design System**: O site segue o padrão visual Swiss Technical Blueprint (paleta escura com azul ciano `#00d2ff`, tipografia monospace e sem serifa técnica, linhas de calibração e cartões técnicos).

> **Atenção (Regra de Tipografia)**: O site adota como padrão estrito o **não uso de travessões (em-dash / en-dash)**. Substitua por dois pontos (`:`), parênteses `( )`, vírgula ou hífen padrão (`-`).

---

## 🛠️ Como Executar Localmente

### Opção 1: Jekyll (Ambiente Completo com Ruby)
```bash
# Clone o repositório
git clone https://github.com/lucasrafaldini/lucasrafaldini.github.io.git
cd lucasrafaldini.github.io

# Instale as dependências do Bundler
bundle install

# Inicie o servidor local do Jekyll
bundle exec jekyll serve
```
Acesse em: `http://localhost:4000`

### Opção 2: Servidor HTTP Simples (Python / Vanilla)
Se você estiver trabalhando apenas em páginas estáticas (HTML, CSS e JavaScript client-side):
```bash
python3 -m http.server 8000
```
Acesse em: `http://localhost:8000`

---

## 📋 Fluxo de Trabalho (Git Workflow)

1. **Faça um Fork** do repositório para a sua conta no GitHub.
2. **Crie uma branch** para a sua funcionalidade ou correção:
   ```bash
   git checkout -b feat/minha-melhoria-hacktoberfest
   ```
3. **Faça os commits** seguindo mensagens claras e convencionais:
   ```bash
   git commit -m "feat: adiciona atalho de busca rapida na interface"
   ```
4. **Envie para o seu fork**:
   ```bash
   git push origin feat/minha-melhoria-hacktoberfest
   ```
5. **Abra um Pull Request** detalhando o que foi feito e referenciando a issue (ex: `Fixes #3`).

---

## 🎨 Estrutura de Diretórios

- `_posts/`: Artigos e reflexões em Markdown.
- `_layouts/`: Templates base Jekyll (`default.html`).
- `css/main.css`: Design system completo em CSS puro com variáveis customizadas.
- `js/`: Scripts modulares client-side (`projects.js`, `theme.js`, etc.).
- `estudos/`: Dossiês de pesquisa histórica e técnica (`simbolos-era-do-gelo`, etc.).
- `cardputer-bins/`: Catálogo de firmwares portáteis para M5Cardputer.
- `decimo-circulo/`: Aplicação interativa em Canvas 2D local.

---

Obrigado por ajudar a construir uma web aberta, limpa e funcional! 🚀
