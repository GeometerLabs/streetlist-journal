// The Journal's content, read from the repository at build time: the labels and topics (content/taxonomy.json) and the pieces
// (content/pieces/<lang>/<slug>.json, one JSON file per piece per language, the shape Pages CMS edits through .pages.yml).
//
// A piece's English file holds everything: words, dates, label, section (topic), companion, lead picture, sources. A translation
// (content/pieces/hi/<slug>.json and so on) holds only the words in that language and the name of the native speaker who
// reviewed them; it shares the English piece's slug, dates, picture and sources. The rules that decide what is published:
//  - an English piece with "draft": true is not published, nor are its translations;
//  - a translation is published only when "reviewedBy" is filled; until then it is a draft (built nowhere, listed nowhere);
//  - anything malformed stops the build with a message naming the file and the field, so a broken piece never goes live
//    (GitHub Pages keeps the last good version until the next push fixes it).
// The shape mirrors geometer.dev's articles.json one to one, so the six pieces that moved here are unchanged
// (tests/migration.test.ts).
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { CAST, MOODS, sectionMood, type CastId, type Mood } from "./characters/cast.ts";
import { LANGS, type Lang } from "./i18n/index.ts";

export interface Section {
  heading: string;
  paragraphs?: string[];
  items?: string[];
  /** geometer.dev's dated steps; none of the current pieces use it, but the shape keeps it. */
  timeline?: { when: string; text: string }[];
  /** Paragraphs that come after the list. */
  after?: string[];
}
export interface ExampleLine {
  who: "customer" | "helper" | "owner";
  name?: string;
  text: string;
}
export interface Example {
  title: string;
  caption: string;
  lines: ExampleLine[];
}
export interface Ending {
  kind: "discovery" | "next" | "reproduce";
  title: string;
  text: string;
  code?: string;
  href: string;
  linkText: string;
}
export interface LeadImage {
  /** "/media/<file>": a file in content/media (Pages CMS's media folder). */
  src: string;
  alt: string;
  credit: string;
  creditUrl?: string;
}
/** A piece as stored in English. */
export interface PieceFile {
  slug: string;
  title: string;
  summary: string;
  author: string;
  published: string;
  updated: string;
  label: string;
  topic: string;
  featured?: boolean;
  draft?: boolean;
  companion: { look: CastId; mood: Mood };
  image?: LeadImage;
  sections: Section[];
  example?: Example;
  ending?: Ending;
  sources: { title: string; url: string }[];
  related: string[];
  corrections: string[];
}
/** A translation as stored: only the words, plus who reviewed them. */
export interface TranslationFile {
  slug: string;
  reviewedBy: string;
  translatedBy?: string;
  updated?: string;
  title: string;
  summary: string;
  imageAlt?: string;
  sections: Section[];
  example?: Example;
  ending?: Pick<Ending, "title" | "text" | "linkText">;
  corrections?: string[];
}
/** A published piece in one language, ready to render. */
export interface Piece extends PieceFile {
  lang: Lang;
  /** The languages this piece is published in (English first). */
  langs: Lang[];
  /** The mood of each section's small face, from the English headings (src/characters/cast.ts). */
  moods: Mood[];
  /** For a translation: the reviewer's name, shown under the piece. */
  reviewedBy?: string;
  /** The language the example and the ending are in: a translation without its own falls back to the English words. */
  exampleLang: Lang;
  endingLang: Lang;
}
export interface Label {
  id: string;
  name: string;
  gloss: string;
}
export interface Topic {
  id: string;
  name: string;
  gloss: string;
  mascot: { look: CastId; mood: Mood };
  image?: LeadImage;
}
export interface Taxonomy {
  labels: Label[];
  topics: Topic[];
}
export interface Content {
  taxonomy: Taxonomy;
  /** Published pieces by language, newest first (the English list holds every published piece). */
  pieces: Record<Lang, Piece[]>;
  /** Translations that wait for a reviewer, for the build's report. */
  drafts: string[];
}

/** Top-level names the site itself uses: no piece may take one as its slug (the slug pattern in .pages.yml says the same). */
export const RESERVED = ["about", "topics", "labels", "en", "hi", "ml", "kn", "assets", "img", "media", "feed", "sitemap", "404", "index", "robots", "favicon"];
export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** geometer.dev's word count, ported unchanged: headings, paragraphs, lists and the timeline; read time is this over 200 a minute. */
export function wordCount(piece: { sections: Section[] }): number {
  let words = 0;
  const add = (text: string) => (words += text.split(/\s+/).filter(Boolean).length);
  for (const section of piece.sections) {
    add(section.heading);
    for (const text of [...(section.paragraphs ?? []), ...(section.items ?? []), ...(section.after ?? [])]) add(text);
    for (const step of section.timeline ?? []) add(`${step.when} ${step.text}`);
  }
  return words;
}
export const readMinutes = (piece: { sections: Section[] }): number => Math.max(1, Math.ceil(wordCount(piece) / 200));

