// How the six pieces moved from geometer.dev's Journal to this one, as code: migratePiece() turns one record of
// migration/geometer-articles.json into the Journal's content file, applying exactly the maps in migration/map.json (new topic ids,
// new link and picture addresses, two keys geometer.dev needed and the Journal does not) and adding each piece's companion.
// tests/migration.test.ts uses the same function's maps in reverse to check that no word, date, label, block or credit changed.
// `node scripts/migrate.ts` wrote content/pieces/en/*.json once on 14 Nov 2026; running it again rewrites them from the frozen copy
// (only useful to undo a mistake: after the move, the content files are the source and Pages CMS edits them).
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { PieceFile } from "../src/content.ts";
import type { CastId, Mood } from "../src/characters/cast.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** One record as geometer.dev stored it (src/data/articles.json in the public-web repository). */
export type SourcePiece = Omit<PieceFile, "companion" | "image"> & {
  category: string;
  relatedAssessmentIds: string[];
  image?: { src: string; alt: string; credit: string; creditUrl?: string };
};

export interface MigrationMap {
  topics: Record<string, string>;
  links: Record<string, string>;
  images: Record<string, string>;
  dropped: { category: string; relatedAssessmentIds: unknown[] };
}

export const source = (): SourcePiece[] => JSON.parse(readFileSync(join(root, "migration/geometer-articles.json"), "utf8")).pieces;
export const migrationMap = (): MigrationMap => JSON.parse(readFileSync(join(root, "migration/map.json"), "utf8"));

/**
 * Each piece's companion: a face that suits it and the mood it shows at the top. New for the Journal (geometer.dev had none). The
 * faces are Streetlist's: the tuition centre's for the training centre, the salon's for the salon, the grocery's for the market.
 */
export const COMPANIONS: Record<string, { look: CastId; mood: Mood }> = {
  "training-centre-interview-packs": { look: "critters-1", mood: "needs" },
  "town-owned-ai-service": { look: "moods-2", mood: "needs" },
  "paid-work-around-an-agent": { look: "pixel-2", mood: "busy" },
  "market-orders-by-voice": { look: "sprouts-1", mood: "needs" },
  "salon-whatsapp-deposits": { look: "clay-1", mood: "well" },
  "village-tractor-bookings": { look: "critters-2", mood: "well" },
};

/** A link as the Journal writes it: the map's address, or the address unchanged (absolute links stay as they were). */
export function mapLink(map: MigrationMap, href: string): string {
  if (href in map.links) return map.links[href];
  if (href.startsWith("/")) throw new Error(`No new address for the geometer.dev link ${href}: add it to migration/map.json`);
  return href;
}

/** One source record as the Journal's content file. Key order follows the Pages CMS form (.pages.yml). */
export function migratePiece(src: SourcePiece, map: MigrationMap, moved: Set<string>): PieceFile {
  const topic = map.topics[src.topic];
  if (!topic) throw new Error(`No Journal section for geometer.dev's topic "${src.topic}"`);
  const out: PieceFile = {
    slug: src.slug,
    title: src.title,
    summary: src.summary,
    author: src.author,
    published: src.published,
    updated: src.updated,
    label: src.label,
    topic,
    ...(src.featured ? { featured: true } : {}),
    companion: COMPANIONS[src.slug],
    ...(src.image ? { image: { ...src.image, src: map.images[src.image.src] ?? src.image.src } } : {}),
    sections: src.sections,
    ...(src.example ? { example: src.example } : {}),
    ...(src.ending ? { ending: { ...src.ending, href: mapLink(map, src.ending.href) } } : {}),
    sources: src.sources.map((s) => ({ ...s, url: mapLink(map, s.url) })),
    related: src.related.filter((slug) => moved.has(slug)),
    corrections: src.corrections,
  };
  return out;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const map = migrationMap();
  const pieces = source();
  const moved = new Set(pieces.map((p) => p.slug));
  for (const src of pieces) {
    writeFileSync(join(root, "content/pieces/en", `${src.slug}.json`), `${JSON.stringify(migratePiece(src, map, moved), null, 2)}\n`);
  }
  console.log(`migrate: wrote ${pieces.length} pieces into content/pieces/en.`);
}
