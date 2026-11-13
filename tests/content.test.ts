// The content checks (`npm test`; the word checks read dist/, so build first):
//  - the wording rules: no banned word in any interface string in any language, in the About page, or anywhere a reader can read on
//    the built site, except the words of the six moved pieces, which keep every word (two use "against" in its plain sense and one
//    discusses tokens; they are listed here exactly); only hello@geometer.dev as an address; no artist's name anywhere in the
//    repository (docs/editorial.md: we describe qualities, never imitate a named artist);
//  - the Pages CMS form matches the code: label and section choices equal content/taxonomy.json, face and mood choices equal the
//    cast, the address pattern reserves exactly the site's own names, the translation collections exist with "Reviewed by", and
//    every key stored in a content file has a field in the form;
//  - the translation rule: a translation without a reviewer is not published (no page, no hreflang, no feed entry), one with a
//    reviewer is, using fixtures in a temporary folder;
//  - every language has every string, label and section; every section has its colours; the review sheet is current.
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { CAST, MOODS } from "../src/characters/cast.ts";
import { loadContent, RESERVED } from "../src/content.ts";
import { about } from "../src/i18n/about.ts";
import { LANGS, STRINGS } from "../src/i18n/index.ts";
import { reviewSheet } from "../scripts/review-sheet.ts";
import { pages } from "../scripts/build.ts";
import { jsonFeed } from "../src/feeds.ts";
import type { Ctx } from "../src/pages/layout.ts";
import type { Picture } from "../src/images.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const content = loadContent(root);

/** Words never used in anything the Journal writes (owner's rules), as whole words; "100%" as written. */
const BANNED = [
  /\bsafe(ly|ty)?\b/i, /\bguarantee(d|s)?\b/i, /\bproves?\b/i, /\bcertified\b/i, /100\s?%/, /\bearn(s|ed|ing|ings)?\b/i, /\bincome\b/i,
  /\bside hustle\b/i, /\bpassive\b/i, /\blimited seats\b/i, /\bjoin now\b/i, /\bwork from home\b/i, /\bfounders?\b/i, /\bfounding\b/i,
  /\bbots?\b/i, /\bleaderboards?\b/i, /\bstreaks?\b/i, /\bcommunal\b/i, /\brevolution\w*/i, /\bfight\w*/i, /\bagainst\b/i, /\bdisrupt\w*/i,
  /\btokens?\b/i, /\bcrypto\w*/i, /\bblockchains?\b/i, /\bDAOs?\b/,
];
/** The same ideas in Hindi, Malayalam and Kannada (substrings: these scripts have no word boundaries for \b). */
const BANNED_INDIC = ["कमाई", "कमाना", "कमाएँ", "आमदनी", "गारंटी", "सुरक्षित", "क्रांति", "खिलाफ", "ख़िलाफ़",
  "വരുമാനം", "സമ്പാദ്യ", "ഗ്യാരന്റി", "സുരക്ഷിത", "വിപ്ലവ", "പോരാട്ട", "എതിരെ",
  "ಆದಾಯ", "ಗಳಿಕೆ", "ದುಡಿಮೆ", "ಗ್ಯಾರಂಟಿ", "ಸುರಕ್ಷಿತ", "ಕ್ರಾಂತಿ", "ಹೋರಾಟ", "ವಿರುದ್ಧ"];
/** The moved pieces keep every word: these exact sentences are the only places a banned word may appear on the site. */
const KEPT_SENTENCES = [
  "Those limits were checked against the repository for this piece; they are not evidence of a live group service.",
  "A local operator recognises the ambiguity, asks which pack the shop means and checks the answer against the supplier’s catalogue.",
  "Holding a token would say little without an agreement explaining its rights.",
];

/** Every string in a value: functions are called with sample arguments so the words they make are checked too. */
function allStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (typeof value === "function") out.push(String((value as (...a: unknown[]) => unknown)("Livelihoods", "curious")), String((value as (...a: unknown[]) => unknown)(5)));
  else if (Array.isArray(value)) value.forEach((v) => allStrings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => allStrings(v, out));
  return out;
}
const banned = (text: string): string[] => [...BANNED.filter((re) => re.test(text)).map(String), ...BANNED_INDIC.filter((w) => text.includes(w))];

