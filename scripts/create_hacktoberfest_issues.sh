#!/usr/bin/env bash
# ==============================================================================
# Script para automação e criação das 8 issues do Hacktoberfest via GitHub CLI (gh)
# ==============================================================================

set -e

REPO="lucasrafaldini/lucasrafaldini.github.io"

echo "==> Verificando autenticação no GitHub CLI..."
if ! gh auth status >/dev/null 2>&1; then
    echo ""
    echo "[!] O GitHub CLI (gh) não está autenticado nesta sessão."
    echo "    Para autenticar e criar as issues na sua conta do GitHub, execute:"
    echo "      gh auth login -h github.com"
    echo "    Ou exporte seu token pessoal:"
    echo "      export GITHUB_TOKEN='seu_token_aqui'"
    echo ""
    exit 1
fi

echo "==> Adicionando o tópico 'hacktoberfest' ao repositório..."
gh repo edit "$REPO" --add-topic hacktoberfest || true

echo "==> Garantindo a existência das labels..."
labels=(
    "hacktoberfest:ED5C9B:Participa do Hacktoberfest 2026"
    "good first issue:7057ff:Boa tarefa para iniciantes no projeto"
    "accessibility:1d76db:Melhorias em a11y, ARIA e usabilidade por teclado"
    "performance:ff9f1c:Otimização de carregamento e renderização"
    "feature:a2eeef:Nova funcionalidade ou ferramenta"
    "i18n:5319e7:Internacionalização e traduções bilíngues (EN/PT)"
    "seo:fbca04:Otimização para motores de busca e OpenGraph"
    "pwa:2ec4b6:Suporte a Progressive Web App e Service Worker"
    "ci:0075ca:Automação, testes e pipelines do GitHub Actions"
)

for entry in "${labels[@]}"; do
    IFS=":" read -r name color desc <<< "$entry"
    gh label create "$name" --repo "$REPO" --color "$color" --description "$desc" --force >/dev/null 2>&1 || true
done

echo "==> Criando as 8 issues do Hacktoberfest..."

# Issue 1
gh issue create --repo "$REPO" \
  --title "[Hacktoberfest] [A11y] Adicionar atributos ARIA e suporte a navegação por teclado nos filtros do cardputer-bins" \
  --label "hacktoberfest,good first issue,accessibility,ui" \
  --body "### 🎃 Descrição da Tarefa
