# Contribuindo para lucasrafaldini.github.io 🤝

Obrigado pelo interesse em contribuir! Este projeto é um blog e laboratório pessoal de engenharia de software, sistemas e cibersegurança, construído sobre Jekyll, GitHub Pages e Vanilla JavaScript, com um design system autoral inspirado no estilo **Swiss Technical Blueprint / RYVN**.

---

## 🤖 Repositório Agêntico (Agentic Development)

Este projeto adota práticas avançadas de desenvolvimento com agentes de IA (Claude Code, Antigravity, Cursor):
- Consulte **[CLAUDE.md](CLAUDE.md)** para instruções completas de arquitetura e padrões.
- Utilize as **[skills/](skills/)** para tarefas automatizadas:
  - `python3 skills/zero-dash-linter/lint.py`: Validação de pontuação e tipografia.
- Veja os papéis especializados de agentes em **[.agents/](.agents/)**.

---

## 📐 Regras de Qualidade e Estilo

1. **Atenção (Regra de Tipografia)**: O site adota como padrão estrito o **não uso de travessões (em-dash / en-dash)**. Substitua por dois pontos (`:`), parênteses `( )`, vírgula ou hífen padrão (`-`).
2. **Respeito ao Design System**: Siga os tokens e paleta do Swiss Technical Blueprint em `css/main.css`.
3. **Paridade Bilíngue**: Todo conteúdo adicionado deve manter versões simultâneas em português (`lang-pt`) e inglês (`lang-en`).

---

## 🛠️ Como Executar Localmente

### Opção 1: Jekyll (Ambiente Completo com Ruby)
```bash
git clone https://github.com/lucasrafaldini/lucasrafaldini.github.io.git
cd lucasrafaldini.github.io
bundle install
bundle exec jekyll serve
```
Acesse em: `http://localhost:4000`

### Opção 2: Servidor HTTP Simples (Python / Vanilla)
```bash
python3 -m http.server 8000
```
Acesse em: `http://localhost:8000`

---

## 📋 Fluxo de Trabalho (Git Workflow)

1. **Faça um Fork** do repositório para a sua conta no GitHub.
2. **Crie uma branch** para a sua modificação:
   ```bash
   git checkout -b feat/minha-melhoria
   ```
3. **Valide a tipografia**:
   ```bash
   python3 skills/zero-dash-linter/lint.py
   ```
4. **Faça o commit e envie para o seu fork**:
   ```bash
   git commit -m "feat: adiciona nova funcionalidade"
   git push origin feat/minha-melhoria
   ```
5. **Abra um Pull Request** detalhando o que foi feito.

---

Obrigado por ajudar a construir uma web aberta, limpa e funcional! 🚀
