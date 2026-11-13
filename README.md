# Streetlist Journal

**journal.streetlist.in**: *The future, built locally.* Stories and ideas about technology, livelihoods, and people shaping the
places they call home. A small, fun magazine in Streetlist's look, about villages and small towns that own and run their own
intelligence, where art, philosophy, civic ideas and technology meet everyday life. It began on 14 Nov 2026 with the six community
and livelihood pieces that moved here from geometer.dev's Journal, word for word.

> **Before the first push, read [docs/review.md](docs/review.md).** The About page, the front page's introduction and the
> editorial guidelines are drafts for the owner's review, and the Hindi, Malayalam and Kannada interface words wait for a native
> speaker. Pushing to `main` publishes the site.

## What is in it

- A front page: the tagline and a short introduction, the five section mascots, the lead story (the one bold place: a big picture
  and a big headline on the section's colour), the latest pieces as cards, the five sections with their newest pieces, and About.
- A page per piece for long reading: 18 px text, about 66 characters a line, the piece's companion (a DiceBear face from
  Streetlist, no names) beside the byline and beside each heading, its mood changing with the story; the lead picture with its
  credit; an Idea's example exchange; sources and corrections; Keep reading.
- Section pages, label pages, About, a friendly 404, an RSS feed (`/feed.xml`), a JSON feed (`/feed.json`, which streetlist.in and
  geometer.dev read at their build to show the latest three), a sitemap with every language version, and `robots.txt`.
- Four languages from day one: English at `/`, Hindi at `/hi/`, Malayalam at `/ml/`, Kannada at `/kn/`, with a language switch and
  `hreflang`. Pieces are English for now; a piece gets another language only when a native speaker has reviewed its translation.
- Light by default with a sun/moon switch, as on streetlist.in; a strict content security policy; no script but the 0.5 KB switch.

## The stack, and why

