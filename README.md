# firoz671.github.io

Portfolio of **Md. Firoz Al Mahmud**, based in Dhaka, Bangladesh.

> Phase 4 status: real content, favicon, and SEO basics are in place. All copy
> lives in `src/data/portfolio.ts`.

## Stack

- React 18 + TypeScript (strict) + Vite 8
- Tailwind CSS 4 with CSS-first tokens in `src/styles/globals.css`
- Space Grotesk, self-hosted in `src/fonts/` (SIL Open Font License)
- Light and dark themes via `prefers-color-scheme` and a manual toggle, with
  `public/prepaint.js` preventing a flash of the wrong theme
- Deployed by GitHub Actions to GitHub Pages on every push to `main`

The production CSP is strict. The dev server relaxes `script-src` with
`'unsafe-inline'` only for Vite's inline React Refresh preamble; the built
output contains no inline scripts.

## Develop

```bash
npm ci --ignore-scripts
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ locally
```

## Layout

```
index.html                        document shell + CSP + prepaint script
src/main.tsx                      React entry
src/App.tsx                       page composition and skip link
src/components/ui/                Button, Container, SectionHeading, ThemeToggle
src/components/sections/          Header, Hero, About, Skills, Projects,
                                  EducationCertifications, Contact, Footer
src/data/portfolio.ts             all copy in typed objects
src/hooks/useTheme.ts             theme state, persistence, system listener
src/styles/globals.css            design tokens, base styles, motion
src/fonts/                        self-hosted Space Grotesk woff2 + OFL licence
public/prepaint.js                pre-paint theme decision, kept external for the CSP
.github/workflows/deploy.yml      pinned build + GitHub Pages deployment
```

## Accessibility

- Skip link, semantic landmarks, one `h1`, and labelled sections
- Visible keyboard focus on every interactive element
- Decorative visuals are `aria-hidden`; all meaningful images added later must
  have alt text
- `prefers-reduced-motion` disables animation and hover movement
- Layout is mobile-first and holds at 360px

## TODOs

- Phase 5: canonical URL, Open Graph URL/image, and sitemap
- Add a CV PDF and LinkedIn URL when available
