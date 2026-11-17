# Ahmed Sameh — Data Engineer Portfolio

An award-level, production-ready personal portfolio built with **Vite + React + TypeScript + Tailwind CSS**, featuring a Three.js data-stream hero, GSAP pinned horizontal scrolling, Framer Motion transitions, Lenis smooth scrolling, a custom cursor, a terminal preloader, a dark/light theme, an in-page command palette and several interactive data-pipeline toys.

Everything is static — no backend required. Deploys to GitHub Pages, Vercel, Netlify, or any static host.

---

## 1. Run it locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually **http://localhost:5173/**).

Other commands:

```bash
npm run build      # type-check + production build into dist/
npm run preview    # preview the production build locally
npm run typecheck  # TypeScript only
```

> Requires Node 18+ (developed on Node 26). No environment variables needed.
>
> The Vite watcher is intentionally scoped to `src/`, `public/` and the config files — this project lives in the home directory, and watching the whole tree wastes memory.

---

## 2. Edit the content

**All content lives in `src/data/` — you never need to touch the React components.**

| File | What to edit |
| --- | --- |
| `src/data/profile.ts` | Name, title (`Data Engineer`), `pageTitle`, roles that type in the hero, location, email, education, languages, story, social links, nav items, and the optional `photo` field. |
| `src/data/projects.ts` | The 5 projects: summary, `problem` → `approach` → `result`, tags, category (`Data Engineering` / `Machine Learning`), year, `githubUrl`, metrics, and generated-art settings (`art`, `hue`). |
| `src/data/skills.ts` | The pipeline stages (Source → Ingest → Transform → Store → Serve), the tool marquee list, and the journey/timeline entries. |
| `src/data/tools.ts` | Every clickable tech chip: one-line purpose + official docs URL. Also holds the ticker metric explanations. |
| `src/types/index.ts` | TypeScript shapes for the above. Add fields here first if you need new ones. |

All five `githubUrl` values live in `src/data/projects.ts` and drive the card icon, both modal buttons and the command palette:
- E-commerce → `https://github.com/abosameh522/ecommerce-data-pipeline`
- Churn → `https://github.com/abosameh522/customer-churn-prediction`
- Credit risk → `https://github.com/abosameh522/credit-risk-analysis`
- Nile Delta → `https://github.com/abosameh522/delta-crop-monitoring-system`
- Phishing → `https://github.com/abosameh522/phishing-url-detection`

Notes:
- A project with `githubUrl: null` renders a disabled **"Repo coming soon"** button instead of a broken link.
- Metrics with a `null` value are hidden in the project modal — fill them only with real numbers.
- Set `profile.photo` to a URL or `/your-photo.jpg` in `public/` to replace the initials.

---

## 3. Change colors & fonts

### Colors
Theme tokens are CSS variables at the top of **`src/index.css`** (`:root` for dark, `:root[data-theme='light']` for light). Each is a space-separated RGB triplet:

```css
:root {
  --bg: 7 7 11;       /* page background */
  --ink: 237 238 245; /* primary text */
  --surface: 14 14 22;
  --line: 60 60 78;
  --muted: 150 152 170;
}
```

The electric accent gradient is defined in two places — keep them in sync:
- Tailwind: `backgroundImage['accent-gradient']` in **`tailwind.config.js`**
- Raw gradients in components use the literal stops `#22d3ee` (cyan), `#8b5cf6` (violet), `#f472b6` (pink). Search-and-replace across `src/` to rebrand.

The hero is theme-aware: dark theme renders the Three.js data stream, while the light theme, small screens and `prefers-reduced-motion` fall back to the CSS version (`.hero-canvas-light` in `src/index.css`) so text stays readable and nothing heavy runs unnecessarily.

### Fonts
Fonts are loaded from Google Fonts in **`index.html`** and mapped in **`tailwind.config.js`** (`fontFamily.display` / `fontFamily.mono`). To self-host, download the woff2 files into `public/fonts/`, add `@font-face` rules in `src/index.css`, and remove the Google `<link>` tags.

---

## 4. Interactive features & how to trigger them

| Feature | How to use |
| --- | --- |
| Command palette | Press **Ctrl + K** / **Cmd + K**, or click the "Ctrl K" chip in the navbar. Search sections, projects and actions; ↑↓ to navigate, Enter to run, Esc to close. |
| Interactive terminal | In the About section. Type `help`, `whoami`, `skills`, `projects`, `contact`, `clear` or `sudo hire ahmed`. ↑/↓ = history, Tab = autocomplete. |
| Pipeline packet line | Desktop only — the glowing line on the left edge tracks scroll progress and lights up section nodes. |
| Hero pipeline rail | Under the hero buttons: Extract → Validate → Transform → Load → Serve with a packet sweeping the rail. Click it to jump to the Skills pipeline. |
| Stat counters | In About — Projects / Years studying / Tools start counting the first time they scroll into view and always land exactly on the real number. |
| Build your pipeline | In the Skills section — drag (or tap to select, then tap a slot) the five blocks into Source → Ingest → Transform → Store → Serve. Reset any time. |
| Project spotlight | Hover a project card or the contact form to reveal a circuit grid under the cursor. |
| Live ticker | Decorative demo strip under the navbar, shown over the hero, labelled "simulated pipeline demo". It ticks automatically and slides away as soon as you start scrolling so it never covers a heading. |
| Section wipe | Click any navbar link for a quick gradient/glitch wipe. |
| Shared-element modal | Click a project card to expand its artwork into the detail dialog. Esc closes. |
| Easter egg | Type `data` or enter the Konami code for a matrix-rain overlay. |

