# firoz671.github.io

Portfolio of **Md. Firoz Al Mahmud**, based in Dhaka, Bangladesh.

> Phase 3 status: the original owner's and third-party content has been removed.
> Portfolio sections are marked `TODO Phase 4` until the new content is added.

## Stack

- [Vite](https://vitejs.dev/) + TypeScript, Tailwind CSS v4 (reset + tokens), hand-written CSS
- [GSAP](https://gsap.com/) + ScrollTrigger for motion, [Lenis](https://lenis.darkroom.engineering/) for smooth scroll
- "Ping", the site guide, is an original SVG rig animated with GSAP (`src/guide.ts`)
- Code-running background is a `<canvas>` (`src/codebg.ts`)
- Space Grotesk is self-hosted in `src/fonts/` (SIL Open Font License)
- Deployed by GitHub Actions to GitHub Pages on every push to `main`

## Develop

```bash
npm ci --ignore-scripts
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ locally
```

## Layout

```
index.html             the page
src/styles.css         design tokens + all styling
src/main.ts            nav, typewriter, reveals, counters, backgrounds
src/guide.ts           Ping, the site guide
src/codebg.ts          the typing-code canvas background
src/ticketfield.ts     the WebGL hero field
src/fonts/             self-hosted Space Grotesk woff2 files + OFL licence
public/prepaint.js     pre-paint intro decision, kept external for the CSP
.github/workflows/deploy.yml   build + GitHub Pages deployment
```

## Deployment

The repository is a GitHub user site (`firoz671.github.io`), so Vite `base` is `/`.
A project-site repository would need `/<repository-name>/` instead.

## TODOs

- Phase 4: portfolio content, favicon, and any new imagery
- Phase 5: canonical URL and Open Graph URL/image