/** What a reader can read on a page: text, plus alt, title, aria-label and meta content. */
function visibleText(html: string): string {
  const attrs = [...html.matchAll(/\s(?:alt|title|aria-label|content)="([^"]*)"/g)].map((m) => m[1]);
  const text = html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ");
  return `${text} ${attrs.join(" ")}`.replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}
function htmlFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) htmlFiles(full, out);
    else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

test("no banned word in any interface string in any language, or in the About page", () => {
  for (const lang of LANGS) {
    for (const text of allStrings(STRINGS[lang])) assert.deepEqual(banned(text), [], `${lang}: ${text}`);
  }
  for (const text of allStrings(about)) assert.deepEqual(banned(text), [], text);
  for (const text of allStrings(content.taxonomy)) assert.deepEqual(banned(text), [], text);
});

test("no banned word anywhere a reader can read on the built site, beyond the moved pieces' own sentences", { skip: !existsSync(dist) && "run npm run build first" }, () => {
  for (const file of htmlFiles(dist)) {
    let text = visibleText(readFileSync(file, "utf8"));
    for (const kept of KEPT_SENTENCES) text = text.split(kept).join(" ");
    assert.deepEqual(banned(text), [], file.replace(dist, ""));
    const addresses = [...text.matchAll(/[\w.+-]+@[\w-]+\.[\w.]+/g)].map((m) => m[0]);
    for (const a of addresses) assert.equal(a, "hello@geometer.dev", `${file.replace(dist, "")}: ${a}`);
  }
  // The kept sentences really are in the moved pieces (so this list cannot hide a new use).
  const words = JSON.stringify(content.pieces.en);
  for (const kept of KEPT_SENTENCES) assert.ok(words.includes(kept), kept);
});

test("no artist's name anywhere in the repository", () => {
  // Built from parts so this file does not contain the name it looks for.
  const name = ["Mir", "anda"].join("");
  const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { cwd: root, encoding: "utf8" }).split("\n").filter(Boolean);
  for (const file of files) {
    if (/\.(jpg|jpeg|png|webp|avif|woff2)$/.test(file) || !existsSync(join(root, file))) continue;
    assert.ok(!readFileSync(join(root, file), "utf8").includes(name), `${file} names an artist`);
  }
});

// ---------- Pages CMS ----------
interface Field { name: string; type?: string; component?: string; fields?: Field[]; options?: { values?: { name: string }[] }; pattern?: { regex: string } | string }
const cms = parse(readFileSync(join(root, ".pages.yml"), "utf8"), { merge: true }) as {
  media: { input: string; output: string };
  components: Record<string, Field>;
  content: { name: string; type: string; path?: string; items?: { name: string; path: string; fields: Field[]; filename: unknown }[]; fields?: Field[] }[];
};
const collections = cms.content.find((c) => c.name === "pieces")!.items!;
const english = collections.find((c) => c.name === "pieces-en")!;
const field = (fields: Field[], name: string): Field => {
  const f = fields.find((x) => x.name === name)!;
  return f?.component ? { ...cms.components[f.component], ...f } : f;
};
const values = (f: Field) => f.options!.values!.map((v) => v.name);

test("the Pages CMS choices match the taxonomy and the cast", () => {
  assert.deepEqual(values(field(english.fields, "label")), content.taxonomy.labels.map((l) => l.id));
  assert.deepEqual(values(field(english.fields, "topic")), content.taxonomy.topics.map((t) => t.id));
  const companion = field(english.fields, "companion");
  assert.deepEqual(values(field(companion.fields!, "look")), Object.keys(CAST));
  assert.deepEqual(values(field(companion.fields!, "mood")), [...MOODS]);
});

test("the Pages CMS address pattern reserves exactly the site's own names, and accepts the six slugs", () => {
  const slug = field(english.fields, "slug");
  const regex = new RegExp(typeof slug.pattern === "string" ? slug.pattern : slug.pattern!.regex);
  const reserved = regex.source.match(/\(\?:([a-z0-9|]+)\)/)![1].split("|");
  assert.deepEqual([...reserved].sort(), [...RESERVED].sort());
  for (const name of RESERVED) assert.ok(!regex.test(name), `${name} is accepted`);
  for (const p of content.pieces.en) assert.ok(regex.test(p.slug), p.slug);
  assert.ok(!regex.test("Not A Slug"));
});

