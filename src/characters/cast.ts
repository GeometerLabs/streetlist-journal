// The Journal's cast: the DiceBear faces that keep the pieces company. Every piece has a companion (a face and the mood it shows at
// the top of the piece), every section of the magazine has a mascot (content/taxonomy.json names it), and each heading inside a
// piece gets the companion in the mood of that part of the story (sectionMood below), so the face changes as the reader goes.
// The faces have no names (Streetlist's rule since 14 Nov 2026): in the Pages CMS form they are "Clay 1", "Critters 2" and so on.
// The seeds are the ones Streetlist picked from its contact sheet, so a reader who knows streetlist.in meets familiar faces.
// Used by the build (src/pages, src/images.ts) and compared with the choices in .pages.yml by tests/content.test.ts.

export const STYLES = ["clay", "critters", "sprouts", "moods", "pixelbot"] as const;
export type StyleId = (typeof STYLES)[number];

export const MOODS = ["well", "needs", "wrong", "closed", "busy"] as const;
export type Mood = (typeof MOODS)[number];

/** One face: the DiceBear style and the seed (the seed decides shape, colours and tile). */
export interface Look {
  style: StyleId;
  seed: string;
}

/** Every face a piece or a section can use, by the id stored in content files ("clay-1"). */
export const CAST: Record<string, Look> = {
  "clay-1": { style: "clay", seed: "clay-0" },
  "clay-2": { style: "clay", seed: "clay-3" },
  "clay-3": { style: "clay", seed: "clay-5" },
  "critters-1": { style: "critters", seed: "critters-0" },
  "critters-2": { style: "critters", seed: "critters-3" },
  "sprouts-1": { style: "sprouts", seed: "sprouts-1" },
  "sprouts-2": { style: "sprouts", seed: "sprouts-0" },
  "moods-1": { style: "moods", seed: "moods-0" },
  "moods-2": { style: "moods", seed: "moods-1" },
  "pixel-1": { style: "pixelbot", seed: "pixelbot-0" },
  "pixel-2": { style: "pixelbot", seed: "pixelbot-4" },
};
export type CastId = keyof typeof CAST;

/**
 * The mood of one part of a story, read from its English heading, so the small face beside each heading follows the story:
 * worried where things can go wrong, curious at an open question, cheerful elsewhere. Translations use the English piece's moods
 * section by section (their headings are in other words). Plain keyword rules on purpose: a writer never has to set anything.
 */
export function sectionMood(heading: string): Mood {
  if (/\b(wrong|fail\w*|mistakes?|risks?|lost|disput\w*)\b/i.test(heading)) return "wrong";
  if (/\b(pay|pays|paid|cost\w*|money|work)\b/i.test(heading)) return "busy";
  if (/\?\s*$|\b(problem|question|whose|who|whether)\b/i.test(heading)) return "needs";
  return "well";
}
