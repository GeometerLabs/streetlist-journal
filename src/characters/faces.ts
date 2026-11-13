// The mood table: which DiceBear eyes and mouth each style uses for each of the five moods. It is Streetlist's approved table
// (streetlist.in, src/characters/faces.ts there), copied unchanged so a companion in the Journal looks exactly like the same face on
// streetlist.in. Everything else about a face (shape, top, colours, tile, details) comes from DiceBear's defaults and the seed.
// Used by draw.ts at build time.
import type { Mood, StyleId } from "./cast.ts";

export const FACES: Record<StyleId, Record<Mood, [eyes: string, mouth: string]>> = {
  clay: { well: ["even", "smile"], needs: ["up", "o"], wrong: ["down", "frown"], closed: ["happy", "line"], busy: ["side", "line"] },
  critters: { well: ["round", "smile"], needs: ["wide", "ooh"], wrong: ["bigPupils", "sad"], closed: ["closedLine", "line"], busy: ["sideeye", "wavy"] },
  sprouts: { well: ["round", "smile"], needs: ["wide", "open"], wrong: ["bigPupils", "frown"], closed: ["closedLine", "line"], busy: ["sideeye", "wavy"] },
  moods: { well: ["pupils", "smile"], needs: ["bigPupils", "open"], wrong: ["tallPupils", "frown"], closed: ["closed", "line"], busy: ["lookSide", "wavy"] },
  pixelbot: { well: ["round", "smile"], needs: ["tall", "open"], wrong: ["slim", "tiny"], closed: ["soft", "flat"], busy: ["blocks", "flat"] },
};