/** Collects every problem in a file before failing, so one build run names them all. */
class Problems {
  list: string[] = [];
  private readonly file: string;
  constructor(file: string) {
    this.file = file;
  }
  add(message: string) {
    this.list.push(`${this.file}: ${message}`);
  }
  text(value: unknown, field: string, required = true): value is string {
    if (typeof value === "string" && value.trim() !== "") return true;
    if (required || value !== undefined) this.add(`"${field}" must be filled in`);
    return false;
  }
}

function readJson(file: string): unknown {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    throw new Error(`${file}: not valid JSON (${(error as Error).message})`);
  }
}

function checkSections(p: Problems, sections: unknown, field = "sections"): void {
  if (!Array.isArray(sections) || sections.length === 0) return p.add(`"${field}" needs at least one section`);
  sections.forEach((s: Section, i) => {
    p.text(s?.heading, `${field}[${i + 1}].heading`);
    const blocks = [...(s.paragraphs ?? []), ...(s.items ?? []), ...(s.after ?? [])];
    if (blocks.length === 0 && !(s.timeline ?? []).length) p.add(`${field}[${i + 1}] has no paragraphs or list items`);
    blocks.forEach((b, j) => typeof b === "string" && b.trim() !== "" || p.add(`${field}[${i + 1}] has an empty paragraph or item (${j + 1})`));
  });
}

function checkExample(p: Problems, example: Example | undefined): void {
  if (example === undefined) return;
  p.text(example.title, "example.title");
  p.text(example.caption, "example.caption");
  if (!Array.isArray(example.lines) || example.lines.length === 0) p.add(`"example.lines" needs at least one line`);
  for (const [i, line] of (example.lines ?? []).entries()) {
    if (!["customer", "helper", "owner"].includes(line.who)) p.add(`example.lines[${i + 1}].who must be customer, helper or owner`);
    p.text(line.text, `example.lines[${i + 1}].text`);
  }
}

