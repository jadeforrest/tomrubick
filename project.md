# Tom Rubick Art Site — Project Plan

Static portfolio for the artwork of Thomas (Tom) Rubick, migrating off Wix to a
Git-tracked Astro site hosted on Cloudflare Pages.

`[C]` = Claude, `[J]` = Jade.

---

# ▶ START HERE — next session

Last worked: **2026-07-26**. Last commit: `08a95f7` (artwork import).
Local `main` is **ahead of `origin`** — nothing since `729e279` has been pushed.

**State:** the site is content-complete and building (10 pages, 58 real artworks)
except for the Drawings gallery. Nothing is deployed yet.

### Do these in order

1. **[C] Finish the Drawings gallery** — the one real blocker, and the only visible
   regression vs. the live site (no `/drawings` page, missing nav item).
   See *Open issue #1* below for why it's hard and the two ways to resolve it.
2. **[J] Push and connect Cloudflare Pages** — `git push`, then hook the repo up and
   confirm the `*.pages.dev` preview builds. Do this *before* the remaining content
   decisions so there's a real URL to review against.
3. **[J] Decide on the 50 unpublished files** — *Open issue #2*.
4. **[J] Proofread copy** + settle the "1988–present" exhibit year (`src/pages/exhibits.astro:39`).
5. **[J] Cutover** — Phase 6, only once the preview looks right.

### Quick facts worth not re-deriving
- **Wix serves back byte-identical originals.** `https://static.wixstatic.com/media/<id>`
  returns the exact file that was uploaded, so gallery membership can be established by
  md5 rather than by eye. This is how all 58 imported files were mapped (58/58, 0 misses).
- Six of seven galleries render **in-page** (slideshow, `button.Y0ItqY.vIDrnX` = next).
  `/drawings` alone renders in a **cross-origin iframe** — that's the whole problem.
- Wix `alt` attributes usually carry the **original filename**, occasionally a real title.
- Wix pages take **10–25 s** to hydrate; anything that reads the DOM too early sees nothing.
- Working scratch data (harvested IDs, checksum map, contact sheets) was in the session
  scratchpad and is **gone**. Re-deriving it takes ~20 min with the notes above.

---

## Phase 0 — Prep & backup
- [ ] [J] Confirm access to Wix account, domain registrar/DNS, and Facebook
- [ ] [J] Full Wix site/content export (safety net before any changes)
- [x] [C] Download obituary PDF into `public/obituary-tom-rubick.pdf`
      ("P.S. I'm Dead" by Thomas Rubick, 1.0 MB; link verified serving 200)
- [x] [C] Capture page copy from Wix (biography verified, full exhibits list captured)
- [x] [J] Provide artwork — superseded by the full export, see Phase 5

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

> Placeholders are gone as of `08a95f7` — `src/assets/galleries/` now holds the real
> artwork. See Phase 5.

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

## Phase 5 — Bulk import
- [x] [J] Provide artwork (109 files exported from Wix → `../tomrubick-wix-import/`)
- [x] [C] Convert sources to sRGB + web-ready sizes (max 2000px, q88); import & rebuild
- [x] [C] Verify counts/order and total file count under Cloudflare's 20k cap
      (58 images → 235 derivatives; far under the cap)
- [ ] [J] Final review
- [ ] [J] **Drawings gallery unresolved** — see below
- [ ] [J] Decide on the 50 files that are NOT on the live Wix site
      (staged in `../tomrubick-wix-import/_not-on-wix-site/<proposed-category>/`)

### How the mapping was done (reliable, not guesswork)
Wix serves back the *byte-identical* original files, so each gallery image was
downloaded and md5-matched against the export. 58/58 matched exactly, 0 unresolved.
Imported counts mirror the live site: paintings 38, planets 11, press 6,
graphic-design 2, photography 1.

### Drawings gallery — blocked
`/drawings` is the one gallery Wix renders inside a **cross-origin iframe**
(santa-galleries "Accordion"), so its item list could not be read the way the other
six were. `Tom's Art 258.jpg` is confirmed in it (seen on the live page); the rest of
the picks in `_not-on-wix-site/drawings/` are Claude's visual classification, not
site-derived. Resolve by either listing it from the Wix editor or clicking through
the live gallery and matching by eye.