A página \`cardputer-bins/index.html\` possui uma barra de filtros por categoria (\`ALL\`, \`SEC\`, \`SYS\`, \`GAME\`, \`MEDIA\`, \`TOOL\`). Atualmente, os botões não comunicam seu estado ativo para leitores de tela e não suportam navegação avançada por setas de teclado.

### 🎯 Escopo
- [ ] Adicionar \`role=\"tablist\"\` ao container \`.cb-filter-bar\` e \`role=\"tab\"\` a cada botão \`.cb-filter-btn\`.
- [ ] Gerenciar o estado ativo dinamicamente através de \`aria-selected=\"true/false\"\`.
- [ ] Suportar navegação por teclas de seta (ArrowLeft / ArrowRight) e Enter/Espaço para selecionar o filtro.
- [ ] Adicionar uma região viva com \`aria-live=\"polite\"\` para anunciar quantos firmwares foram encontrados após a filtragem.

### 📐 Diretrizes Técnicas
- Seguir o design system Swiss Technical Blueprint em \`css/main.css\`.
- Não utilizar travessões (em-dash / en-dash).
- Testar navegação exclusiva por teclado (Tab + Setas)."

# Issue 2
gh issue create --repo "$REPO" \
  --title "[Hacktoberfest] [Feature] Implementar atalho de teclado global (Ctrl/Cmd + K) para paleta de busca rápida" \
  --label "hacktoberfest,enhancement,feature" \
  --body "### 🎃 Descrição da Tarefa
Implementar uma paleta de busca global minimalista disparada pelo atalho de teclado \`Cmd + K\` (macOS) ou \`Ctrl + K\` (Windows/Linux) para pesquisar instantaneamente entre artigos e projetos do site.

### 🎯 Escopo
- [ ] Criar um componente modal em Vanilla JS sem dependências externas pesadas.
- [ ] Indexar títulos, tags e resumos dos artigos em \`/posts/\` e dos repositórios em \`/projetos/\`.
- [ ] Estilizar o modal com o visual Swiss Technical Blueprint (fundo escuro, acento ciano \`#00d2ff\`, tipografia monospace).
- [ ] Permitir navegação pelos resultados com setas cima/baixo e fechar via \`Escape\`."

# Issue 3
gh issue create --repo "$REPO" \
  --title "[Hacktoberfest] [i18n] Completar e sincronizar traduções pendentes (EN/PT) na página de Perguntas & Respostas" \
  --label "hacktoberfest,good first issue,documentation,i18n" \
  --body "### 🎃 Descrição da Tarefa
A página \`perguntas&respostas/index.html\` reúne respostas técnicas sobre arquitetura, cibersegurança e visão profissional. Alguns cartões e termos podem ser enriquecidos para garantir paridade total entre as versões em Português e Inglês.

### 🎯 Escopo
- [ ] Revisar cada cartão para assegurar a presença de \`<span class=\"lang-pt\">\` e \`<span class=\"lang-en\">\`.
- [ ] Garantir que o texto em inglês tenha redação técnica natural e precisa.
- [ ] Verificar a ausência total de travessões (em-dash / en-dash), substituindo-os por dois pontos, parênteses ou hífens regulares."

# Issue 4
gh issue create --repo "$REPO" \
  --title "[Hacktoberfest] [Performance] Otimizar carregamento de capas em cardputer-bins com lazy loading nativo e fallback offline" \
  --label "hacktoberfest,good first issue,performance" \
  --body "### 🎃 Descrição da Tarefa
O catálogo de firmwares em \`cardputer-bins/index.html\` carrega imagens de capa de dezenas de firmwares. É importante otimizar o carregamento dessas imagens para conexões lentas ou uso offline.

### 🎯 Escopo
- [ ] Adicionar os atributos \`loading=\"lazy\"\` e \`decoding=\"async\"\` aos elementos \`<img>\` gerados em \`renderCard()\`.
- [ ] Implementar um fallback SVG no estilo blueprint para imagens ausentes ou falhas de conexão (\`onerror\`).
- [ ] Manter dimensões e proporções consistentes para evitar Content Layout Shift (CLS)."

# Issue 5
gh issue create --repo "$REPO" \
  --title "[Hacktoberfest] [Feature] Adicionar alternador de visualização (Grid vs. Tabela Técnica) em cardputer-bins" \
  --label "hacktoberfest,enhancement,feature" \
  --body "### 🎃 Descrição da Tarefa
Oferecer aos usuários de M5Cardputer a opção de visualizar os firmwares tanto no modo Grid (cartões visuais) quanto no modo Tabela Técnica (modo telemetria compacta).

### 🎯 Escopo
- [ ] Adicionar botões de alternância na barra de cabeçalho: \`[ GRID ]\` e \`[ TABLE ]\`.
- [ ] Renderizar tabela com colunas: Nome, Categoria, Versão, Data e Downloads, com suporte a ordenação ao clicar no cabeçalho da coluna.
- [ ] Persistir a preferência da visualização no \`localStorage\`."

# Issue 6
gh issue create --repo "$REPO" \
  --title "[Hacktoberfest] [SEO & OpenGraph] Enriquecer meta tags OpenGraph e Twitter Cards nos posts individuais" \
  --label "hacktoberfest,enhancement,seo" \
  --body "### 🎃 Descrição da Tarefa
Aprimorar o compartilhamento social dos posts técnicos no LinkedIn, X e Telegram adicionando metadados estruturados dinâmicos.

### 🎯 Escopo
- [ ] Atualizar o template \`_layouts/default.html\` para extrair metadados específicos de artigos individuais (\`page.date\`, \`page.tags\`, tempo estimado de leitura).
- [ ] Incluir tags \`article:published_time\`, \`article:tag\` e \`twitter:label1\` / \`twitter:data1\`.
- [ ] Validar tags em visualizadores OpenGraph."

# Issue 7
gh issue create --repo "$REPO" \
  --title "[Hacktoberfest] [PWA] Implementar Web App Manifest e Service Worker para leitura offline de artigos" \
  --label "hacktoberfest,enhancement,pwa" \
  --body "### 🎃 Descrição da Tarefa
Transformar o blog em um Progressive Web App (PWA) instalável, permitindo consulta offline de posts já acessados.

### 🎯 Escopo
- [ ] Criar \`manifest.webmanifest\` com tema escuro e referências ao novo ícone \`∴\` (portanto).
- [ ] Implementar um Service Worker (\`sw.js\`) com estratégia Cache First para estilos e fontes, e Network First para páginas HTML.
- [ ] Registrar o Service Worker de forma não bloqueante."

# Issue 8
gh issue create --repo "$REPO" \
  --title "[Hacktoberfest] [CI / Automation] Criar GitHub Action de linter para verificar ausência de travessões (zero em-dashes)" \
  --label "hacktoberfest,good first issue,ci,automation" \
  --body "### 🎃 Descrição da Tarefa
Criar uma verificação automatizada de Integração Contínua (CI) no GitHub Actions que valide se novos PRs contêm travessões (\`\` ou \`\`), garantindo a preservação da regra de tipografia do site.

### 🎯 Escopo
- [ ] Criar o arquivo \`.github/workflows/lint-typography.yml\`.
- [ ] Rodar um script leve em Python que verifique arquivos \`.md\`, \`.html\`, \`.js\` e \`.css\`.
- [ ] Bloquear o check da PR e emitir log explicativo caso algum caractere proibido seja encontrado."

echo "==> Todas as 8 issues do Hacktoberfest foram criadas com sucesso!"