/** Reads, checks and orders the whole Journal. `root` is the repository (tests point it at fixtures). */
export function loadContent(root: string): Content {
  const taxonomy = readJson(join(root, "content/taxonomy.json")) as Taxonomy;
  const labelIds = new Set(taxonomy.labels.map((l) => l.id));
  const topicIds = new Set(taxonomy.topics.map((t) => t.id));
  const errors: string[] = [];
  for (const t of taxonomy.topics) {
    if (!(t.mascot?.look in CAST) || !MOODS.includes(t.mascot?.mood)) errors.push(`content/taxonomy.json: topic "${t.id}" needs a mascot from the cast and a mood`);
    // A header picture is optional; once its file is chosen, its alt text and credit are required.
    if (t.image?.src) {
      if (!/^\/media\/[^/]+$/.test(t.image.src) || !existsSync(join(root, "content", t.image.src))) errors.push(`content/taxonomy.json: topic "${t.id}" picture ${t.image.src} is not a file in content/media`);
      if (!t.image.alt?.trim() || !t.image.credit?.trim()) errors.push(`content/taxonomy.json: topic "${t.id}" picture needs its alt text and credit`);
    } else delete t.image;
  }

  // English: the pieces themselves.
  const enDir = join(root, "content/pieces/en");
  const english: PieceFile[] = [];
  for (const name of readdirSync(enDir).filter((f) => f.endsWith(".json")).sort()) {
    const file = `content/pieces/en/${name}`;
    const p = new Problems(file);
    const piece = readJson(join(enDir, name)) as PieceFile;
    if (p.text(piece.slug, "slug")) {
      if (!SLUG.test(piece.slug)) p.add(`"slug" must be lower-case words joined by hyphens (got "${piece.slug}")`);
      if (RESERVED.includes(piece.slug)) p.add(`"slug" cannot be "${piece.slug}": the site uses that address`);
      if (basename(name, ".json") !== piece.slug) console.warn(`${file}: the file name differs from the slug "${piece.slug}"; the slug decides the address.`);
    }
    for (const field of ["title", "summary", "author"] as const) p.text(piece[field], field);
    for (const field of ["published", "updated"] as const) if (!DATE.test(String(piece[field] ?? ""))) p.add(`"${field}" must be a date like 2026-11-14`);
    if (!labelIds.has(piece.label)) p.add(`"label" must be one of ${[...labelIds].join(", ")}`);
    if (!topicIds.has(piece.topic)) p.add(`"topic" must be one of ${[...topicIds].join(", ")}`);
    if (!(piece.companion?.look in CAST)) p.add(`"companion.look" must be one of the cast (${Object.keys(CAST).join(", ")})`);
    if (!MOODS.includes(piece.companion?.mood)) p.add(`"companion.mood" must be one of ${MOODS.join(", ")}`);
    if (piece.image !== undefined) {
      if (p.text(piece.image.src, "image.src")) {
        if (!/^\/media\/[^/]+$/.test(piece.image.src) || !existsSync(join(root, "content", piece.image.src))) p.add(`"image.src" ${piece.image.src} is not a file in content/media`);
      }
      p.text(piece.image.alt, "image.alt");
      p.text(piece.image.credit, "image.credit");
    }
    checkSections(p, piece.sections);
    checkExample(p, piece.example);
    if (piece.ending !== undefined) for (const field of ["title", "text", "href", "linkText"] as const) p.text(piece.ending[field], `ending.${field}`);
    for (const [i, s] of (piece.sources ?? []).entries()) {
      p.text(s.title, `sources[${i + 1}].title`);
      p.text(s.url, `sources[${i + 1}].url`);
    }
    piece.sources ??= [];
    piece.related ??= [];
    piece.corrections ??= [];
    errors.push(...p.list);
    english.push(piece);
  }
  const seen = new Set<string>();
  for (const piece of english) {
    if (seen.has(piece.slug)) errors.push(`Two pieces share the slug "${piece.slug}"`);
    seen.add(piece.slug);
  }
  for (const piece of english) {
    for (const slug of piece.related) if (!seen.has(slug)) errors.push(`content/pieces/en/${piece.slug}.json: "related" names "${slug}", which is not a piece`);
  }

  const published = english.filter((p) => !p.draft);
  const bySlug = new Map(published.map((p) => [p.slug, p]));

  // Translations: published only once a native speaker has reviewed them.
  const drafts: string[] = [];
  const translations = new Map<string, Map<Lang, TranslationFile>>();
  for (const lang of LANGS.filter((l) => l !== "en")) {
    const dir = join(root, "content/pieces", lang);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
      const file = `content/pieces/${lang}/${name}`;
      const p = new Problems(file);
      const t = readJson(join(dir, name)) as TranslationFile;
      const base = bySlug.get(t.slug);
      if (!base) {
        // A translation of a draft or of a piece that does not exist waits with it.
        drafts.push(`${file} (no published English piece "${t.slug}")`);
        continue;
      }
      if (typeof t.reviewedBy !== "string" || t.reviewedBy.trim() === "") {
        drafts.push(`${file} (waiting for a reviewer)`);
        continue;
      }
      p.text(t.title, "title");
      p.text(t.summary, "summary");
      checkSections(p, t.sections);
      checkExample(p, t.example);
      if (t.updated !== undefined && t.updated !== "" && !DATE.test(t.updated)) p.add(`"updated" must be a date like 2026-11-14`);
      errors.push(...p.list);
      if (p.list.length === 0) {
        if (!translations.has(t.slug)) translations.set(t.slug, new Map());
        translations.get(t.slug)!.set(lang, t);
      }
    }
  }
  if (errors.length) throw new Error(`The Journal's content has problems:\n  ${errors.join("\n  ")}`);

  const newestFirst = (a: PieceFile, b: PieceFile) => b.published.localeCompare(a.published) || a.slug.localeCompare(b.slug);
  const pieces = Object.fromEntries(LANGS.map((l) => [l, [] as Piece[]])) as Record<Lang, Piece[]>;
  for (const base of [...published].sort(newestFirst)) {
    const moods = base.sections.map((s) => sectionMood(s.heading));
    const versions = translations.get(base.slug) ?? new Map<Lang, TranslationFile>();
    const langs: Lang[] = ["en", ...LANGS.filter((l) => versions.has(l))];
    pieces.en.push({ ...base, lang: "en", langs, moods, exampleLang: "en", endingLang: "en" });
    for (const [lang, t] of versions) {
      pieces[lang].push({
        ...base,
        lang,
        langs,
        // Section moods follow the English piece part by part; a translation with a different number of parts gets the keyword rule.
        moods: t.sections.length === base.sections.length ? moods : t.sections.map((s) => sectionMood(s.heading)),
        title: t.title,
        summary: t.summary,
        updated: t.updated || base.updated,
        image: base.image && { ...base.image, alt: t.imageAlt || base.image.alt },
        sections: t.sections,
        example: t.example ?? base.example,
        ending: base.ending && t.ending ? { ...base.ending, ...t.ending } : base.ending,
        corrections: t.corrections ?? base.corrections,
        reviewedBy: t.reviewedBy,
        exampleLang: t.example ? lang : "en",
        endingLang: t.ending ? lang : "en",
      });
    }
  }
  return { taxonomy, pieces, drafts };
}

/** The lead story: the piece marked featured, otherwise the newest. */
export const leadOf = (pieces: Piece[]): Piece | undefined => pieces.find((p) => p.featured) ?? pieces[0];
