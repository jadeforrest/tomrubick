# CLAUDE.md — tomrubick

Static portfolio site for the artwork of **Thomas (Tom) Rubick** (painter/illustrator/
designer, d. July 2009). Built for his sister **Paulette Rubick Johnson**. This is a
migration of tomrubick.com **off Wix** to a Git-tracked **Astro** static site hosted on
**Cloudflare Pages** (cheaper, folder-based control).

## Start here (resuming work)
1. Read **`project.md`** — it is the source of truth for what's done and what's next,
   with checkboxes and owner tags (`[C]` = Claude, `[J]` = Jade). Update it as you go.
2. Phases 1–2 (scaffold + galleries) are **done and build-verified**. The current
   artwork is **placeholders** — see below.
3. Outstanding work is mostly content + deploy: see `project.md` Phases 0, 3–6.

## How the site works
- **Galleries are auto-discovered from folders.** Put images in
  `src/assets/galleries/<category>/`. The **folder name IS the URL slug**.
- URL slugs are kept **identical to the old Wix URLs** (don't rename without a redirect):
  `/paintings`, `/drawings`, `/graphic-design`, `/press` (= "Ceramics and 3D"),
  `/planets` (flat URL, shown as a submenu of Ceramics), `/photography`, `/digital`.
- Pretty labels, nav order, and nav grouping live in `src/lib/categories.ts`
  (display only — never changes URLs). Folders not listed there still work (auto label).
- Discovery + sorting (numeric filename prefix `01-`, `02-` then alphabetical) +
  a reserved-slug guard are in `src/lib/galleries.ts`.
- Browsing: thumbnail masonry grid (`src/components/ArtworkGrid.astro`) → **PhotoSwipe**
  lightbox (`src/components/Lightbox.astro`): arrow keys, zoom, swipe, ESC.
- **No per-artwork titles yet** (deferred — archive filenames aren't meaningful).
- Contact email is **obfuscated** (`src/components/Contact.astro`) — never put a raw
  `mailto:`/full address in source.

## Key files
- `src/lib/galleries.ts`, `src/lib/categories.ts` — gallery discovery + config
- `src/layouts/BaseLayout.astro` — header/nav/footer/SEO + global theme
- `src/pages/[category].astro` — one page per gallery folder (root-level URL)
- `src/pages/{index,biography,exhibits,about-this-site,404}.astro` — static pages
- `astro.config.mjs` — image quality + sitemap; `public/_redirects`, `public/favicon.svg`

## Commands
- `npm run dev` — local dev (port 4321)
- `npm run build` — static build to `dist/`
- `npm run preview` — serve the built `dist/`

## Important constraints / gotchas
- **Preserve existing Wix URLs exactly** (SEO + old inbound links).
- **Image color fidelity matters** (art reproductions): convert source images to
  **sRGB** before import — sharp does not preserve embedded ICC profiles, so wide-gamut
  originals will shift color otherwise.
- **Commit web-ready images only** — no print/original-resolution files in the repo.
- **Cloudflare Pages caps deploys at 20,000 files**; each image fans out ~5 derivatives,
  so keep an eye on total count as artwork is added.
- The artwork in `src/assets/galleries/` right now is **placeholder** images (solid
  colors labeled "PLACEHOLDER"); replace with real files in Phase 5.
- The biography links to `/obituary-tom-rubick.pdf` — that PDF still needs to be
  downloaded from the Wix account into `public/` (Phase 0).

## Ownership note
Peter Collins built only the old Wix *template* (he's not a content owner). Jade/Paulette
have full access to the Wix account, domain, and content.
