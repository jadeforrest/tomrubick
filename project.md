# Tom Rubick Art Site — Project Plan

Static portfolio for the artwork of Thomas (Tom) Rubick, migrating off Wix to a
Git-tracked Astro site hosted on Cloudflare Pages.

`[C]` = Claude, `[J]` = Jade.

---

# ▶ START HERE — next session

Last worked: **2026-10-15** (mapped where the domain lives — see "Where tomrubick.com
lives" under Phase 6).
**Everything is pushed** — `origin/main` == local. Build verified clean:
11 pages, 332 files, 64 MB in `dist/` (Cloudflare's cap is 20,000 files).

**State:** the site is **content-complete and deployed to a preview URL**:
**https://tomrubick.pages.dev**. It matches the live Wix site exactly (11 pages,
61 artworks); every gallery membership question is settled — see "How gallery
membership was settled" below. `tomrubick.com` still points at Wix (Phase 6).

Per-gallery counts, ours vs. Wix — **all match**:
paintings 40, drawings 1, graphic-design 2, ceramics 6, planets 11, photography 1.

### Do these in order

1. ~~**[J] Review the preview** and send it to Paulette.~~ **Done 2026-10-08 — Paulette
   liked it.** Every push to `main` rebuilds https://tomrubick.pages.dev automatically;
   other branches get their own preview URLs.
2. ~~**[J] Decide on the 45 unpublished files**~~ **Decided 2026-10-08: skip all for
   now.** Nothing new gets published; see *Open issue #2*.
3. ~~**[J] Proofread copy.**~~ **Done 2026-10-08.** ("1988–present" exhibit year stays.)
4. ~~**[J] Glance at the new favicon**~~ **Approved 2026-10-08.** Crop of the ceramic
   sun from Planets (`01-img-7339.jpg`). See "Future" below.
5. **[J] Cutover — this is what's left.** Do Phase 0 first (confirm account access +
   full Wix export as a safety net), then Phase 6.
   **First step: get GoDaddy access from Paulette** — the domain is registered there,
   and nothing in Phase 6 can happen without it.

### How gallery membership was settled (do it this way, not by clicking)
The earlier approach — driving the live site and harvesting media ids from the DOM — is
**obsolete and unnecessary**. Wix publishes each page's full component tree as static
JSON, no rendering required:

1. `curl https://www.tomrubick.com/<page>` → find `pagesMap` in the HTML; it maps every
   `pageUriSEO` to a `pageJsonFileName`.
2. `GET https://static.wixstatic.com/sites/<pageJsonFileName>.json.z?v=3` → plain JSON
   (despite the `.z`). `data.document_data` holds every component; galleries are the
   `ImageList` entries, whose `items` reference `Image` entries with `uri`, `title`, `alt`.
3. `GET https://static.wixstatic.com/media/<uri>` returns the **byte-identical original**,
   so each one md5-matches a file in the export.

This resolved the Drawings iframe problem outright (the iframe never had to be read) and
re-verified every other gallery: **61/61 images matched an export file, 0 misses.**

### Quick facts worth not re-deriving
- Wix `alt`/`title` attributes usually carry the original filename, occasionally a real title.
- The site's Wix page ids: paintings `c1r52`, drawings `c1lo9`, graphic-design `c1a08`,
  press/ceramics `c1dqp`, planets `mudlm`, photography `cx3`, digital `c1mqm`,
  biography `ck70`, home `mainPage`.
- Don't bother driving the live site with a browser. Wix pages take 10–25 s to hydrate and
  the JSON above is authoritative and instant.

---

