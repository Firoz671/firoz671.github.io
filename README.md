# firoz671.github.io

Portfolio of **Md. Firoz Al Mahmud**, a Computer Science and Engineering
graduate based in Dhaka, Bangladesh.

## Stack

- React 18 + TypeScript (strict) + Vite
- Tailwind CSS 4 with CSS-first tokens
- Space Grotesk, self-hosted in `src/fonts/`
- Light and dark themes with a pre-paint theme script
- Deployed to GitHub Pages by a pinned GitHub Actions workflow

## Scripts

```bash
npm ci --ignore-scripts
npm run dev
npm run build
```

## Content

All page copy lives in `src/data/portfolio.ts`; document metadata is in
`index.html`. Static assets, including the CV, live in `public/`.

The production CSP is strict, and the build contains no inline scripts.
