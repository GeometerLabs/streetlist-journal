# For the owner's review before anything is published

Everything below was written for the Journal's first version (14 Nov 2026) and waits for the owner's read. Pushing to `main`
publishes the site (`.github/workflows/pages.yml`), so read these first.

## Drafts to read

1. **The About page** (`src/i18n/about.ts`, shown at `/about`). Introduces the Journal as the place where art, philosophy, civic ideas
   and technology meet everyday life; the civic side as better living standards and better opportunities in villages and small
   towns; technology that leaves its value where it is made. English only until approved.
2. **The front page's introduction** (`home.intro` in `src/i18n/en.ts`, and its Hindi, Malayalam and Kannada versions): three
   sentences under the tagline and the line "Stories and ideas about technology, livelihoods, and people shaping the places they
   call home." (both kept as they were).
3. **The editorial guidelines** (`docs/editorial.md`), with the owner's definition of politics at the top of section 2.

## Choices to confirm

4. **The six pieces' sections** (`migration/map.json`): geometer.dev's Commerce and Work became Livelihoods, Community stayed
   Community and civic life, so four pieces are in Livelihoods and two (the tractor bookings and the town-owned service) in
   Community and civic life. Technology, Ideas and philosophy, and Art and culture start empty (their mascots sleep on the front
   page and invite a story). Labels are unchanged (five Ideas, one Opinion).
5. **Each piece's companion and mood** (`companion` in each piece, `scripts/migrate.ts`): the tuition centre's face for the training
   centre, the salon's for the salon, the grocery's for the market, and so on.
6. **Links that still point at geometer.dev** (`migration/map.json`, "links"): sources that name the pieces staying with Geometer
   (What you depend on, Lost acknowledgements, Exact-call approval) and Pricing link to geometer.dev, and "Write to support" in the
   training centre piece now opens an email to hello@geometer.dev. When the technical pieces move to docs.geometer.dev/notes, those
   three addresses can change in the pieces (Pages CMS > Sources).

## Waiting for other people

7. **Interface translations** (`docs/strings-review.md`): every Hindi, Malayalam and Kannada string beside its English, for a native
   speaker. Until a language's `reviewedBy` is filled, its pages are built and reachable but carry `noindex` and stay out of the
   sitemap. The six pieces stay English: none is machine-translated.
8. **Lead art** (`docs/image-prompts.md`): five pieces show a companion cover until their drawings exist; the salon keeps its photo.

## Good to know

9. `docs/story-ideas.md` is not shown on the site, but the repository is public, so anyone can read it.
10. The Pages CMS form (`.pages.yml`) was written against Pages CMS's documentation and checked by the tests, but not opened in the
    hosted app (that needs the GitHub repository first). First step after pushing: open one piece in Pages CMS, save it without
    changes, and check that the commit changes nothing (or only adds `"featured": false` / `"draft": false`).
