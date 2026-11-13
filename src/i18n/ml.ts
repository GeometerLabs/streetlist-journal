// The Journal's interface words in Malayalam, the same shape as en.ts. Written for the launch on 14 Nov 2026 and waiting for a
// native speaker's review (docs/strings-review.md): until reviewedBy is filled, the Malayalam pages are built and linked from the
// language switch but carry noindex and stay out of the sitemap. Brand names stay in Latin letters. Pieces get a Malayalam version
// only through content/pieces/ml, with their own reviewer.
import type { Strings } from "./en.ts";

export const ml = {
  reviewedBy: "",
  site: {
    tagline: "ഭാവി, ഇവിടെത്തന്നെ പണിതെടുക്കുന്നു.",
    sub: "സാങ്കേതികവിദ്യ, ഉപജീവനം, സ്വന്തം നാടിനെ രൂപപ്പെടുത്തുന്ന മനുഷ്യർ എന്നിവയെക്കുറിച്ചുള്ള കഥകളും ആശയങ്ങളും.",
    skip: "ഉള്ളടക്കത്തിലേക്ക് പോകുക",
    navLabel: "പ്രധാനം",
    streetlistTitle: "Streetlist: പ്രാദേശിക സേവനങ്ങൾക്കുള്ള പേജുകളും സഹായികളും",
    themeLabel: "ഡാർക്ക് തീം",
    langLabel: "ഭാഷ",
    runsOn: "Geometer-ൽ പ്രവർത്തിക്കുന്നു",
  },
  home: {
    intro:
      "ഗ്രാമങ്ങൾക്കും ചെറുപട്ടണങ്ങൾക്കും സ്വന്തം AI സേവനങ്ങൾ സ്വയം നടത്താം: നാട്ടുകാർ അവ ഒരുക്കുന്നു, അതിന്റെ മൂല്യം ജോലി നടക്കുന്നിടത്തുതന്നെ നിലനിൽക്കുന്നു. കടയുടെ പണം ഉടമയ്ക്ക്, സേവനം ഒരുക്കുന്ന പ്രാദേശിക പങ്കാളികൾക്ക് അവരുടെ മാർജിൻ, ആശ്രയിക്കുന്ന സേവനങ്ങളുടെ ഉടമസ്ഥത സമൂഹത്തിന്. കലയും ആശയങ്ങളും സാങ്കേതികവിദ്യയും ദൈനംദിന ജീവിതവുമായി കണ്ടുമുട്ടുന്ന ഇടമാണ് ഈ ജേണൽ.",
    lead: "പ്രധാന കഥ",
    latest: "പുതിയവ",
    sections: "വിഭാഗങ്ങൾ",
    more: (section: string) => `${section}: കൂടുതൽ`,
    empty: "ഇവിടെ ഇതുവരെ ഒന്നുമില്ല.",
    write: "ഈ വിഭാഗത്തിന് ഒരു കഥയുണ്ടോ? ഞങ്ങൾക്ക് എഴുതൂ.",
    aboutTitle: "ജേണലിനെക്കുറിച്ച്",
    aboutText: "ഗ്രാമങ്ങളുടെയും ചെറുപട്ടണങ്ങളുടെയും സ്വന്തം സേവനങ്ങളെക്കുറിച്ച് ഒരു മാസിക എന്തിന്, ഞങ്ങൾ അത് എങ്ങനെ എഴുതുന്നു.",
    aboutLink: "ജേണലിനെക്കുറിച്ച് വായിക്കുക (ഇംഗ്ലീഷിൽ)",
  },
  piece: {
    by: (author: string) => `എഴുതിയത്: ${author}`,
    minRead: (minutes: number) => `വായിക്കാൻ ${minutes} മിനിറ്റ്`,
    updated: (date: string) => `പുതുക്കിയത്: ${date}`,
    inEnglish: "ഇംഗ്ലീഷിൽ",
    alsoIn: "ഈ ഭാഷകളിലും",
    coverCredit: "കവർ: Streetlist Journal-നായി DiceBear ഉപയോഗിച്ച് വരച്ചത്",
    coverAlt: (section: string, mood: string) =>
      `${section} എന്ന വിഭാഗത്തിന്റെ നിറത്തിൽ ഒരു കവർ: കഥയുടെ കാർട്ടൂൺ കൂട്ടുകാരൻ, ${mood}, ഒരു സംഭാഷണ കുമിളയ്ക്കരികിൽ.`,
    exampleWho: { customer: "ഉപഭോക്താവ്", helper: "AI സഹായി", owner: "ഉടമ കാണുന്നത്" },
    sources: "ഉറവിടങ്ങളും തിരുത്തലുകളും",
    corrections: "തിരുത്തലുകൾ:",
    noCorrections: "ഒന്നും രേഖപ്പെടുത്തിയിട്ടില്ല.",
    keepReading: "തുടർന്നു വായിക്കുക",
    elsewhere: "geometer.dev-ൽ കൂടുതൽ വായിക്കാൻ",
    allJournal: "ജേണൽ മുഴുവൻ",
    reviewedBy: (name: string) => `പരിഭാഷ പരിശോധിച്ചത്: ${name}`,
  },
  lists: {
    count: (n: number) => `ലേഖനങ്ങൾ: ${n}`,
    emptyTopic: "ഈ വിഭാഗത്തിൽ ഇതുവരെ ലേഖനങ്ങളില്ല.",
  },
  moods: { well: "സന്തോഷത്തിൽ", needs: "ആകാംക്ഷയോടെ", wrong: "ആശങ്കയോടെ", closed: "ഉറക്കത്തിൽ", busy: "തിരക്കിൽ" },
  notFound: {
    title: "ഈ പേജ് ഇപ്പോൾ ഇവിടെയില്ല",
    text: "വിലാസം മാറിയിരിക്കാം, അല്ലെങ്കിൽ ഈ പേജ് ഒരിക്കലും ഉണ്ടായിരുന്നില്ല. എല്ലാ ലേഖനങ്ങളും മുഖപേജിലുണ്ട്.",
    home: "മുഖപേജിലേക്ക് പോകുക",
    other: "അല്ലെങ്കിൽ ജേണൽ വായിക്കുക",
  },
  footer: {
    about: "ജേണലിനെക്കുറിച്ച്",
    feed: "RSS ഫീഡ്",
    streetlist: "Streetlist",
    credits: "കഥാപാത്രങ്ങൾ DiceBear (MIT ലൈസൻസ്) ഉപയോഗിച്ച് വരച്ചവ; കഥാപാത്ര ശൈലികൾ CC0 ആണ്.",
    contact: (address: string) => `${address} എന്ന വിലാസത്തിൽ എഴുതൂ`,
    write: "കഥകളും ചിത്രങ്ങളും തിരുത്തലുകളും സ്വാഗതം.",
  },
  labels: {
    idea: { name: "നിർദ്ദേശം", gloss: "ഒരു നിർദ്ദേശം. ഇതുവരെ ആരും പരീക്ഷിച്ചിട്ടില്ല." },
    "practical-guide": { name: "പ്രായോഗിക വഴികാട്ടി", gloss: "ഒരു കാര്യം എങ്ങനെ ചെയ്യാം, പടിപടിയായി." },
    experiment: { name: "പരീക്ഷണം", gloss: "ഒരു ചെറിയ പരീക്ഷണം: ഞങ്ങൾ എന്തു ചെയ്തു, എന്തു കണ്ടു." },
    "field-report": { name: "ഫീൽഡ് റിപ്പോർട്ട്", gloss: "ഒരു യഥാർത്ഥ കടയിലോ കൂട്ടായ്മയിലോ സംഭവിച്ചത്, തീയതികളോടെ." },
    research: { name: "ഗവേഷണം", gloss: "സൂക്ഷ്മമായ പഠനം, അതിന്റെ ഉറവിടങ്ങളും പരിമിതികളും സഹിതം." },
    opinion: { name: "അഭിപ്രായം", gloss: "ഞങ്ങളുടെ ഒരു കാഴ്ചപ്പാട്. നിങ്ങൾക്ക് വിയോജിക്കാം." },
  },
  topics: {
    technology: { name: "സാങ്കേതികവിദ്യ", gloss: "ഒരു നാടിന് സ്വന്തമാക്കി സ്വയം നടത്താവുന്ന ഉപകരണങ്ങളും യന്ത്രങ്ങളും AI-യും." },
    livelihoods: { name: "ഉപജീവനം", gloss: "ജോലിയും വ്യാപാരവും: കടകൾ, തൊഴിലുകൾ, സേവനങ്ങൾ, ജോലി നടക്കുന്നിടത്തുതന്നെ നിൽക്കുന്ന പണവും." },
    community: { name: "സമൂഹവും പൗരജീവിതവും", gloss: "ഒരു ഗ്രാമമോ പട്ടണമോ വാർഡോ ഒരുമിച്ച് പങ്കിടുന്നതും തീരുമാനിക്കുന്നതും പരിപാലിക്കുന്നതും എങ്ങനെ." },
    ideas: { name: "ആശയങ്ങളും ദർശനവും", gloss: "സാങ്കേതികവിദ്യയെയും ദൈനംദിന ജീവിതത്തെയും കുറിച്ചുള്ള ചോദ്യങ്ങൾ, പതുക്കെ ആലോചിച്ചവ." },
    art: { name: "കലയും സംസ്കാരവും", gloss: "ചിത്രങ്ങൾ, പാട്ടുകൾ, കരകൗശലങ്ങൾ, കഥകൾ, അവയ്ക്കു ചുറ്റുമുള്ള ദൈനംദിന ജീവിതവും." },
  },
} satisfies Strings;
