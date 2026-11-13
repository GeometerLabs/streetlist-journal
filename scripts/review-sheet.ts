// `npm run review-sheet`: writes docs/strings-review.md, the sheet a native speaker uses to review the Journal's interface words:
// every string of src/i18n/en.ts beside its Hindi, Malayalam and Kannada versions (functions shown with sample values), each marked
// "waiting for review" until that language's reviewedBy is filled in its strings file. tests/content.test.ts checks the sheet is
// current, so a changed string is never missed. The six pieces are not in it: they are English, and a piece is translated and
// reviewed through Pages CMS (content/pieces/<lang>).
import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { LANG_INFO, LANGS, STRINGS } from "../src/i18n/index.ts";
import { loadContent } from "../src/content.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Every string in a strings object, by dotted key; functions are called with sample values so the reviewer sees a whole phrase. */
function flatten(value: unknown, key = "", out = new Map<string, string>()): Map<string, string> {
  if (typeof value === "string") out.set(key, value);
  else if (typeof value === "function") out.set(key, String((value as (...a: unknown[]) => unknown)(sample(key), "curious")));
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) flatten(v, key ? `${key}.${k}` : k, out);
  return out;
}
function sample(key: string): string | number {
  if (/minRead|count/.test(key)) return 5;
  if (/updated/.test(key)) return "9 Nov 2026";
  if (/by$/.test(key)) return "Geometer";
  if (/contact/.test(key)) return "hello@geometer.dev";
  if (/reviewedBy/.test(key)) return "A. Reviewer";
  return "Livelihoods";
}
const cell = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");

export function reviewSheet(): string {
  const { taxonomy } = loadContent(root);
  const en = flatten(STRINGS.en);
  // English label and topic names live in the taxonomy; show them as the English column for those keys.
  for (const l of taxonomy.labels) { en.set(`labels.${l.id}.name`, l.name); en.set(`labels.${l.id}.gloss`, l.gloss); }
  for (const t of taxonomy.topics) { en.set(`topics.${t.id}.name`, t.name); en.set(`topics.${t.id}.gloss`, t.gloss); }
  en.delete("reviewedBy");
  const others = LANGS.filter((l) => l !== "en");
  const flat = Object.fromEntries(others.map((l) => [l, flatten(STRINGS[l])]));
  const status = others.map((l) => `- **${LANG_INFO[l].name}** (src/i18n/${l}.ts): ${STRINGS[l].reviewedBy ? `reviewed by ${STRINGS[l].reviewedBy}` : "waiting for review"}`).join("\n");
  const rows = [...en.keys()].map((key) => `| \`${key}\` | ${cell(en.get(key)!)} | ${others.map((l) => cell(flat[l].get(key) ?? "(missing)")).join(" | ")} |`);
  return `# Interface words: review sheet

Written by \`npm run review-sheet\` from \`src/i18n/*.ts\`; do not edit by hand (tests/content.test.ts checks it is current). For a
native speaker of each language: read every line of your column beside the English, and send corrections to hello@geometer.dev or
edit the strings file directly. When a language is done, put the reviewer's name in its \`reviewedBy\` (the first line of the
strings object). Until then that language's pages are built and reachable from the language switch, but carry \`noindex\` and stay
out of the sitemap.

Notes for reviewers: brand names (Streetlist, Geometer, DiceBear, RSS, AI) stay in Latin letters; the words should be plain and
warm, as a shopkeeper or a farmer would say them; see docs/editorial.md for the words we never use. Phrases with a number or a name
are shown with a sample (5, "Livelihoods", "Geometer").

${status}

| Key | English | ${others.map((l) => LANG_INFO[l].name).join(" | ")} |
| --- | --- | ${others.map(() => "---").join(" | ")} |
${rows.join("\n")}
`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  writeFileSync(join(root, "docs/strings-review.md"), reviewSheet());
  console.log("review-sheet: wrote docs/strings-review.md");
}
