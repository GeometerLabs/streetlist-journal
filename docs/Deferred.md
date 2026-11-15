# Deferred: what is not built yet

- **Lead art** for the five pieces without a picture, and the five section headers: prompts and sizes are in `image-prompts.md`; the
  covers drawn from the companions stand in meanwhile.
- **Native review** of the Hindi, Malayalam and Kannada interface words (`strings-review.md`), and translations of the pieces.
  Until then those languages are built but not indexed.
- **A translated About page**: English only until the owner approves the draft.
- **Feeds per language** (`/hi/feed.json` and so on): worth adding when the first reviewed translations exist.
- **Trying the Pages CMS form in the hosted app**: written from Pages CMS's documentation and checked by the tests, but it can
  only be opened once the repository is on GitHub (README, "The owner's first steps", step 6).
- **A real budget phone**: the timings in the browser test are headless Chromium with the CPU slowed 4x and a slow 4G connection, on
  this machine's background cores.
- **Search** across pieces: not needed at six pieces; the sections and labels do the job for now.
- **The six stashed pieces** (15 Nov 2026): market-orders-by-voice, paid-work-around-an-agent, salon-whatsapp-deposits,
  town-owned-ai-service, training-centre-interview-packs and village-tractor-bookings are kept as drafts (`"draft": true`), not
  published. Trigger to bring one back: the owner has rewritten it by hand. Then switch its draft off, point its geometer.dev
  redirect (here, in `redirects.json`, and in public-web's `firebase.json` and `src/data/moved/streetlist-journal.json`) back at its
  own page, and run the tests. Until the redirect is pointed back, the old address still opens the front page; the publish
  check allows that, so switching a draft off in Pages CMS alone never stops the site from publishing. The browser test needs at least one published piece to check a piece page.
- **Bylines other than Geometer**: the field exists; the owner decides when writers sign their own pieces.

## 16 Nov 2026 — left after the Operator rename

- Lowercase "operator" in the pieces (`market-orders-by-voice`, `paid-work-around-an-agent`, `town-owned-ai-service`, and their copy in `migration/geometer-articles.json`) was already in use for the local role or a community's appointed service runner. Capitalise it, or reword the town-owned piece, when the pieces are next edited by hand.
- Hindi "साथी" in the cover alt text (`src/i18n/hi.ts` coverAlt) is the ordinary word "companion", not the role; unchanged.
