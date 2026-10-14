# Vela – clickable prototype

Static, dependency-free prototype built from the Figma section **Kulcsképernyők_V2** (🟦 Vela project).

- `s1.webp` … `s9.webp` – 3× WebP exports of the 9 key screens
- `app.js` – hotspots, transitions, scroll with pinned status/tab bar, Long/Short switch, slide-to-confirm
- Deep links: `/#/1` … `/#/9` · `R` restarts · tap anywhere to reveal hotspots

## Flow
1 → 2 → 3 (onboarding) → 4 Home → 5 Bitcoin position → Modify → 6 Long ticket ⇄ 8 Short ticket → slide → 7 / 9 opened → Close → Home

## Deploy
Import the repo in Vercel (no build step, Framework Preset: Other). Every push to `main` redeploys.

## Local
`npx serve .`