## Phase 0 — Prep & backup
- [ ] [J] **Get GoDaddy access from Paulette** (the registrar — see "Where tomrubick.com
      lives" under Phase 6). Do this first.
- [ ] [J] Confirm access to Wix account (runs the DNS today) and Facebook
- [ ] [J] Ask Paulette whether anyone still uses a `@tomrubick.com` mailbox (GoDaddy email)
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
- [x] [C] Biography (+ obituary PDF link, now working; studio portrait added 2026-08-13
      — the live Wix biography page carries it and ours didn't)
- [x] [C] Exhibits — full 33-entry list (1986–2007) backfilled from Wix
- [x] [C] About this site (purpose + tribute quote; drop Wix credit)
- [x] [C] Contact component (obfuscated email; Paulette + Facebook)
- [x] [C] Landing page + custom 404
- [x] [J] Proofread all copy (done 2026-10-08). (The one open copy decision is now closed: the Faculty
      Exhibit "1988–present" at `src/pages/exhibits.astro:39` **stays as-is** — Jade,
      2026-09-03, the exhibit is presumed to still run.)
> Kent State degree is an **MA**, not MFA (Jade confirmed 2026-07-26; the Wix
> biography page was wrong, Tom's own obituary was right).

## Phase 4 — Deploy (preview)
- [x] [J] Create GitHub repo — `git@github.com:jadeforrest/tomrubick.git`
- [x] [C] Push; verify build (`main` pushed; build clean, 11 pages)
- [x] [J] Connect Cloudflare Pages — **live at https://tomrubick.pages.dev** (2026-08-13)
- [x] [J] Review preview (Paulette approved, 2026-10-08)

### Deploy setup (as configured)
Cloudflare **Pages** project `tomrubick`, Git-connected to `jadeforrest/tomrubick`,
production branch `main`. Build command `npm run build`, output directory `dist`,
root directory blank. Node is pinned to 22 by `.nvmrc`.

Cloudflare offers two paths and they are not interchangeable — we took **Pages**
(Workers & Pages → Create application → Pages → Connect to Git), which asks only for a
build command. The newer **Workers Builds** path ("import a repository") also asks for a
*deploy command* (`npx wrangler deploy`) and requires a `wrangler.jsonc` in the repo. We
have no such file; if one ever appears, this project moved to Workers.

Verified on the deployed site, 2026-08-13: all 11 pages 200; `/press` → `/ceramics` 301
(the `_redirects` file works); bare paths 308 to trailing-slash; `sitemap-index.xml`,
`favicon.ico`, `apple-touch-icon.png`, and `obituary-tom-rubick.pdf` all serve;
unknown paths serve our own 404 page; image derivatives serve as `image/webp`.

## Phase 5 — Bulk import
- [x] [J] Provide artwork (109 files exported from Wix → `../tomrubick-wix-import/`)
- [x] [C] Convert sources to sRGB + web-ready sizes (max 2000px, q88); import & rebuild
- [x] [C] Verify counts/order and total file count under Cloudflare's 20k cap
      (61 images → ~250 derivatives; far under the cap)
- [x] [C] **Drawings gallery — RESOLVED.** It holds exactly **one** image on the live
      site. See "How gallery membership was settled" at the top.
- [x] [C] **Paintings 40/40 — RESOLVED.** The two that earlier passes missed are now
      imported (appended as `39-`, `40-`; exact Wix order wasn't worth a renumber).
- [ ] [J] Final review
- [x] [J] Decide on the 45 files that are NOT on the live Wix site — **skip all for now**
      (2026-10-08). Still staged in `../tomrubick-wix-import/_not-on-wix-site/<category>/`

### Import log — 2026-08-13
Added, all md5-confirmed as live-site content:
| File | Imported as |
|---|---|
| `Tom's Art 258.jpg` | `galleries/drawings/01-tom-s-art-258.jpg` |
| `Tom's Art 022.jpg` | `galleries/paintings/39-tom-s-art-022.jpg` |
| `Tom's Art 023.jpg` | `galleries/paintings/40-tom-s-art-023.jpg` |
| `artist at work 5_06.jpg` | `assets/bio/artist-at-work-2006.jpg` (Biography page) |

Two notes on the drawing: Wix serves it as a 550×800 PNG (`Tom's Art 258_edited.png`,
soft alpha baked in). The export also has the **same artwork unedited at 2417×3515**, so
that's what was imported — same piece, real resolution. And `Tom's Art 023.jpg` was
staged under `drawings/` but Wix has it in **paintings** (position 18); it went to
paintings.

Those five source files were moved **out of** `_not-on-wix-site/` up to the top level of
the export dir, since they are on the live site. That's why the unpublished count went
from 50 to 45.

---

# Open issues & discrepancies

## 1. Drawings gallery — RESOLVED (2026-08-13)
`/drawings` publishes **exactly one image**. The cross-origin iframe never had to be
read: the page's Wix JSON (`d3728f_bb1c3b385aa10e9b2bf2e69308bf55ee_75`) contains a
single `ImageList` (`c1eqn`) with one item, `Tom's Art 258_edited.jpg`. Imported.

So the gallery was never "missing 6 drawings" — a one-item gallery is simply what Tom's
site had. The other four files in `_not-on-wix-site/drawings/` remain unpublished
candidates for Paulette (issue #2), not omissions.

## 2. 45 exported files are not on the live site — DEFERRED (2026-10-08)
**Decision: skip all of them for now.** The site launches matching Wix exactly. The files
stay staged for a later pass. Jade had started sorting before deciding; that partial sort
is kept as-is (a head start, not a decision):
- `_skip/` (8): `2009 020.JPG`, `IMG_0849.JPG`, `IMG_7453.JPG`, `Tom's Art 414.jpg`,
  `Johnson_front_lo.jpg`, `M_wholesunwithborder.jpg`, `coverart.jpg`, `rookie_header.jpg`
- moved to `paintings/`: `2009 016.JPG` (was drawings), `IMG_7476.JPG` (was ceramics)
- `ceramics-3d/` renamed `ceramics/` to match the gallery slug.

Original staging counts below.
Several look as strong as what's published. Staged — **not published** — in
`../tomrubick-wix-import/_not-on-wix-site/<category>/`:
`paintings` 11, `ceramics-3d` 9, `planets` 8, `photos-of-tom` 6, `graphic-design` 5,
`drawings` 4, `studio-and-misc` 2. Adding previously-unseen work to a memorial site is
Paulette's call.
> Worth flagging to her: `/drawings` currently publishes **one** drawing, and there are
> 4 more staged. That gallery is the thinnest part of the site by far.

## 3. Paintings 40 vs 38 — RESOLVED (2026-08-13)
Wix really does publish 40, and 40/40 now md5-match the export. The 2 that earlier
browser passes missed were sitting in `_not-on-wix-site/` and are now imported:
`Tom's Art 022.jpg` (Wix position 7) and `Tom's Art 023.jpg` (position 18, misfiled
under `drawings/`).

## 4. Graphic Design has only 2 items — suspiciously few
Tom coordinated the Graphic Design Program at Lane CC for 19 years, but `/graphic-design`
publishes exactly 2 pieces. Likely far more exists (the export alone adds 5 candidates,
including the cover he designed for Paulette's book *Rookie on the Battlefield*). Worth
asking Paulette whether more design work should be gathered.

## 5. `/photography` and `/digital` were never built out
Both still carry Wix's default **"I'm a title. Click here to edit me"** template text —
confirmed straight from the page JSON, so this is Wix's placeholder, not lost content.
Neither page uses a gallery component; each is a single bare image.
- `/photography` — one genuine Tom photograph (`IMG_1213.jpg`), imported. Its Wix
  heading is the mangled string `Titl"Super Fork"e. Double click me.` — i.e. Tom titled
  the piece **"Super Fork"** and it got typed into the placeholder. Worth using.
- `/digital` — **RESOLVED (2026-09-03): dropped, with a 301 to `/graphic-design`.**
  Its only image is `Tom's Art 049.jpg`, **byte-identical (md5-confirmed) to the piece
  already published under Graphic Design**, so no `digital/` folder was ever created and
  the page never existed here — it was never in the nav either (the nav is built from
  folders that contain images, so `categories.ts` alone can't produce one). The only
  live question was inbound links to the Wix URL after cutover; those now redirect
  instead of hitting our 404. The dead `digital` entry in `src/lib/categories.ts` was
  removed at the same time.

## 6. Per-artwork titles — partial data exists
Titles are deferred, but Wix `alt`/`title` text preserved four real ones. If titles get
added later, these are known-good:
| Title | Imported as |
|---|---|
| Ophelia Reconsiders | `paintings/01-tom-s-art-212.jpg` |
| Joshua | `paintings/07-joshua.jpg` |
| Dad | `paintings/14-tom-s-art-085.jpg` |
| Super Fork | `photography/01-img-1213.jpg` |

## 8. Homepage image — matches Wix
Wix's landing page uses `Tom's Art 212.JPG` (*Ophelia Reconsiders*), which is also
paintings #1. Noted so nobody "fixes" the repetition later without meaning to.

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
- [ ] [J] Get GoDaddy access from Paulette (Phase 0 — blocks everything below)
- [ ] [J] Add tomrubick.com as a zone in Cloudflare
- [ ] [J] Check the imported records include the GoDaddy email ones (MX `0 smtp.secureserver.net`,
      MX `10 mailstore1.secureserver.net`, CNAME `email` → `email.secureserver.net`);
      add them by hand if not
- [ ] [J] In GoDaddy, turn off Domain Protection / the update lock, then change the
      nameservers from Wix to the two Cloudflare assigns (keep Wix live until verified)
- [ ] [J] Attach `tomrubick.com` + `www.tomrubick.com` as custom domains on the
      `tomrubick` Pages project
- [ ] [C] Verify SSL + all URLs resolve (11 pages, `/press` and `/digital` 301s, obituary
      PDF, sitemap, favicons, 404) and that MX records still answer
- [ ] [J] Cancel Wix subscription once stable — **keep GoDaddy auto-renew on**

### Where tomrubick.com lives (checked 2026-10-15 via dig + whois)
| Piece | Where | Evidence |
|---|---|---|
| Registrar | **GoDaddy** | registered 2015-09-14, expires **2027-09-14** |
| DNS | **Wix** | nameservers `ns14.wixdns.net`, `ns15.wixdns.net` |
| Website | **Wix** | apex → `185.230.63.x`; `www` → `cdn3.wixdns.net` |
| Email | **GoDaddy** | MX → `secureserver.net`; `email.tomrubick.com` → GoDaddy webmail |

- **Wix is not the registrar**, so cancelling Wix doesn't put the domain at risk.
- **The email records live in Wix's DNS today.** Moving nameservers drops them unless
  they're recreated at Cloudflare first — that's the one way this cutover breaks something
  that isn't the website.
- **The domain is locked at GoDaddy** (`clientUpdateProhibited`, plus delete/renew/transfer
  locks — GoDaddy's Domain Protection). Expect to unlock before the nameserver change.
- **Why move DNS to Cloudflare** rather than just repointing records at Wix: Cloudflare
  Pages can only serve the bare apex `tomrubick.com` when the zone is on Cloudflare.

## Future
- [x] **[C] Favicon from an artwork** (2026-08-13). The generic "TR" `public/favicon.svg`
      is deleted. It's now a crop of the **ceramic sun** from Planets
      (`planets/01-img-7339.jpg`, crop `left:708 top:130 560×560`, saturation ×1.1).
      Shipped: `favicon.ico` (16/32/48), `favicon-16.png`, `favicon-32.png`,
      `apple-touch-icon.png` (180). `<link>` tags in `src/layouts/BaseLayout.astro`.
      Verified serving 200 at the right dimensions, and legible at 16px on both light
      and dark browser chrome.
      > Why the sun and not one of the spheres: a favicon needs a *silhouette*, not a
      > texture. The star points read at 16px; the spiky red ball and the yellow Saturn
      > both collapse into a blob. If Paulette wants a different piece, only the crop
      > rectangle above needs to change.
- [ ] Per-artwork titles/captions (filename→title or captions.json sidecar)
      — four real titles are already known, see open issue #6
- [ ] Optional: medium/year/dimensions metadata
- [x] [C] Rename /press → /ceramics with 301 redirect; "Ceramics" and "Planets" are now
      two plain top-level nav items (the Ceramics→Planets dropdown was removed)

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