test("Pages CMS has the four piece collections, the translations need 'Reviewed by', and media goes to content/media", () => {
  assert.deepEqual(collections.map((c) => c.path), LANGS.map((l) => `content/pieces/${l}`));
  for (const c of collections.slice(1)) {
    assert.ok(field(c.fields, "reviewedBy"), `${c.name}: reviewedBy`);
    assert.equal(field(c.fields, "slug").type, "reference");
  }
  assert.equal(cms.media.input, "content/media");
  assert.equal(cms.media.output, "/media");
  assert.ok(existsSync(join(root, cms.media.input)));
});

test("every key stored in a piece file has a field in the Pages CMS form", () => {
  const check = (data: unknown, fields: Field[], where: string) => {
    if (!data || typeof data !== "object") return;
    for (const [key, value] of Object.entries(data)) {
      const f = field(fields, key);
      assert.ok(f, `${where}.${key} has no field in .pages.yml`);
      if (f.fields) for (const item of Array.isArray(value) ? value : [value]) check(item, f.fields, `${where}.${key}`);
    }
  };
  for (const name of readdirSync(join(root, "content/pieces/en"))) {
    check(JSON.parse(readFileSync(join(root, "content/pieces/en", name), "utf8")), english.fields, name);
  }
});

// ---------- Translations ----------
/** A copy of the content with one Hindi translation, reviewed or not, read the way the build reads it. */
function withTranslation(reviewedBy: string) {
  const dir = mkdtempSync(join(tmpdir(), "journal-test-"));
  cpSync(join(root, "content"), join(dir, "content"), { recursive: true });
  const base = content.pieces.en.find((p) => p.slug === "village-tractor-bookings")!;
  writeFileSync(join(dir, "content/pieces/hi/village-tractor-bookings.json"), JSON.stringify({
    slug: base.slug, reviewedBy, title: "गाँव के ट्रैक्टर की बुकिंग (परीक्षण)", summary: "परीक्षण के लिए एक नमूना अनुवाद, जो प्रकाशित नहीं होता।",
    sections: base.sections.map((s) => ({ heading: `${s.heading} (हि)`, paragraphs: ["नमूना अनुच्छेद।"] })),
  }));
  try {
    const loaded = loadContent(dir);
    const ctx = stubCtx(loaded);
    return { loaded, built: pages(ctx), feed: JSON.parse(jsonFeed(ctx)) };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** A build context without pictures on disk: every piece gets the same stand-in cover, every face the same file. */
function stubCtx(loaded: ReturnType<typeof loadContent>): Ctx {
  const picture: Picture = { kind: "cover", width: 1200, height: 800, srcset: {}, src: "/img/x.svg", share: "/img/x.jpg" };
  return {
    css: "/assets/site.css", themeJs: "/assets/theme.js", fontPreload: "", content: loaded,
    images: { face: (look: string, mood: string) => `/img/faces/${look}-${mood}.svg`, written: new Map() } as unknown as Ctx["images"],
    pictures: new Map(loaded.pieces.en.map((p) => [p.slug, picture])), banners: new Map(),
  };
}

test("a piece saved by a form (empty optional groups, empty strings and lists, false flags) renders exactly the same pages", () => {
  const dir = mkdtempSync(join(tmpdir(), "journal-form-"));
  cpSync(join(root, "content"), join(dir, "content"), { recursive: true });
  try {
    const en = join(dir, "content/pieces/en");
    for (const name of readdirSync(en)) {
      const p = JSON.parse(readFileSync(join(en, name), "utf8"));
      // What a form editor might write for the fields the writer never touched.
      p.featured ??= false;
      p.draft = false;
      p.image = p.image ? { creditUrl: "", ...p.image } : { src: "", alt: "", credit: "", creditUrl: "" };
      p.example = p.example
        ? { ...p.example, lines: p.example.lines.map((l: { name?: string }) => ({ name: "", ...l })) }
        : { title: "", caption: "", lines: [] };
      p.ending = p.ending ? { code: "", ...p.ending } : { kind: "", title: "", text: "", code: "", href: "", linkText: "" };
      p.sections = p.sections.map((s: object) => ({ paragraphs: [], items: [], after: [], ...s }));
      p.elsewhere ??= [];
      p.corrections ??= [];
      writeFileSync(join(en, name), JSON.stringify(p));
    }
    const before = pages(stubCtx(loadContent(root)));
    const after = pages(stubCtx(loadContent(dir)));
    assert.deepEqual(after.map((x) => x.path), before.map((x) => x.path));
    for (const [i, page] of before.entries()) assert.equal(after[i].html, page.html, page.path);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("a translation without a reviewer is a draft: no page, no hreflang, no feed entry", () => {
  const { loaded, built, feed } = withTranslation("");
  assert.equal(loaded.pieces.hi.length, 0);
  assert.ok(loaded.drafts.some((d) => d.includes("hi/village-tractor-bookings")));
  assert.ok(!built.some((p) => p.path === "/hi/village-tractor-bookings"));
  const en = built.find((p) => p.path === "/village-tractor-bookings")!;
  assert.doesNotMatch(en.html, /hreflang="hi" href="https:\/\/journal\.streetlist\.in\/hi\/village/);
  assert.deepEqual(feed.items.find((i: { url: string }) => i.url.endsWith("/village-tractor-bookings"))._streetlist_journal.translations, {});
});

test("a reviewed translation is published at /hi/<slug>, linked both ways, and names its reviewer", () => {
  const { built, feed } = withTranslation("A. Reviewer");
  const hi = built.find((p) => p.path === "/hi/village-tractor-bookings");
  assert.ok(hi, "the Hindi page is built");
  assert.match(hi!.html, /<html lang="hi">/);
  assert.match(hi!.html, /अनुवाद की समीक्षा: A\. Reviewer/);
  assert.match(hi!.html, /hreflang="en" href="https:\/\/journal\.streetlist\.in\/village-tractor-bookings"/);
  const en = built.find((p) => p.path === "/village-tractor-bookings")!;
  assert.match(en.html, /hreflang="hi" href="https:\/\/journal\.streetlist\.in\/hi\/village-tractor-bookings"/);
  assert.equal(feed.items.find((i: { url: string }) => i.url.endsWith("/village-tractor-bookings"))._streetlist_journal.translations.hi,
    "https://journal.streetlist.in/hi/village-tractor-bookings");
});

// ---------- Languages, colours, the review sheet ----------
test("every language has every interface string, label and section", () => {
  const keys = (v: unknown, k = ""): string[] => (v && typeof v === "object" ? Object.entries(v).flatMap(([x, y]) => keys(y, k ? `${k}.${x}` : x)) : [k]);
  const en = keys({ ...STRINGS.en, labels: {}, topics: {} }).sort();
  for (const lang of LANGS.filter((l) => l !== "en")) {
    assert.deepEqual(keys({ ...STRINGS[lang], labels: {}, topics: {} }).sort(), en, lang);
    for (const l of content.taxonomy.labels) assert.ok(STRINGS[lang].labels[l.id]?.name && STRINGS[lang].labels[l.id]?.gloss, `${lang}: label ${l.id}`);
    for (const t of content.taxonomy.topics) assert.ok(STRINGS[lang].topics[t.id]?.name && STRINGS[lang].topics[t.id]?.gloss, `${lang}: section ${t.id}`);
  }
});

test("every section has its colours in the stylesheet and on its cover", async () => {
  const css = readFileSync(join(root, "src/styles/site.css"), "utf8");
  const { COVER_COLOURS } = await import("../src/images.ts");
  for (const t of content.taxonomy.topics) {
    assert.match(css, new RegExp(`\\.t-${t.id} \\{ --tc: var\\(--${t.id}\\)`), `site.css: .t-${t.id}`);
    assert.match(css, new RegExp(`--${t.id}-tint:[^;]+;`), `site.css: --${t.id}-tint`);
    assert.ok(COVER_COLOURS[t.id], `cover colours for ${t.id}`);
  }
});

test("docs/strings-review.md is current (npm run review-sheet)", () => {
  assert.equal(readFileSync(join(root, "docs/strings-review.md"), "utf8"), reviewSheet());
});