Plain TypeScript functions that return HTML (`src/pages/`), run by Node at build time: the same arrangement as streetlist.in's site,
so the two share their drawing code, their theme switch and their tokens, and the owner already knows the commands. Vite bundles the
stylesheet, the self-hosted fonts and the theme script with hashed names; [sharp](https://sharp.pixelplumbing.com) makes the
pictures; [DiceBear](https://www.dicebear.com) draws the companions at build time (never its web service).

Astro was considered and not chosen: its content collections, image service, RSS and sitemap packages would replace about 250 lines
here (`src/content.ts`, `src/images.ts`, `src/feeds.ts`), but would add a framework and its dependency tree to a site that is six
pieces and a dozen page types, and the Journal would no longer share streetlist.in's code. Five runtime packages (DiceBear's two,
three Baloo fonts) plus sharp are all it needs.

## Run it

Needs Node 22.18 or newer (Node runs the `.ts` files directly).

```sh
npm install            # exact versions, no install scripts (.npmrc)
npm run build          # type-check, Vite (stylesheet, fonts, theme script), then every page, picture and feed into dist/
npm run preview        # serves dist/ on http://127.0.0.1:4310 the way GitHub Pages does
npm test               # build checks, the wording and Pages CMS checks, and the migration check (build first)
npm run test:browser   # Playwright + axe at 390 and 1280 px, light and dark, the switches, reading measure, budget phone
npm run review-sheet   # rewrites docs/strings-review.md after an interface string changes
```

`SHOTS_DIR=<folder> npm run test:browser` also saves a screenshot of every page checked.

## Where things are

| Path | What |
| --- | --- |
| `content/pieces/en/<slug>.json` | The pieces (one JSON file each, the shape Pages CMS edits) |
| `content/pieces/hi`, `ml`, `kn` | Translations: only the words, plus "reviewedBy"; published only when that is filled |
| `content/media/` | Lead pictures and section headers, as uploaded (never published as they are; the build resizes them) |
| `content/taxonomy.json` | The six labels and the five sections, each section with its mascot: the one source for both |
| `.pages.yml` | The Pages CMS form |
| `src/content.ts` | Reads and checks the content; the publishing rules; read time |
| `src/i18n/` | Interface words in English, Hindi, Malayalam and Kannada; the About page's draft (`about.ts`); addresses (`index.ts`) |
| `src/characters/` | The cast of faces, the mood table (Streetlist's), the section moods, DiceBear's drawing |
| `src/images.ts` | Lead pictures (AVIF, WebP, JPEG at four widths), covers, faces |
| `src/pages/` | One function per page type, returning HTML |
| `src/feeds.ts` | RSS, JSON feed, sitemap, robots.txt |
| `src/styles/site.css`, `src/client/theme.ts` | The one stylesheet; the light/dark switch |
| `scripts/build.ts`, `scripts/serve.ts` | The build after Vite; the GitHub Pages-like preview |
| `migration/` | The six pieces as geometer.dev had them, and the map of what changed (addresses and section ids only) |
| `redirects.json` | geometer.dev/journal/<slug> to journal.streetlist.in/<slug>, for the geometer.dev website |
| `docs/` | [Explanation](docs/Explanation.md) (design and why), [editorial guidelines](docs/editorial.md), [image prompts](docs/image-prompts.md), [story ideas](docs/story-ideas.md), [review list](docs/review.md), [strings review sheet](docs/strings-review.md), [Deferred](docs/Deferred.md) |

## How to write a piece (for the owner)

1. Go to **[app.pagescms.org](https://app.pagescms.org)** and **sign in with GitHub**. The first time, install the Pages CMS GitHub
   App on the GeometerLabs organisation (or only on this repository) when it asks.
2. Open **GeometerLabs/streetlist-journal**. The left side shows **Pieces** (English and the three translations) and **Section
   pictures**.
3. In **Pieces > English (the pieces)**, press **Add an entry**. Fill in, top to bottom:
   - **Address**: the piece's address, e.g. `prices-before-sunrise` (lower-case words joined by hyphens; set it once).
   - **Title**, **Summary** (two or three sentences), **Byline** (Geometer for now), **Published on** and **Updated on**.
   - **Label** (what kind of piece it is) and **Section**. Read [docs/editorial.md](docs/editorial.md) if unsure.
   - **Companion**: pick a face and its mood at the top. The faces beside each heading follow the story by themselves.
   - **Lead picture**: upload it (3:2, at least 1600 px wide), then **Alt text** and **Credit** (both required).
   - **Parts of the piece**: for each part, a heading and its paragraphs; a list if there is one, and paragraphs after the list.
   - Optional: **Example exchange** (shown after the second part), **Ending** (what the reader can do next, with one link),
     **Sources**, **Keep reading**, **Corrections**.
   - Leave **Draft** on while you work; turn it off when the piece is ready.
4. Press **Save**. Saving is a commit to `main`; the site rebuilds and publishes by itself in about two minutes (watch the
   **Actions** tab on GitHub: "Publish the Journal"). If the build finds a problem (a missing field, a picture without alt text),
   the Actions run says which file and field, and the live site stays as it was until the next save fixes it.
5. **A translation**: in **Pieces > हिन्दी** (or മലയാളം, ಕನ್ನಡ), add an entry, pick the English piece under **Piece**, and fill in the
   translated words. Leave **Reviewed by** empty until a native speaker has checked it: the translation stays a draft and off the
   site. When it is checked, write their name there and save; the piece then appears at `/hi/<address>` and links both ways.
   Never publish a machine translation.
6. **A section's header picture**: **Section pictures**, open the section, upload a 3:1 picture (docs/image-prompts.md) with its alt
   text and credit, and save.

## Publishing

`.github/workflows/pages.yml` builds and publishes to GitHub Pages on every push to `main` (and from the Actions tab): `npm ci`,
`npm run build`, the build checks (`npm run test:ci`), then GitHub's official configure-pages, upload-pages-artifact and
deploy-pages actions, each pinned to a commit. The word, migration and browser checks run on the owner's machine (`npm test`,
`npm run test:browser`), so a typo fix is never held back by them. `public/CNAME` holds `journal.streetlist.in` (Actions deploys
ignore it; the domain is set in Settings, below).

## The owner's first steps

Nothing here has a remote, and nothing has been pushed or deployed.

1. **Create the repository** on GitHub: `GeometerLabs/streetlist-journal`, public, empty (no README, no licence, no .gitignore).
2. **Push**: `git remote add origin git@github.com:GeometerLabs/streetlist-journal.git` then `git push -u origin main`. The first run
   of "Publish the Journal" starts and may fail at the deploy step until step 3 is done; re-run it from the Actions tab afterwards.
3. **Pages settings**: Settings > Pages > Build and deployment > Source: **GitHub Actions**. Then, under Custom domain, enter
   `journal.streetlist.in` and save. (GitHub recommends verifying the domain first: your profile or the organisation's Settings >
   Pages > Add a domain, which gives a TXT record to add at the registrar.)
4. **DNS at the .in registrar**: add a **CNAME** record with the name **`journal`** (so `journal.streetlist.in`) pointing to
   **`geometerlabs.github.io`** (the organisation's GitHub Pages address, not the repository's), plus the verification TXT record
   from step 3 if you verified the domain. No wildcard records. Add the domain in GitHub before the DNS record, as GitHub advises.
5. **HTTPS**: once the domain check in Settings > Pages turns green (minutes to a day), tick **Enforce HTTPS**.
6. **Pages CMS**: sign in at app.pagescms.org with GitHub, install its GitHub App on GeometerLabs (all repositories or just this
   one), and open the repository. First, open one piece and save it without changes: the commit should change nothing (or add only
   `"featured": false` and `"draft": false`), which shows the form and the files agree.
7. **geometer.dev**: copy `redirects.json` into geometer.dev's Firebase redirects (the website job), and point its Journal links
   here.

## Credits

Companions drawn with [DiceBear](https://www.dicebear.com) (`@dicebear/core`, MIT licence); the five character styles (Clay,
Critters, Sprouts, Moods, Pixel) are CC0. Headings use Baloo 2, Baloo Chettan 2 and Baloo Tamma 2 (SIL Open Font License),
self-hosted. The salon piece's photograph is by Lekhak Anurag on Unsplash. Contact: hello@geometer.dev.
