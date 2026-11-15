// The Journal's interface words in Kannada, the same shape as en.ts. Written for the launch on 14 Nov 2026 and waiting for a native
// speaker's review (docs/strings-review.md): until reviewedBy is filled, the Kannada pages are built and linked from the language
// switch but carry noindex and stay out of the sitemap. Brand names stay in Latin letters. Pieces get a Kannada version only
// through content/pieces/kn, with their own reviewer.
import type { Strings } from "./en.ts";

export const kn = {
  reviewedBy: "",
  site: {
    tagline: "ನಾವೇ ಇಲ್ಲಿ ಕಟ್ಟುವ ಭವಿಷ್ಯ.",
    sub: "ತಂತ್ರಜ್ಞಾನ, ಜೀವನೋಪಾಯ ಮತ್ತು ತಮ್ಮ ಊರನ್ನು ರೂಪಿಸುತ್ತಿರುವ ಜನರ ಕುರಿತ ಕಥೆಗಳು ಮತ್ತು ವಿಚಾರಗಳು.",
    skip: "ವಿಷಯಕ್ಕೆ ನೇರವಾಗಿ ಹೋಗಿ",
    navLabel: "ಮುಖ್ಯ",
    streetlistTitle: "Streetlist: ಸ್ಥಳೀಯ ಸೇವೆಗಳಿಗಾಗಿ ಪುಟಗಳು ಮತ್ತು ಸಹಾಯಕರು",
    themeLabel: "ಡಾರ್ಕ್ ಥೀಮ್",
    langLabel: "ಭಾಷೆ",
    runsOn: "Geometer ಮೇಲೆ ನಡೆಯುತ್ತದೆ",
  },
  home: {
    intro:
      "ಹಳ್ಳಿಗಳು ಮತ್ತು ಸಣ್ಣ ಪಟ್ಟಣಗಳು ತಮ್ಮದೇ AI ಸೇವೆಗಳನ್ನು ತಾವೇ ನಡೆಸಬಹುದು: ಸ್ಥಳೀಯರು ಅವನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತಾರೆ, ಅವುಗಳ ಮೌಲ್ಯ ಕೆಲಸ ನಡೆಯುವಲ್ಲೇ ಉಳಿಯುತ್ತದೆ. ಅಂಗಡಿಯ ಹಣ ಮಾಲೀಕರಿಗೆ, ಸೇವೆಯನ್ನು ಸಿದ್ಧಪಡಿಸುವ ಸ್ಥಳೀಯ ಆಪರೇಟರ್‌ಗಳಿಗೆ ಅವರ ಮಾರ್ಜಿನ್, ತಾನು ಅವಲಂಬಿಸಿರುವ ಸೇವೆಗಳ ಒಡೆತನ ಸಮುದಾಯಕ್ಕೆ. ಕಲೆ, ವಿಚಾರ ಮತ್ತು ತಂತ್ರಜ್ಞಾನ ದಿನನಿತ್ಯದ ಬದುಕನ್ನು ಸಂಧಿಸುವ ಜಾಗ ಈ ಜರ್ನಲ್.",
    lead: "ಮುಖ್ಯ ಕಥೆ",
    latest: "ಹೊಸದು",
    sections: "ವಿಭಾಗಗಳು",
    more: (section: string) => `${section}: ಇನ್ನಷ್ಟು`,
    soon: "ಮೊದಲ ಲೇಖನಗಳನ್ನು ಬರೆಯಲಾಗುತ್ತಿದೆ. ಸ್ವಲ್ಪ ಸಮಯದಲ್ಲೇ ಮತ್ತೆ ನೋಡಿ.",
    empty: "ಇಲ್ಲಿ ಇನ್ನೂ ಏನೂ ಇಲ್ಲ.",
    write: "ಈ ವಿಭಾಗಕ್ಕೆ ಒಂದು ಕಥೆ ಇದೆಯೇ? ನಮಗೆ ಬರೆಯಿರಿ.",
    aboutTitle: "ಜರ್ನಲ್ ಬಗ್ಗೆ",
    aboutText: "ಹಳ್ಳಿಗಳು ಮತ್ತು ಸಣ್ಣ ಪಟ್ಟಣಗಳ ಸ್ವಂತ ಸೇವೆಗಳ ಬಗ್ಗೆ ಒಂದು ಪತ್ರಿಕೆ ಏಕೆ, ಮತ್ತು ನಾವು ಅದನ್ನು ಹೇಗೆ ಬರೆಯುತ್ತೇವೆ.",
    aboutLink: "ಜರ್ನಲ್ ಬಗ್ಗೆ ಓದಿ (ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ)",
  },
  piece: {
    by: (author: string) => `ಬರೆದವರು: ${author}`,
    minRead: (minutes: number) => `ಓದಲು ${minutes} ನಿಮಿಷ`,
    updated: (date: string) => `ನವೀಕರಿಸಿದ್ದು: ${date}`,
    inEnglish: "ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ",
    alsoIn: "ಈ ಭಾಷೆಗಳಲ್ಲೂ",
    coverCredit: "ಮುಖಪುಟ ಚಿತ್ರ: Streetlist Journal-ಗಾಗಿ DiceBear ಬಳಸಿ ಬಿಡಿಸಿದ್ದು",
    coverAlt: (section: string, mood: string) =>
      `${section} ವಿಭಾಗದ ಬಣ್ಣದಲ್ಲಿ ಮುಖಪುಟ ಚಿತ್ರ: ಕಥೆಯ ಕಾರ್ಟೂನ್ ಜೊತೆಗಾರ, ${mood}, ಮಾತಿನ ಗುಳ್ಳೆಯ ಪಕ್ಕದಲ್ಲಿ.`,
    exampleWho: { customer: "ಗ್ರಾಹಕರು", helper: "AI ಸಹಾಯಕ", owner: "ಮಾಲೀಕರು ನೋಡುವುದು" },
    sources: "ಮೂಲಗಳು ಮತ್ತು ತಿದ್ದುಪಡಿಗಳು",
    corrections: "ತಿದ್ದುಪಡಿಗಳು:",
    noCorrections: "ಯಾವುದೂ ದಾಖಲಾಗಿಲ್ಲ.",
    keepReading: "ಇನ್ನಷ್ಟು ಓದಿ",
    elsewhere: "geometer.dev ನಲ್ಲಿ ಇನ್ನಷ್ಟು ಓದಲು",
    allJournal: "ಇಡೀ ಜರ್ನಲ್",
    reviewedBy: (name: string) => `ಅನುವಾದ ಪರಿಶೀಲಿಸಿದವರು: ${name}`,
  },
  lists: {
    count: (n: number) => `ಲೇಖನಗಳು: ${n}`,
    emptyTopic: "ಈ ವಿಭಾಗದಲ್ಲಿ ಇನ್ನೂ ಲೇಖನಗಳಿಲ್ಲ.",
  },
  moods: { well: "ಖುಷಿಯಾಗಿ", needs: "ಕುತೂಹಲದಿಂದ", wrong: "ಚಿಂತೆಯಿಂದ", closed: "ನಿದ್ದೆಯಲ್ಲಿ", busy: "ಬಿಡುವಿಲ್ಲದೆ" },
  notFound: {
    title: "ಈ ಪುಟ ಈಗ ಇಲ್ಲಿಲ್ಲ",
    text: "ವಿಳಾಸ ಬದಲಾಗಿರಬಹುದು, ಅಥವಾ ಈ ಪುಟ ಎಂದೂ ಇರಲಿಲ್ಲ. ಎಲ್ಲಾ ಲೇಖನಗಳು ಮುಖಪುಟದಲ್ಲಿವೆ.",
    home: "ಮುಖಪುಟಕ್ಕೆ ಹೋಗಿ",
    other: "ಅಥವಾ ಜರ್ನಲ್ ಓದಿ",
  },
  footer: {
    about: "ಜರ್ನಲ್ ಬಗ್ಗೆ",
    feed: "RSS ಫೀಡ್",
    streetlist: "Streetlist",
    credits: "ಪಾತ್ರಗಳನ್ನು DiceBear (MIT ಪರವಾನಗಿ) ಬಳಸಿ ಬಿಡಿಸಲಾಗಿದೆ; ಪಾತ್ರಗಳ ಶೈಲಿಗಳು CC0.",
    contact: (address: string) => `${address} ಗೆ ಬರೆಯಿರಿ`,
    write: "ಕಥೆಗಳು, ಚಿತ್ರಗಳು ಮತ್ತು ತಿದ್ದುಪಡಿಗಳಿಗೆ ಸ್ವಾಗತ.",
  },
  labels: {
    idea: { name: "ಪ್ರಸ್ತಾವನೆ", gloss: "ಒಂದು ಪ್ರಸ್ತಾವನೆ. ಇನ್ನೂ ಯಾರೂ ಪ್ರಯತ್ನಿಸಿಲ್ಲ." },
    "practical-guide": { name: "ಪ್ರಾಯೋಗಿಕ ಮಾರ್ಗದರ್ಶಿ", gloss: "ಒಂದು ಕೆಲಸವನ್ನು ಹಂತ ಹಂತವಾಗಿ ಮಾಡುವುದು ಹೇಗೆ." },
    experiment: { name: "ಪ್ರಯೋಗ", gloss: "ಒಂದು ಸಣ್ಣ ಪರೀಕ್ಷೆ: ನಾವು ಏನು ನಡೆಸಿದೆವು, ಏನು ಕಂಡೆವು." },
    "field-report": { name: "ಕ್ಷೇತ್ರ ವರದಿ", gloss: "ನಿಜವಾದ ಅಂಗಡಿ ಅಥವಾ ಗುಂಪಿನಲ್ಲಿ ನಡೆದದ್ದು, ದಿನಾಂಕಗಳೊಂದಿಗೆ." },
    research: { name: "ಸಂಶೋಧನೆ", gloss: "ಎಚ್ಚರಿಕೆಯ ಅಧ್ಯಯನ, ಅದರ ಮೂಲಗಳು ಮತ್ತು ಮಿತಿಗಳೊಂದಿಗೆ." },
    opinion: { name: "ಅಭಿಪ್ರಾಯ", gloss: "ನಮ್ಮ ಒಂದು ನಿಲುವು. ನೀವು ಒಪ್ಪದಿರಬಹುದು." },
  },
  topics: {
    technology: { name: "ತಂತ್ರಜ್ಞಾನ", gloss: "ಒಂದು ಊರು ತಾನೇ ಹೊಂದಿ ನಡೆಸಬಹುದಾದ ಉಪಕರಣಗಳು, ಯಂತ್ರಗಳು ಮತ್ತು AI." },
    livelihoods: { name: "ಜೀವನೋಪಾಯ", gloss: "ಕೆಲಸ ಮತ್ತು ವ್ಯಾಪಾರ: ಅಂಗಡಿಗಳು, ಕಸುಬುಗಳು, ಸೇವೆಗಳು, ಮತ್ತು ಕೆಲಸ ನಡೆಯುವಲ್ಲೇ ಉಳಿಯುವ ಹಣ." },
    community: { name: "ಸಮುದಾಯ ಮತ್ತು ನಾಗರಿಕ ಜೀವನ", gloss: "ಒಂದು ಹಳ್ಳಿ, ಪಟ್ಟಣ ಅಥವಾ ವಾರ್ಡ್ ಒಟ್ಟಾಗಿ ಹಂಚಿಕೊಳ್ಳುವುದು, ನಿರ್ಧರಿಸುವುದು ಮತ್ತು ನೋಡಿಕೊಳ್ಳುವುದು ಹೇಗೆ." },
    ideas: { name: "ವಿಚಾರ ಮತ್ತು ತತ್ವಶಾಸ್ತ್ರ", gloss: "ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ದಿನನಿತ್ಯದ ಬದುಕಿನ ಕುರಿತ ಪ್ರಶ್ನೆಗಳು, ನಿಧಾನವಾಗಿ ಯೋಚಿಸಿದಂಥವು." },
    art: { name: "ಕಲೆ ಮತ್ತು ಸಂಸ್ಕೃತಿ", gloss: "ಚಿತ್ರಗಳು, ಹಾಡುಗಳು, ಕರಕುಶಲ ಮತ್ತು ಕಥೆಗಳು, ಅವುಗಳ ಸುತ್ತಲಿನ ದಿನನಿತ್ಯದ ಬದುಕು." },
  },
} satisfies Strings;
