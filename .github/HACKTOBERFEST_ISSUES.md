# 🎃 Backlog de Issues: Hacktoberfest 2026

Abaixo estão as 8 issues planejadas e estruturadas para o Hacktoberfest. Você pode criá-las automaticamente executando `./scripts/create_hacktoberfest_issues.sh` com o `gh` CLI autenticado ou criá-las manualmente na interface do GitHub.

---

### Issue 1: `[Hacktoberfest] [A11y] Adicionar atributos ARIA e suporte a navegação por teclado nos filtros do cardputer-bins`
- **Labels**: `hacktoberfest`, `good first issue`, `accessibility`, `ui`
- **Contexto**: A página `cardputer-bins/index.html` possui uma barra de filtros por categoria (ALL, SEC, SYS, GAME, MEDIA, TOOL).
- **Escopo**:
  - Adicionar `role="tablist"` ao container de filtros e `role="tab"` a cada botão.
  - Gerenciar o estado ativo através de `aria-selected="true/false"`.
  - Suportar navegação por teclas de seta (ArrowLeft / ArrowRight) e Enter/Espaço para selecionar filtros.
  - Assegurar que leitores de tela anunciem a contagem de firmwares filtrados via `aria-live="polite"`.

---

### Issue 2: `[Hacktoberfest] [Feature] Implementar atalho de teclado global (Ctrl/Cmd + K) para paleta de busca rápida`
- **Labels**: `hacktoberfest`, `enhancement`, `feature`
- **Contexto**: O site possui um arquivo amplo de artigos técnicos (`/posts/`) e repositórios open source (`/projetos/`).
- **Escopo**:
  - Criar um modal leve e minimalista em Vanilla JS disparado pelo atalho `Cmd+K` (Mac) ou `Ctrl+K` (Windows/Linux).
  - Indexar títulos, tags e resumos dos posts e projetos disponíveis.
  - Estilizar a janela de busca seguindo o design system Blueprint (fundo escuro, bordas finas com ciano `#00d2ff`, tipografia monospace).
  - Fechar ao pressionar `Escape` ou clicar fora do modal.

---

### Issue 3: `[Hacktoberfest] [i18n] Completar e sincronizar traduções pendentes (EN/PT) na página de Perguntas & Respostas`
- **Labels**: `hacktoberfest`, `good first issue`, `documentation`, `i18n`
- **Contexto**: A página `perguntas&respostas/index.html` possui cards de perguntas e respostas técnicas sobre carreira, cibersegurança e arquitetura.
- **Escopo**:
  - Revisar todos os cartões para garantir que cada um tenha suas respectivas tags `<span class="lang-pt">` e `<span class="lang-en">`.
  - Garantir que as traduções em inglês sejam naturais, técnicas e fiéis ao sentido original em português.
  - Assegurar a ausência total de travessões (`` e ``), substituindo-os por dois pontos, parênteses ou hífens regulares.

---

### Issue 4: `[Hacktoberfest] [Performance] Otimizar carregamento de capas em cardputer-bins com lazy loading nativo e fallback offline`
- **Labels**: `hacktoberfest`, `good first issue`, `performance`
- **Contexto**: O catálogo de firmwares em `cardputer-bins/index.html` carrega dezenas de miniaturas de capas (`.cv`).
- **Escopo**:
  - Adicionar atributos `loading="lazy"` e `decoding="async"` aos elementos `<img>` gerados dinamicamente em `renderCard()`.
  - Implementar um fallback visual caso a imagem não carregue ou esteja offline (um placeholder SVG geométrico sutil no estilo blueprint).
  - Tratar o evento `onerror` das imagens para substituir pelo placeholder sem quebrar o layout do grid.

---

### Issue 5: `[Hacktoberfest] [Feature] Adicionar alternador de visualização (Grid vs. Tabela Técnica) em cardputer-bins`
- **Labels**: `hacktoberfest`, `enhancement`, `feature`
- **Contexto**: Usuários avançados de Cardputer buscam comparar versões, datas e volumes de download rapidamente.
- **Escopo**:
  - Adicionar dois botões na barra de ferramentas de `cardputer-bins/index.html`: `GRID VIEW` e `TABLE VIEW`.
  - Desenvolver uma visualização em tabela técnica (`.cb-table-view`) com colunas ordenáveis: Nome do Firmware, Categoria, Versão, Data de Lançamento e Downloads.
  - Salvar a preferência do usuário no `localStorage`.

---

### Issue 6: `[Hacktoberfest] [SEO & OpenGraph] Enriquecer meta tags OpenGraph e Twitter Cards nos posts individuais`
- **Labels**: `hacktoberfest`, `enhancement`, `seo`
- **Contexto**: O compartilhamento de links de artigos no LinkedIn, X (Twitter) e Telegram pode exibir metadados mais detalhados.
- **Escopo**:
  - Atualizar `_layouts/default.html` para extrair metadados específicos de artigos (`page.date`, `page.tags`, tempo estimado de leitura, autor).
  - Incluir tags `article:published_time`, `article:tag` e `twitter:label1` / `twitter:data1` (tempo de leitura).
  - Validar a formatação de `og:title` e `og:description` bilíngues.

---

### Issue 7: `[Hacktoberfest] [PWA] Implementar Web App Manifest e Service Worker para leitura offline de artigos`
- **Labels**: `hacktoberfest`, `enhancement`, `pwa`
- **Contexto**: Permitir que leitores salvem o site no celular ou desktop como uma aplicação web progressiva (PWA).
- **Escopo**:
  - Criar `manifest.webmanifest` referenciando o novo ícone matemático `∴` (portanto) nas resoluções 192x192 e 512x512.
  - Criar um `sw.js` (Service Worker) leve com estratégia Cache First para assets estáticos (`main.css`, fontes, favicon) e Network First com cache fallback para páginas lidas recentemente.
  - Registrar o Service Worker de forma segura e não bloqueante no `_layouts/default.html`.

---

### Issue 8: `[Hacktoberfest] [CI / Automation] Criar GitHub Action de linter para verificar ausência de travessões (zero em-dashes)`
- **Labels**: `hacktoberfest`, `good first issue`, `ci`, `automation`
- **Contexto**: O repositório possui uma regra estrita de estilo: nenhum texto de documentação, post ou código de marcação deve conter travessões (`` ou ``).
- **Escopo**:
  - Criar um workflow do GitHub Actions em `.github/workflows/lint-typography.yml`.
  - Executar um script leve em Python ou Bash que varra arquivos `.md`, `.html`, `.js` e `.css` em pull requests.
  - Falhar o check da CI com mensagem explicativa amigável caso algum caractere `\u2014`, `\u2013`, `mdash entity` ou `ndash entity` seja detectado.
