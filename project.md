# Tom Rubick Art Site — Project Plan

Static portfolio for the artwork of Thomas (Tom) Rubick, migrating off Wix to a
Git-tracked Astro site hosted on Cloudflare Pages.

`[C]` = Claude, `[J]` = Jade.

## Phase 0 — Prep & backup
- [ ] [J] Confirm access to Wix account, domain registrar/DNS, and Facebook
- [ ] [J] Full Wix site/content export (safety net before any changes)
- [x] [C] Download obituary PDF into `public/obituary-tom-rubick.pdf`
      ("P.S. I'm Dead" by Thomas Rubick, 1.0 MB; link verified serving 200)
- [x] [C] Capture page copy from Wix (biography verified, full exhibits list captured)
- [ ] [J] Provide 2–3 sample artworks to bootstrap

## Phase 1 — Scaffold
- [x] [C] Create Astro project + project.md + .gitignore
- [x] [C] Configure image service (quality, formats; sRGB note)
- [x] [C] BaseLayout, nav (auto from folders + categories.ts), gallery-style theme

## Phase 2 — Galleries
- [x] [C] galleries.ts discovery + reserved-slug guard + sort
- [x] [C] ArtworkGrid + root [category].astro route
- [x] [C] PhotoSwipe lightbox (arrow keys, zoom, swipe, ESC; correct derivative dims)
- [x] [C] Validate full pipeline with sample images (placeholders — see note)
- [ ] [J] Review gallery look/feel vs. current site

> NOTE: `src/assets/galleries/` currently holds **placeholder** images (solid colors
> labeled "PLACEHOLDER") so the build could be verified. Replace them with real
> artwork in Phase 5 (just delete the placeholders and drop real files in the folders).

## Phase 3 — Content pages
- [x] [C] Biography (+ obituary PDF link, now working)
- [x] [C] Exhibits — full 33-entry list (1986–2007) backfilled from Wix
- [x] [C] About this site (purpose + tribute quote; drop Wix credit)
- [x] [C] Contact component (obfuscated email; Paulette + Facebook)
- [x] [C] Landing page + custom 404
- [ ] [J] Proofread all copy. One open copy decision:
      - Faculty Exhibit year reads "1988–present", carried over verbatim from Wix
        (`src/pages/exhibits.astro:39`). Reads oddly on a memorial site — pick an
        end year?
> Kent State degree is an **MA**, not MFA (Jade confirmed 2026-07-26; the Wix
> biography page was wrong, Tom's own obituary was right).

## Phase 4 — Deploy (preview)
- [x] [J] Create GitHub repo — `git@github.com:jadeforrest/tomrubick.git`
- [x] [C] Push; verify build (`main` pushed; build clean, 9 pages)
- [ ] [J] Connect Cloudflare Pages; confirm *.pages.dev preview
- [ ] [J] Review preview

## Phase 5 — Bulk import  ← **critical path; everything else is small**
- [ ] [J] Decide image source: Wix Media Manager export (best quality) vs. scraping
      the live site's displayed JPEGs (fast, lower res)
- [ ] [J] Provide all artwork, sorted into category folders
- [ ] Missing folders entirely — no gallery page renders for these yet:
      `graphic-design/`, `photography/`, `digital/`
- [ ] [C] Convert sources to sRGB + web-ready sizes; import and rebuild
- [ ] [C] Verify counts/order and total file count under Cloudflare's 20k cap
- [ ] [J] Final review

## Phase 6 — Cutover
- [ ] [J] Point tomrubick.com DNS at Cloudflare Pages (keep Wix live until verified)
- [ ] [J] Verify SSL + all URLs resolve
- [ ] [J] Cancel Wix subscription once stable

## Future
- [ ] Per-artwork titles/captions (filename→title or captions.json sidecar)
- [ ] Optional: medium/year/dimensions metadata
- [ ] Optional: rename /press → /ceramics-and-3d with 301 redirect

---

## How to add or recategorize artwork
1. Put image files into `src/assets/galleries/<category>/`. The folder name is the
   URL slug (e.g. `paintings/` → `/paintings`).
2. To control order within a gallery, prefix filenames with numbers: `01-foo.jpg`,
   `02-bar.jpg`. Otherwise they sort alphabetically.
3. To add a brand-new category, just create a new folder with images in it — a nav
   item and gallery page appear automatically on the next build. Add a pretty label
   and ordering in `src/lib/categories.ts` (optional).
4. To recategorize, move a file to a different folder and rebuild.
5. Rebuild/redeploy: commit + push (Cloudflare Pages auto-builds), or `npm run build`.