### Every clickable element

| Element | What it does |
| --- | --- |
| Tech chip (project tags, stage tools, marquee, completed playground blocks) | Opens a popover with a one-line purpose and an **Official docs** link (data in `src/data/tools.ts`). One popover at a time; Esc closes and returns focus. On phones it becomes a bottom sheet. |
| Ticker metric (ROWS PROCESSED, JOBS SUCCEEDED, PIPELINE UPTIME, PACKETS IN FLIGHT) | Opens the same popover style with a two-line plain-English explanation plus Airflow monitoring docs; labelled as simulated data. Scrolling pauses on hover and while open. |
| Skills stage card | Click to **pin** it open (works on touch); click again to unpin. Its tool chips are then easy to tap. |
| About counters | Jump to Work (#work), Journey (#journey) or Skills (#skills). |
| Timeline education org | Opens Mansoura University's official site in a new tab. |
| Timeline project milestone | Opens the matching project modal. |
| Terminal suggestion chips | Runs `help`, `whoami`, `skills`, `projects` or `contact` without a keyboard. |
| Command palette | Includes navigation, project modals, **GitHub repo** actions and **documentation** actions for every tool. |
| Social links / navbar / footer | Real links with accessible labels and magnetic hover. |

---

## 5. Deploy

### Vercel / Netlify (recommended, zero config)
Import the repo and use:
- Build command: `npm run build`
- Output directory: `dist`

### GitHub Pages
1. Install the helper: `npm i -D gh-pages`
2. In `vite.config.ts`, set `base` to your repo subpath, e.g. `base: '/ahmed-sameh-portfolio/'` (leave as `'/'` if deploying to a custom domain or a user/org root site).
3. Add scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
4. Run `npm run deploy`, then in the repo settings set **Pages → Source** to the `gh-pages` branch.

### Any static host
Run `npm run build` and upload the contents of `dist/`. If serving from a subpath, remember to update `base` in `vite.config.ts`.

---

## 6. Accessibility & performance notes
- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`), skip link, visible focus rings, ARIA labels, keyboard-operable cards, modal (Esc), terminal and playground.
- `prefers-reduced-motion` disables the custom cursor, preloader animation, Three.js scene, horizontal pinning, section wipe, confetti and CSS animation.
- The Three.js scene is lazy-loaded, capped at `dpr 1.6`, uses pre-sampled curves and disposes its texture on unmount; it is replaced by a gradient on small/low-power devices.
- SEO meta + Open Graph tags, JSON-LD and an SVG favicon are in `index.html`. Replace the placeholder `og:image` URL with a real 1200×630 image.

---

## 7. Project structure

```
src/
├── main.tsx              # React entry
├── App.tsx               # Theme, preloader, Lenis, overlays, global shortcuts
├── index.css             # Tailwind + theme tokens + global styles
├── data/                 # ALL editable content
│   ├── profile.ts
│   ├── projects.ts
│   └── skills.ts
├── types/index.ts        # Shared TypeScript types
├── hooks/                # useLenis, useMagnetic, useMediaQuery, useReducedMotion, useThemeMode
├── utils/                # gsap registration, helpers (animated SVG art)
├── components/           # Cursor, Preloader, Navbar, cards, modal, 3D scene,
│   │                     # CommandPalette, InteractiveTerminal, PipelinePacketLine,
│   │                     # PipelinePlayground, LiveDataTicker, SectionWipe,
│   │                     # SpotlightLayer, TextScramble, Marquee, etc.
│   └── sections/         # Hero, About, Projects, Skills, Experience, Contact, Footer
public/favicon.svg
```

---

## 8. Before publishing checklist

Before publishing, fill these in (all are clearly marked in the code):

- [ ] **Photo** — set `profile.photo` in `src/data/profile.ts` (initials show until then).
- [ ] **Real metrics** — replace `null` metric values in `src/data/projects.ts`.
- [ ] **Project screenshots** — cards/modal currently use generated animated SVG art (`projectArtSvg`).
- [ ] **Open Graph image** — `og:image` / `twitter:image` in `index.html` point to a placeholder path.
- [ ] **Canonical URL** — `index.html` canonical is `https://abosameh522.github.io/`; update to your real domain and set Vite `base` accordingly.
- [ ] **Secondary GitHub handle** (`ahmed-s-bakr`) is stored in `src/data/profile.ts` if you want to surface it.
