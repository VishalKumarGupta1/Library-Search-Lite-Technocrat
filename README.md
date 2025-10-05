# Web Track — Option B: Library Search Lite (Starter Pack)

## Files
- `index.html` — layout with search input and list area
- `style.css` — minimal styles (responsive scaffold)
- `script.js` — hooks for nav toggle + search; optional bookmarks via localStorage
- `books.json` — 10-item sample dataset

## Base task
1. Layout the page with clear headings and regions.
2. Implement **two interactions** (e.g., nav toggle + search). Bookmarks are a bonus.
3. Make it responsive; ensure keyboard accessibility and visible focus.

## Acceptance checklist
- Loads without errors; readable from 360px–1440px.
- Keyboard navigation: focus visible; toggles reachable; `aria-expanded` updates.
- Two interactions work predictably (toggle/search). No console errors.
- Data renders from `books.json` (or inline dataset of ~10 items).

## Bonus
- Bookmark/Unbookmark using localStorage and reflect state with `aria-pressed`.
- Show a simple stats line like “N shown / total”.