---

# Open issues & discrepancies

## 1. Drawings gallery — BLOCKED (the one real blocker)
`/drawings` is the only gallery Wix renders inside a **cross-origin iframe**
(`santa-galleries/target/Accordion/Accordion.html`), so its item list can't be read
the way the other six were. Approaches already tried and **failed** — don't repeat:
- raw server HTML (`curl`) — galleries are client-rendered, 0 ids
- parent React fiber `memoizedProps` — only the page background image
- patching `HTMLIFrameElement.prototype.contentWindow` to intercept `postMessage`,
  including installing the hook *before* SPA-navigating to `/drawings` — 0 messages
- `read_network_requests` — does not capture iframe subresource loads
- the accessibility tree — stops at the iframe boundary

**Two ways to finish it:**
- **(a) [J]** open the gallery in the Wix editor and read off the image list; or
- **(b) [C]** click through the live accordion, screenshot each slide, and match by eye
  against `_not-on-wix-site/` (~15 min, needs no input from Jade).

Confirmed member: **`Tom's Art 258.jpg`** (that drawing was visible on the live page).
Everything else in `_not-on-wix-site/drawings/` is Claude's **visual guess**, not
site-derived — treat it as a proposal.

## 2. 50 exported files are not on the live site
More than the "few" expected, and several look as strong as what's published. Staged —
**not published** — in `../tomrubick-wix-import/_not-on-wix-site/<category>/`:
`paintings` 12, `ceramics-3d` 9, `planets` 8, `drawings` 7, `graphic-design` 5,
`photos-of-tom` 7, `studio-and-misc` 2. Adding previously-unseen work to a memorial
site is Paulette's call. The `photos-of-tom` set would suit the Biography page.

## 3. Paintings: Wix says 40, only 38 harvested
The live counter reads **1/40** but repeated passes only ever yielded 38 unique media
ids. Either 2 slides are repeats of images already counted, or 2 were missed. Worth a
recount when the drawings gallery is being resolved — same tooling.

## 4. Graphic Design has only 2 items — suspiciously few
Tom coordinated the Graphic Design Program at Lane CC for 19 years, but `/graphic-design`
publishes exactly 2 pieces. Likely far more exists (the export alone adds 5 candidates,
including the cover he designed for Paulette's book *Rookie on the Battlefield*). Worth
asking Paulette whether more design work should be gathered.

## 5. `/photography` and `/digital` were never built out
Both still carry Wix's default **"I'm a title. Click here to edit me"** template text.
- `/photography` — one genuine Tom photograph (`IMG_1213.jpg`), imported.
- `/digital` — its only image is `Tom's Art 049.jpg`, **the same piece already published
  under Graphic Design**. No `digital/` folder was created. Decide whether `/digital`
  should exist at all; if it's dropped, add a redirect to preserve the old URL.

## 6. Per-artwork titles — partial data exists
Titles are deferred, but Wix `alt` text preserved three real ones. If titles get added
later, these are known-good:
| Title | Imported as |
|---|---|
| Ophelia Reconsiders | `paintings/01-tom-s-art-212.jpg` |
| Joshua | `paintings/07-joshua.jpg` |
| Dad | `paintings/14-tom-s-art-085.jpg` |

## 7. Resolved — no action needed
- **Kent State degree** is an **MA**, not MFA. Wix's biography page was wrong; Tom's own
  obituary was right. Fixed 2026-07-26. Don't "correct" it back.
- **Obituary PDF** in the export (`thself-obit (4).pdf`) is byte-identical (md5
  `6e5d818148fb98f258af097d50146ac9`) to the committed `public/obituary-tom-rubick.pdf`.
- **No duplicates** in the 109-file export — all 108 images are distinct by checksum.
  (109th file is the obituary PDF.)
- **Wix footer credit** ("© 2023 by Peter Collins") was intentionally dropped — he built
  only the old template and is not a content owner.

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
