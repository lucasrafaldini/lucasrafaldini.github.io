---
name: bilingual-content-sync
description: Protocol for maintaining strict parity between English (lang-en) and Portuguese (lang-pt) content across all pages and blog posts.
---

# Bilingual Content Sync

## Overview
The website offers seamless, instant bilingual switching without page reloads. Every text element must have both Portuguese and English representations.

## Page UI Standard
```html
<h2 class="section-title">
    <span class="lang-pt">Título em Português</span>
    <span class="lang-en">English Title</span>
</h2>
```

## Blog Posts Standard (`_posts/`)
In blog post frontmatter:
```yaml
---
layout: default
title: "Título em Português"
title_en: "English Title"
description: "Descrição para SEO em português"
summary: "Resumo do post em português"
summary_en: "Post summary in English"
author: "Lucas Rafaldini"
published: true
---

<section class="lang-en" markdown="1">
# English Content Here
</section>

<section class="lang-pt" markdown="1">
# Conteúdo em Português Aqui
</section>
```

## Guidelines
- Never leave one language incomplete when updating an article.
- Technical terminology should remain idiomatic in both languages.
- Ensure punctuation conforms to the zero-dash rule in both languages.
