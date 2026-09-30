---
name: zero-dash-linter
description: Scans and enforces the strict zero em-dash and en-dash rule across all markdown, html, js, and css files in lucasrafaldini.github.io.
---

# Zero-Dash Linter Skill

## Overview
This repository strictly forbids the use of em-dashes (`\u2014`) and en-dashes (`\u2013`) in any text, documentation, posts, code comments, or HTML entities.

## Permitted Punctuation Substitutions
- Subtitles, expansions, explanatory clauses: Use colon (`:`)
- Side comments and parenthetical clarifications: Use parentheses `( )`
- Natural pause: Use comma (`,`) or period (`.`)
- Attribution of quotes, bullet items, CLI arguments: Use ASCII hyphen-minus (`-`)

## Execution
Run the linter script directly from the repository root:
```bash
python3 skills/zero-dash-linter/lint.py
```
If violations are found, replace the forbidden characters following the substitutions above and re-run until 0 violations are reported.
