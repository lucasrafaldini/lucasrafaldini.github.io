# CLAUDE.md: Agentic Blueprint and Development Guide

Welcome to the AI agent developer specification for **lucasrafaldini.github.io**. This document governs all autonomous and interactive coding agents (Claude Code, Antigravity, Cursor, Windsurf, Copilot) operating within this repository.

---

## 🏛️ Project Architecture & Philosophy

This project is the personal site, technical journal, and systems laboratory of **Lucas Rafaldini**, software engineer specializing in systems architecture and cybersecurity.

### Core Aesthetic: Swiss Technical Blueprint / RYVN
All pages adhere strictly to the **Swiss Technical Blueprint** aesthetic:
- **Atmosphere**: Deep architectural slate/navy (`#0a0e17`), technical blueprint grid lines (`rgba(0, 210, 255, 0.08)`), high-contrast electric cyan highlights (`#00d2ff`), and subtle gold accents (`#d4af37`).
- **Typography**: Dual-font technical pairing:
  - Sans-serif: `Inter` (UI, clean body copy).
  - Monospace: `JetBrains Mono` (labels, coordinates, indices, telemetry strips, code).
- **Engineering Elements**: Corner registration marks (`+`), coordinate bars (`01 // MANIFESTO`, `SCALE: 1:1`), micro calibration tracks with glowing nodes, and 60fps canvas systems graphs.
- **Iconography & Badges**: The mathematical "therefore" sign (`∴`), technical brackets `[ 01 ]`, uppercase mono badges (`PRIMARY REPO`, `DETAIL // SEC LABS`).

---

## ⚠️ Absolute Invariant: The Zero-Dash Rule

> **CRITICAL RULE**: Do NOT use em-dashes (Unicode U+2014) or en-dashes (Unicode U+2013) anywhere in this repository (posts, HTML, scripts, CSS, comments, or documentation).
> 
> **Allowed Alternatives**:
> - Two points / colon (`:`) for explanatory clauses and subtitles.
> - Parentheses `( )` for side thoughts and inline clarifications.
> - Comma (`,`) for natural pauses.
> - Standard ASCII hyphen-minus (`-`) for attributions, lists, and code flags.

Before finishing any task, run the automated linter:
```bash
python3 skills/zero-dash-linter/lint.py
```

---

## 🛠️ Tech Stack & Local Execution

- **Engine**: Jekyll + GitHub Pages (Ruby / Bundler).
- **Frontend**: Pure semantic HTML5, modern CSS3 custom properties (zero CSS frameworks), Vanilla ES6+ JavaScript.
- **Graphics**: Hardware-accelerated Canvas 2D, SVG math ornaments (Guilloché, perspective wireframes).
- **Package Management**: Bundler (`Gemfile`, `Gemfile.lock`).

### Commands
```bash
# Full Jekyll local build with live reload
bundle exec jekyll serve

# Quick static HTTP server (Python)
python3 -m http.server 8000

# Run typography linter
python3 skills/zero-dash-linter/lint.py

# Create Hacktoberfest issues (requires gh auth login)
./scripts/create_hacktoberfest_issues.sh
```

---

## 📂 Key Directory Map

```text
├── _layouts/                # Base Jekyll layouts (default.html)
├── _includes/               # Reusable Jekyll includes (analytics, etc.)
├── _posts/                  # Bilingual blog articles in Markdown
├── assets/                  # Static assets (images, icons)
├── cardputer-bins/          # M5Cardputer portable firmware catalog
├── decimo-circulo/          # "The Tenth Circle" 60fps procedural fish tank (Canvas 2D)
├── estudos/                 # Long-form research dossiers (Ice Age Symbols, etc.)
├── posts/                   # Post archive listing with blueprint telemetry
├── projetos/                # Dynamic GitHub repos showcase with live API caching
├── css/main.css             # Unified Swiss Technical Blueprint design system
├── js/                      # Modular client-side scripts
├── skills/                  # Autonomous agent skills (SKILL.md specs)
├── .agents/                 # Specialized agent role definitions
└── .github/                 # Issue templates, PR templates, and workflows
```

---

## 🎨 Design System Variables (CSS Tokens)

When adding or styling UI components, always reuse the core CSS custom properties defined in `css/main.css`:

```css
:root {
    --bg-primary: #0a0e17;
    --surface: #0f1623;
    --surface-subtle: #141c2c;
    --border-color: #1e293b;
    --border-highlight: #334155;
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --text-faint: #475569;
    --accent-blue: #00d2ff;        /* Blueprint cyan */
    --accent-detail: #d4af37;      /* Subtle engineering gold */
    --font-main: 'Inter', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.25);
}
```

---

## 🌐 Bilingual Architecture (PT / EN)

The website features client-side dual-language toggling via `data-lang="pt"` and `data-lang="en"`:
- Use `<span class="lang-pt">...</span>` and `<span class="lang-en">...</span>` for dual-language UI blocks.
- In `_posts/`, use frontmatter keys: `title` (PT), `title_en` (EN), `summary` (PT), `summary_en` (EN).
- Maintain parity: Every new feature or text must be provided in both Portuguese and English.

---

## 🤖 Agent Roles & Skills

This repository is equipped with specialized agents and reusable skills:
- **Agent: Blueprint Architect** (`.agents/blueprint-architect.md`): Design system and visual hierarchy guardian.
- **Agent: Typography Linter** (`.agents/typography-linter.md`): Enforces the zero-dash rule and editorial precision.
- **Agent: Cardputer Curator** (`.agents/cardputer-curator.md`): Validates and manages M5Cardputer firmwares and bins.
- **Agent: Dossier Author** (`.agents/dossier-author.md`): Authors deep-dive research with academic citations and DOI links.

### Available Skills
- `skills/zero-dash-linter/SKILL.md`: Automated scan and fix for prohibited dash characters.
- `skills/swiss-blueprint-styler/SKILL.md`: Guide for crafting technical blueprint cards and layouts.
- `skills/cardputer-bin-curator/SKILL.md`: Cataloguing schema and verification rules for binaries.
- `skills/bilingual-content-sync/SKILL.md`: Protocol for maintaining English/Portuguese parity.
