// Every interface word of the Streetlist Journal in English: the masthead, the front page, a piece's furniture (byline, sources,
// Keep reading), the lists, the 404 and the footer. Hindi, Malayalam and Kannada are siblings of the same shape (hi.ts, ml.ts,
// kn.ts); docs/strings-review.md lists every string side by side for a native speaker's review (npm run review-sheet writes it).
// The pieces themselves are not here: they are content (content/pieces), and the About page is English-only for now (about.ts).
//
// Wording rules (tests/content.test.ts checks every string in every language): plain, warm and short, the reader's gain first.
// Never: safe, guaranteed, proves, certified, 100%, earn, income, side hustle, passive, limited seats, join now, work from home,
// founder, founding, bot, leaderboard, streak, revolution, fight, against, disrupt; "community", never "communal"; no political
// words; decentralised means owned and run locally, never tokens or blockchains. Public contact: hello@geometer.dev only.
//
// The front page's introduction (home.intro) is a draft for the owner's review (docs/review.md).

export const CONTACT = "hello@geometer.dev";

export const en = {
  /** Who checked this language's interface words. Empty: waiting for a native speaker (the pages are built but not indexed). */
  reviewedBy: "the English original",
  site: {
    tagline: "The future, built locally.",
    sub: "Stories and ideas about technology, livelihoods, and people shaping the places they call home.",
    skip: "Skip to the content",
    navLabel: "Main",
    streetlistTitle: "Streetlist: pages and assistants for local services",
    themeLabel: "Dark theme",
    langLabel: "Language",
    runsOn: "Runs on Geometer",
  },
  home: {
    // Draft for the owner's review (docs/review.md): the Journal's techno-social framing in three warm, concrete sentences.
    intro:
      "Villages and small towns can own and run their own intelligence: local services, set up by local people, with the value staying where it is made. Owners keep their money, the partners who set things up keep their margin, and a community can own the services it relies on. This Journal is where art, ideas and technology meet that everyday life.",
    lead: "Lead story",
    latest: "Latest",
    sections: "Sections",
    more: (section: string) => `More in ${section}`,
    empty: "Nothing here yet.",
    write: "Have a story for this section? Write to us.",
    aboutTitle: "About the Journal",
    aboutText: "Why a magazine about villages and small towns running their own services, and how we write it.",
    aboutLink: "Read about the Journal",
  },
  piece: {
    by: (author: string) => `By ${author}`,
    minRead: (minutes: number) => `${minutes} min read`,
    updated: (date: string) => `Updated ${date}`,
    inEnglish: "In English",
    alsoIn: "Also in",
    coverCredit: "Cover: drawn for the Streetlist Journal with DiceBear",
    coverAlt: (section: string, mood: string) =>
      `A cover in the colour of ${section}: the story's cartoon companion, ${mood}, beside a speech bubble.`,
    exampleWho: { customer: "Customer", helper: "AI helper", owner: "The owner sees" },
    sources: "Sources and corrections",
    corrections: "Corrections:",
    noCorrections: "none recorded.",
    keepReading: "Keep reading",
    allJournal: "All of the Journal",
    reviewedBy: (name: string) => `Translation reviewed by ${name}`,
  },
  lists: {
    count: (n: number) => (n === 1 ? "1 piece" : `${n} pieces`),
    emptyTopic: "Nothing in this section yet.",
  },
  /** How the companion looks, in words, for alt text: the five moods of Streetlist's mood table, told as a face. */
  moods: { well: "cheerful", needs: "curious", wrong: "worried", closed: "asleep", busy: "busy" },
  notFound: {
    title: "This page has stepped out",
    text: "The address may have changed, or the page never existed. The front page has every piece.",
    home: "Go to the front page",
    other: "Or read the Journal in",
  },
  footer: {
    about: "About the Journal",
    feed: "RSS feed",
    streetlist: "Streetlist",
    credits: "Characters drawn with DiceBear (MIT licence); the character styles are CC0.",
    contact: (address: string) => `Write to ${address}`,
    write: "Stories, drawings and corrections are welcome.",
  },
  /** Label and topic names in this language. English takes them from content/taxonomy.json, so these stay empty here. */
  labels: {} as Record<string, { name: string; gloss: string }>,
  topics: {} as Record<string, { name: string; gloss: string }>,
};

/** The shape every language follows. */
export type Strings = typeof en;
