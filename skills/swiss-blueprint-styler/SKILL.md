---
name: swiss-blueprint-styler
description: Design system guidelines and UI token recipes for crafting pages, cards, telemetry strips, and tables matching the Swiss Technical Blueprint aesthetic.
---

# Swiss Technical Blueprint Styler

## Design Philosophy
The site follows an uncompromising engineering aesthetic:
- Clean geometry, mathematical precision, high-contrast dark surfaces.
- Minimalist palette: Deep slate `#0a0e17`, dark blue `#0f1623`, electric blueprint cyan `#00d2ff`, subtle gold `#d4af37`.
- Typography: Pairing `Inter` for prose with `JetBrains Mono` for metadata, coordinates, code, and telemetry.

## Essential CSS Tokens (`css/main.css`)
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
    --accent-blue: #00d2ff;
    --accent-detail: #d4af37;
    --font-main: 'Inter', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
}
```

## Pattern: Technical Coordinate Strip
```html
<div class="blueprint-bar top">
    <span class="coord-tag">01 // SECTION NAME</span>
    <span class="coord-tag">PERSPECTIVE: 3-POINT</span>
    <span class="coord-tag">SCALE: 1:1</span>
</div>
```

## Pattern: Bento Spec Card Footer
Always maintain proper spacing between tags/stars and actions:
```html
<div class="card-footer">
    <span class="mono-code card-stars">★ 18 STARS</span>
    <span class="card-action">INSPECT →</span>
</div>
```
Ensure CSS uses `justify-content: space-between; gap: 16px;`.
