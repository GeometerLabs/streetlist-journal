// The migration check (`npm test`): the six pieces that moved from geometer.dev's Journal are word for word what geometer.dev had.
// Each record of migration/geometer-articles.json (the frozen copy) is compared with its content/pieces/en file, field by field and
// block by block, allowing only the documented maps in migration/map.json (section ids, link and picture addresses, two dropped
// keys, related pieces that stayed behind) and the new companion. The read time is checked with geometer.dev's own formula, and
// every paragraph, list item, example line and credit is checked on the built page too (run `npm run build` first).
// Set GEOMETER_ARTICLES=<path to public-web's src/data/articles.json> to also check the frozen copy against geometer.dev's file.
// Not run in the deploy workflow: once the owner edits a moved piece on purpose, this test has done its job.
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mapLink, migrationMap, source, type SourcePiece } from "../scripts/migrate.ts";
import { readMinutes, type PieceFile } from "../src/content.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const map = migrationMap();
const pieces = source();
const moved = new Set(pieces.map((p) => p.slug));
const contentOf = (slug: string): PieceFile => JSON.parse(readFileSync(join(root, "content/pieces/en", `${slug}.json`), "utf8"));

/** geometer.dev's own read time (src/journal.ts there), written out again here so the check does not depend on the port in src/content.ts. */
function geometerReadMinutes(piece: SourcePiece): number {
  let words = 0;
  const add = (text: string) => (words += text.split(/\s+/).filter(Boolean).length);
  for (const s of piece.sections) {
    add(s.heading);
    for (const text of [...(s.paragraphs ?? []), ...(s.items ?? []), ...(s.after ?? [])]) add(text);
    for (const step of s.timeline ?? []) add(`${step.when} ${step.text}`);
  }
  return Math.max(1, Math.ceil(words / 200));
}

/** HTML as the build escapes it (src/pages/layout.ts esc), to find a text on a built page. */
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

test("the frozen copy holds exactly the six pieces that moved", () => {
  assert.deepEqual([...moved].sort(), [
    "market-orders-by-voice", "paid-work-around-an-agent", "salon-whatsapp-deposits", "town-owned-ai-service",
    "training-centre-interview-packs", "village-tractor-bookings",
  ]);
});

test("the frozen copy matches geometer.dev's articles.json, when GEOMETER_ARTICLES points at it", { skip: !process.env.GEOMETER_ARTICLES }, () => {
  const live = JSON.parse(readFileSync(process.env.GEOMETER_ARTICLES!, "utf8")) as SourcePiece[];
  for (const p of pieces) assert.deepEqual(live.find((x) => x.slug === p.slug), p, p.slug);
});

for (const src of pieces) {
  test(`${src.slug}: every word, date, label, block and credit is unchanged`, () => {
    const out = contentOf(src.slug);
    // Every key of the source is kept, mapped or dropped as documented, and the content adds only the companion.
    const kept = ["slug", "title", "summary", "author", "published", "updated", "label", "featured", "sections", "example", "corrections"];
    const mapped = ["topic", "image", "ending", "sources", "related"];
    const dropped = Object.keys(map.dropped).filter((k) => k !== "about");
    for (const key of Object.keys(src)) assert.ok([...kept, ...mapped, ...dropped].includes(key), `${key} is not accounted for`);
    for (const key of Object.keys(out)) assert.ok([...kept, ...mapped, "elsewhere", "companion"].includes(key), `${key} is new and undocumented`);

    for (const key of kept) assert.deepEqual(out[key as keyof PieceFile], src[key as keyof SourcePiece], key);
    for (const key of dropped) assert.deepEqual(src[key as keyof SourcePiece], map.dropped[key as keyof typeof map.dropped], `dropped ${key}`);
    assert.equal(out.topic, map.topics[src.topic], "topic");
    assert.deepEqual(out.sources, src.sources.map((s) => ({ title: s.title, url: mapLink(map, s.url) })), "sources");
    if (src.ending) assert.deepEqual(out.ending, { ...src.ending, href: mapLink(map, src.ending.href) }, "ending");
    else assert.equal(out.ending, undefined);
    if (src.image) {
      assert.deepEqual(out.image, { ...src.image, src: map.images[src.image.src] }, "image");
      assert.ok(existsSync(join(root, "content", out.image!.src)), "the lead picture's file is in content/media");
    } else assert.equal(out.image, undefined);
    // Related pieces that moved stay in Keep reading; the ones that stayed with Geometer are kept as links to geometer.dev.
    assert.deepEqual(out.related, src.related.filter((s) => moved.has(s)), "related");
    const behind = src.related.filter((s) => !moved.has(s));
    assert.deepEqual(out.elsewhere ?? [], behind.map((slug) => ({ title: map.stayedBehind[slug], url: `https://geometer.dev/journal/${slug}` })), "elsewhere");
    assert.equal(readMinutes(out), geometerReadMinutes(src), "read time");
  });

  test(`${src.slug}: the built page shows every paragraph, item, example line and credit`, { skip: !existsSync(join(root, "dist", `${src.slug}.html`)) && "run npm run build first" }, () => {
    const html = readFileSync(join(root, "dist", `${src.slug}.html`), "utf8");
    const texts = [src.title, src.summary, ...src.sections.flatMap((s) => [s.heading, ...(s.paragraphs ?? []), ...(s.items ?? []), ...(s.after ?? [])])];
    if (src.example) texts.push(src.example.title, src.example.caption, ...src.example.lines.flatMap((l) => [l.text, ...(l.name ? [l.name] : [])]));
    if (src.ending) texts.push(src.ending.title, src.ending.text, src.ending.linkText);
    if (src.image) texts.push(src.image.alt, src.image.credit);
    for (const s of src.sources) texts.push(s.title);
    for (const slug of src.related.filter((r) => !moved.has(r))) texts.push(map.stayedBehind[slug]);
    for (const text of texts) assert.ok(html.includes(esc(text)), `missing on the page: ${text.slice(0, 80)}`);
    assert.match(html, new RegExp(`${readMinutes(src)} min read`));
  });
}
