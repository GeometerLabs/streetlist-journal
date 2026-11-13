# The Streetlist Journal: how it is built and why

The owner's decision of 14 Nov 2026: the Journal leaves geometer.dev; its community and livelihood stories become the Streetlist
Journal, "a fun editorial like how streetlist is", and the technical pieces go to docs.geometer.dev/notes. The same day the owner
set its direction: a techno-social magazine about villages and towns that own and run their own intelligence ("startup doesn't have
to be only about exploitation"); art, philosophy, civic ideas and technology blended; politics in the sense of better living
standards and better opportunities in rural areas; four languages from day one; pictures in the spirit of affectionate, crowded,
humorous scenes of ordinary people.

## 1. The design plan

### Subject, audience, job

- **Subject:** everyday life in villages and small towns, and the services, tools and ideas that let a place keep its value.
- **Audience:** people who run or set up local services, the people they serve, and curious readers; many on budget Android phones,
  many reading in Hindi, Malayalam or Kannada.
- **The front page's job:** make the reader want to read one piece (the lead), show that there is more (latest, sections), and say
  in three sentences what the Journal is for.

### Palette

Streetlist's own: limewash paper `#f7f8f4`, ink `#1d2427`, shutter green links and footer `#136650`, marigold `#f6a609`. Two sets of
colours carry meaning:

| Section | Colour | Why |
| --- | --- | --- |
| Technology | blue `#3459b8` | screens and painted service boards |
| Livelihoods | marigold `#e89a06` | the market's garlands; Streetlist's partner colour |
| Community and civic life | shutter green `#136650` | the shared street, the commons |
| Ideas and philosophy | indigo `#5763a8` | evening, when people sit and talk |
| Art and culture | pink `#c4386f` | festival posters and paint |

Each has a tint (grounds) and an ink (text on the tint, 4.5:1 or better) in both themes. **Labels** carry a small shape instead of a
colour (idea a ring, opinion a speech corner, practical guide a square, experiment a triangle, field report a diamond, research a
double ring), so a label never relies on colour alone.

### Type

Baloo 2 for headings, the wordmark and buttons (rounded, like hand-painted shop lettering), with its sister faces Baloo Chettan 2
(Malayalam) and Baloo Tamma 2 (Kannada); Baloo 2 itself covers Devanagari. All self-hosted from Fontsource, split by script, so a
page downloads only the scripts it shows (the browser picks files by `unicode-range`). Reading text uses the phone's own font
(Roboto and Noto on Android: full Indic coverage, no download). A piece's body is 18 px with line-height 1.65; Hindi, Malayalam and
Kannada get 1.7 everywhere (their marks above and below need room), and their headings 1.3 to 1.35.

### Layout and boldness

Phone first (390 px), wider screens add columns. Each page spends its boldness once:

| Page | The bold place | Everything else |
| --- | --- | --- |
| Front page | The lead story: a big picture and a Baloo headline on the section's tint, its stamp a little askew like a sticker | Masthead in ink; cards white with a section stripe; sections quiet |
| A piece | The headline and the full-width lead picture | A calm reading column; small faces at the headings; the example on a soft tint |
| A section page | The mascot, large, ringed in the section's colour | Cards |

### The companions

The DiceBear faces are Streetlist's (same seeds, same approved mood table, still drawings, no names). Each piece picks a companion
and its mood at the top; each section has a mascot. The delight is small and costs nothing at reading time: the face beside each
heading takes the mood of that part of the story, read from the English heading by keyword (worried at "What could go wrong",
curious at a question, busy where work and money are counted, cheerful elsewhere). A section with no pieces yet shows its mascot
asleep, inviting a story. Covers for pieces without a picture put the companion large beside a speech bubble and the section's
mascot. No script is involved: the faces are prerendered SVG files of 2 to 8 KB.

### Checked with the brief

| First idea | Why it was wrong | Now |
| --- | --- | --- |
| A Markdown body edited in Pages CMS's rich-text editor | The six pieces' structure (paragraphs, a list, paragraphs after the list, the example after the second part) would not survive the editor's round trip, and the move must keep every word | Structured JSON mirroring geometer.dev's articles.json one to one; the form has a list of parts, each with paragraphs, a list and "after the list" |
| A sticky companion that changes mood on scroll | Needs a script and swaps pictures while reading | A small face at each heading in that part's mood: the same idea, static |
| Tilted dashed rubber stamps on every card | Streetlist's quality pass removed exactly this as a hobby look | Flat section stamps with a colour dot; only the lead story's stamp is tilted |
| Translated About page on day one | The About page is a draft for the owner; translating a draft twice wastes a reviewer | About is English only for now; the interface (short, stable words) is in all four languages |

## 2. Content and the move from geometer.dev

- One JSON file per piece per language (`content/pieces/<lang>/<slug>.json`); the English file holds everything, a translation only
  the words and its reviewer. `src/content.ts` reads and checks it all and stops the build with the file and field named when
  something is wrong; GitHub Pages keeps the last good site meanwhile.
- **The six pieces moved word for word.** `migration/geometer-articles.json` is the frozen copy from public-web;
  `migration/map.json` lists every change (section ids, link and picture addresses, two keys geometer.dev needed, related pieces
  that stayed behind); `tests/migration.test.ts` compares every field and block, the read time by geometer.dev's own formula, and
  every paragraph on the built page.
- **Sections:** Commerce and Work became Livelihoods, Community and Public services became Community and civic life, Media became
  Art and culture; Technology and Ideas and philosophy are new (owner, 14 Nov 2026).
- **Links:** a moved piece links to its new page here; Pricing and the three technical pieces keep their geometer.dev addresses (the
  website job redirects those when the notes move); "Write to support" opens an email to hello@geometer.dev.

## 3. Languages

- English at `/`, Hindi at `/hi/`, Malayalam at `/ml/`, Kannada at `/kn/`. Every interface page exists in all four; a piece exists in
  a language only when its translation is reviewed. Pieces not yet in a language appear on that language's pages in English, marked
  `lang="en"` for screen readers.
- `hreflang` links name only versions that exist, both ways (tested); `x-default` is English.
- The interface words were written for launch and wait for native review (`docs/strings-review.md`, generated). Until a language's
  `reviewedBy` is filled, its pages carry `noindex` and stay out of the sitemap, but are linked from the switch.
- Dates use India's locales through `Intl` with Latin digits.

## 4. Pictures

- Lead pictures: cropped to 3:2 and written at 480, 800, 1200 and 1600 px as AVIF, WebP and JPEG, with width and height, `sizes`,
  `fetchpriority="high"` on the first picture of a page and `loading="lazy"` on the rest. The originals stay in the repository.
- Names are stable (no hash), so the JSON feed's picture addresses keep working for streetlist.in and geometer.dev, which copy them
  at their build. GitHub Pages caches for ten minutes, so a replaced picture shows within minutes.
- Art direction and prompts: `docs/image-prompts.md`. The covers stay until the owner supplies art.

## 5. Hosting

GitHub Pages through GitHub Actions (`.github/workflows/pages.yml`), on every push to `main`, which includes every Pages CMS save.
GitHub Pages sends no custom headers, so the content security policy is a `<meta>` tag on every page (scripts, styles, fonts and
pictures from the site only; nothing inline). `/x` is served from `x.html` and `/hi/` from `hi/index.html`; `scripts/serve.ts`
does the same locally. One `404.html` serves every language.

## 6. Tests

- `npm run test:ci` (also in the deploy workflow): the pages the content calls for, language, h1, title, description, canonical and
  policy on each, nothing inline or from elsewhere, every link and fragment resolving as GitHub Pages serves it, hreflang both ways,
  picture sizes and lazy loading, the feeds, the sitemap, redirects.json, CNAME and the size budget.
- `npm test` adds the wording rules in all four languages (with the moved pieces' own sentences listed exactly), the Pages CMS form
  compared with the taxonomy and the cast, the translation rule with fixtures, the review sheet, and the migration check.
- `npm run test:browser`: Playwright and axe at 390 and 1280 px in light and dark on every English page and the interface pages of
  the other three languages; the theme and language switches by keyboard; the header at 360 px in all four languages; the reading
  measure; well-formed feeds; and a budget phone (CPU slowed 4x, slow 4G) on the front page and two pieces.
