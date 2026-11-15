// The About page's words: a DRAFT for the owner's review (docs/review.md lists it), in English only until the owner approves it and
// a native speaker reviews its translations. It introduces the Journal as the place where art, philosophy, civic ideas and
// technology meet everyday life in villages and small towns (owner, 14 Nov 2026), within docs/editorial.md: the civic side means
// better living standards and better opportunities close to home, told through ideas, people and examples; never sides, parties or
// named institutions; "decentralised" only in the plain sense of owned and run locally. No claims about results.
// Rendered by src/pages/about.ts, which adds the five sections and the six labels from content/taxonomy.json.

export const about = {
  title: "About the Journal",
  lead: "The Streetlist Journal is a magazine about villages and small towns that own and run their own intelligence. It is where art, philosophy, civic ideas and technology meet everyday life.",
  parts: [
    {
      heading: "Technology that leaves its value where it is made",
      paragraphs: [
        "A shop, a salon, a tuition centre or a farmers' group can have its own page and its own assistant that answers at any hour. The people who use it live nearby, and so do the people who set it up and look after it.",
        "We care about where the value goes. The owner keeps their money. The local Operator who set things up keeps their margin. A group that shares a tractor, or a price line for its farmers, can own the service it relies on. When we say decentralised, we mean exactly that: run close to home, by people you know.",
      ],
    },
    {
      heading: "Better living, close to home",
      paragraphs: [
        "Our civic side is simple to say: better living standards and better opportunities in villages and small towns. Good work close to home. Services within reach. Local ownership. The chance to build something where you live.",
        "We tell it through ideas, people and examples. We do not take sides; we look for what helps a place live well, and we write about it warmly and plainly.",
      ],
    },
    {
      heading: "Art, ideas and the everyday",
      paragraphs: [
        "A tea stall, a mandi at dawn, a school gate at four o'clock, a repair shop with a radio on: technology is already part of these places, quietly. We want to show that life, with its humour and its crowds, in drawings, photographs and stories, and to think about it slowly too.",
        "Each piece will carry a drawing or a photograph of the everyday life it is about, credited to whoever made it. Until a piece has one, its cover shows a companion from Streetlist: a cartoon face drawn with DiceBear, whose mood changes as the story goes.",
      ],
    },
  ],
  sectionsHeading: "Five sections",
  labelsHeading: "What the labels mean",
  labelsIntro: "Every piece says what kind of piece it is, so you know how much weight to give it. We do not claim results we have not seen.",
  languagesHeading: "Four languages",
  languages:
    "The Journal's pages are in English, Hindi, Malayalam and Kannada. A piece appears in another language only after a native speaker has reviewed its translation, and the piece names who did.",
  writeHeading: "Who writes it",
  write: [
    "For now the pieces are written by Geometer, the team whose engine runs Streetlist. We would like to publish writers, artists and researchers from villages and towns too.",
    "Stories, drawings and corrections are welcome at",
  ],
};
