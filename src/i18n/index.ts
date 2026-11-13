// The Journal's four languages and the addresses each one uses. English lives at the root (/, /about, /<slug>); Hindi, Malayalam and
// Kannada under their own prefix (/hi/, /hi/topics/livelihoods, /hi/<slug> once a reviewed Hindi version of that piece exists).
// Every page links to its versions in the other languages with hreflang, and only to versions that exist.
// Used by the page renderers, the feeds and the sitemap at build time.
import { en, type Strings } from "./en.ts";
import { hi } from "./hi.ts";
import { kn } from "./kn.ts";
import { ml } from "./ml.ts";

export const LANGS = ["en", "hi", "ml", "kn"] as const;
export type Lang = (typeof LANGS)[number];

export interface LangInfo {
  /** The language's own name, as the switch shows it. */
  name: string;
  /** The short code shown on the switch's button. */
  short: string;
  /** For dates (Intl): India's English, Hindi, Malayalam and Kannada. Digits stay Latin in all four. */
  locale: string;
  /** The address prefix: "" for English, "/hi" and so on. */
  prefix: string;
}

export const LANG_INFO: Record<Lang, LangInfo> = {
  en: { name: "English", short: "EN", locale: "en-IN", prefix: "" },
  hi: { name: "हिन्दी", short: "हि", locale: "hi-IN", prefix: "/hi" },
  ml: { name: "മലയാളം", short: "മ", locale: "ml-IN", prefix: "/ml" },
  kn: { name: "ಕನ್ನಡ", short: "ಕ", locale: "kn-IN", prefix: "/kn" },
};

export const STRINGS: Record<Lang, Strings> = { en, hi, ml, kn };

/** A language's interface words have been read by a native speaker (English is the original). Unreviewed ones are not indexed. */
export const interfaceReviewed = (lang: Lang): boolean => STRINGS[lang].reviewedBy.trim() !== "";

/** The addresses of the Journal's pages, in one place so links, canonicals, hreflang, feeds and the sitemap always agree. */
export const url = {
  home: (lang: Lang) => `${LANG_INFO[lang].prefix}/`,
  piece: (lang: Lang, slug: string) => `${LANG_INFO[lang].prefix}/${slug}`,
  topic: (lang: Lang, id: string) => `${LANG_INFO[lang].prefix}/topics/${id}`,
  label: (lang: Lang, id: string) => `${LANG_INFO[lang].prefix}/labels/${id}`,
  /** The About page is English only until its translations are reviewed (docs/review.md). */
  about: () => "/about",
};

/** The file a page address is written to: /x -> x.html, /hi/ -> hi/index.html. GitHub Pages serves /x from x.html. */
export function fileOf(path: string): string {
  if (path.endsWith("/")) return `${path.slice(1)}index.html`;
  return `${path.slice(1)}.html`;
}

/** "2026-11-09" as the language shows a date: "9 Nov 2026" in English. The same on every machine (Node has full ICU). */
export function formatDate(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(LANG_INFO[lang].locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC", numberingSystem: "latn" })
    .format(new Date(Date.UTC(y, m - 1, d)));
}
