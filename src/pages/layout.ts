// The shell every Journal page shares: <head> (title, description, canonical, hreflang links to the versions that exist, link
// previews, the content security policy), the header (the Streetlist Journal wordmark, a link to streetlist.in, the language switch
// and the light/dark switch), and the footer (About, the feed, Runs on Geometer, DiceBear's credit, the one public address).
// Also the small helpers every page renderer uses: escaping, pictures, faces, stamps and bylines. Used by src/pages/*.ts.
//
// GitHub Pages cannot send headers, so the content security policy is a <meta> tag: scripts, styles, fonts and pictures from the
// site only, nothing inline (there is no inline script or style anywhere), no frames, no forms.
import type { Mood } from "../characters/cast.ts";
import { formatDate, interfaceReviewed, LANG_INFO, LANGS, STRINGS, url, type Lang } from "../i18n/index.ts";
import { CONTACT } from "../i18n/en.ts";
import type { Content, Label, Piece, Topic } from "../content.ts";
import { readMinutes } from "../content.ts";
import type { Images, Picture } from "../images.ts";

export const SITE = "https://journal.streetlist.in";
export const STREETLIST = "https://streetlist.in";
export const GEOMETER = "https://geometer.dev";

/** What the build hands every page renderer. */
export interface Ctx {
  css: string;
  themeJs: string;
  /** The Latin Baloo 2 file, preloaded so English headings paint in Baloo without a swap. */
  fontPreload: string;
  content: Content;
  images: Images;
  /** Each English piece's lead picture or cover, by slug. */
  pictures: Map<string, Picture>;
}

/** Escapes text for HTML text and attribute values. Every word from content or strings goes through it. */
export function esc(s: string | number): string {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** A label's or a topic's name and gloss in a language (English from the taxonomy, others from the strings). */
export function labelIn(label: Label, lang: Lang): { name: string; gloss: string } {
  return lang === "en" ? label : STRINGS[lang].labels[label.id] ?? label;
}
export function topicIn(topic: Topic, lang: Lang): { name: string; gloss: string } {
  return lang === "en" ? topic : STRINGS[lang].topics[topic.id] ?? topic;
}
export const topicOf = (ctx: Ctx, id: string): Topic => ctx.content.taxonomy.topics.find((t) => t.id === id)!;
export const labelOf = (ctx: Ctx, id: string): Label => ctx.content.taxonomy.labels.find((l) => l.id === id)!;

/** ` lang="en"` when a piece's words are in another language than the page (an English piece on a Hindi page). */
export const langAttr = (wordsLang: Lang, pageLang: Lang): string => (wordsLang === pageLang ? "" : ` lang="${wordsLang}"`);

/** A face (a cast member in a mood), always decorative here: the words beside it say what it is about. */
export function faceImg(ctx: Ctx, look: Piece["companion"]["look"], mood: Mood, size: number, cls: string, lazy = true): string {
  return `<img class="${cls}" src="${ctx.images.face(look, mood)}" alt="" width="${size}" height="${size}"${lazy ? ' loading="lazy"' : ""} decoding="async">`;
}

/**
 * A lead picture: a <picture> with AVIF, WebP and JPEG at four widths for a photo, or the SVG cover. Width and height are always
 * set (the page never jumps while it loads); only the first picture on a page loads at once, the rest when scrolled near.
 */
export function pictureHtml(pic: Picture, alt: string, sizes: string, eager: boolean, cls = ""): string {
  const load = eager ? ' fetchpriority="high"' : ' loading="lazy"';
  const img = (src: string, srcset = "") =>
    `<img${cls ? ` class="${cls}"` : ""} src="${src}"${srcset ? ` srcset="${srcset}" sizes="${sizes}"` : ""} alt="${esc(alt)}" width="${pic.width}" height="${pic.height}"${load} decoding="async">`;
  if (pic.kind === "cover") return img(pic.src);
  return `<picture><source type="image/avif" srcset="${pic.srcset.avif}" sizes="${sizes}"><source type="image/webp" srcset="${pic.srcset.webp}" sizes="${sizes}">${img(pic.src, pic.srcset.jpg)}</picture>`;
}

/** The alt text of a piece's lead picture in the page's language: the photo's own, or the cover's description. */
export function pictureAlt(ctx: Ctx, piece: Piece, lang: Lang): string {
  if (piece.image) return piece.image.alt;
  const s = STRINGS[lang];
  return s.piece.coverAlt(topicIn(topicOf(ctx, piece.topic), lang).name, s.moods[piece.companion.mood]);
}

/** The section stamp: a small tile in the section's colour. A link on a piece's page; a plain label inside a card (the card is the link). */
export function stamp(ctx: Ctx, topicId: string, lang: Lang, link: boolean): string {
  const name = esc(topicIn(topicOf(ctx, topicId), lang).name);
  return link ? `<a class="stamp t-${topicId}" href="${url.topic(lang, topicId)}">${name}</a>` : `<span class="stamp t-${topicId}">${name}</span>`;
}
/** The label: a word with its own small mark (shape, not colour alone). */
export function labelTag(ctx: Ctx, labelId: string, lang: Lang, link: boolean): string {
  const l = labelIn(labelOf(ctx, labelId), lang);
  return link
    ? `<a class="lbl l-${labelId}" href="${url.label(lang, labelId)}">${esc(l.name)}</a>`
    : `<span class="lbl l-${labelId}">${esc(l.name)}</span>`;
}

/** "9 Nov 2026 · 5 min read", with the updated date when it differs. */
export function meta(piece: Piece, lang: Lang, withAuthor: boolean): string {
  const s = STRINGS[lang].piece;
  const parts = [];
  if (withAuthor) parts.push(esc(s.by(piece.author)));
  parts.push(`<time datetime="${piece.published}">${esc(formatDate(piece.published, lang))}</time>`);
  if (withAuthor && piece.updated !== piece.published) parts.push(`${esc(s.updated(formatDate(piece.updated, lang)))}`);
  parts.push(esc(s.minRead(readMinutes(piece))));
  return parts.join(' <span aria-hidden="true">·</span> ');
}

/** A piece as a card: its picture, stamps, title, summary and date. The title is the one link; the whole card answers to it. */
export function card(ctx: Ctx, piece: Piece, lang: Lang, opts: { summary?: boolean; compact?: boolean } = {}): string {
  const pic = ctx.pictures.get(piece.slug)!;
  const words = langAttr(piece.lang, lang);
  const href = url.piece(piece.lang, piece.slug);
  const sizes = opts.compact ? "112px" : "(max-width: 700px) calc(100vw - 32px), (max-width: 1100px) 46vw, 340px";
  return `<article class="card${opts.compact ? " card-compact" : ""} t-${piece.topic}">`
    + `<div class="card-pic">${pictureHtml(pic, "", sizes, false)}</div>`
    + `<div class="card-body">`
    + `<p class="tags">${stamp(ctx, piece.topic, lang, false)} ${labelTag(ctx, piece.label, lang, false)}</p>`
    + `<h3 class="card-title"${words}><a class="card-link" href="${href}">${esc(piece.title)}</a></h3>`
    + (opts.summary === false ? "" : `<p class="card-sum"${words}>${esc(piece.summary)}</p>`)
    + `<p class="card-meta">${faceImg(ctx, piece.companion.look, piece.companion.mood, 28, "card-face")}<span>${meta(piece, lang, false)}</span></p>`
    + `</div></article>`;
}

/** The awning mark beside the wordmark: Streetlist's striped awning, drawn in the page's colours. Decorative. */
const MARK = `<svg class="mark" viewBox="0 0 34 26" aria-hidden="true" focusable="false"><path d="M3 3h28v9H3z" class="mark-a"/><path d="M10 3h7v9h-7zM24 3h7v9h-7z" class="mark-b"/><path d="M3 12a3.5 3.5 0 0 0 7 0 3.5 3.5 0 0 0 7 0 3.5 3.5 0 0 0 7 0 3.5 3.5 0 0 0 7 0z" class="mark-a"/><rect x="2" y="1" width="30" height="3" rx="1.5" class="mark-c"/><path d="M7 19h20v6H7z" class="mark-c"/></svg>`;

/** The light/dark switch, as on streetlist.in: the moon in the light theme, the sun in the dark one (src/client/theme.ts). */
const themeSwitch = (label: string) =>
  `<button type="button" class="theme-toggle" aria-pressed="false" aria-label="${esc(label)}" title="${esc(label)}">`
  + `<svg class="tt-moon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg>`
  + `<svg class="tt-sun" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg></button>`;

/**
 * The language switch: a disclosure (works without scripts) listing the four languages in their own script. Each links to this
 * page in that language when it exists, otherwise to that language's front page.
 */
function langSwitch(lang: Lang, alternates: Partial<Record<Lang, string>>): string {
  const s = STRINGS[lang].site;
  const items = LANGS.map((l) => {
    const href = alternates[l] ?? url.home(l);
    const current = l === lang ? ' aria-current="true"' : "";
    return `<li><a href="${href}" hreflang="${l}" lang="${l}"${current}>${esc(LANG_INFO[l].name)}</a></li>`;
  }).join("");
  return `<details class="langs"><summary aria-label="${esc(`${s.langLabel}: ${LANG_INFO[lang].name}`)}">`
    + `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3Z"/></svg>`
    + `<span class="langs-code" lang="${lang}">${esc(LANG_INFO[lang].short)}</span></summary><ul>${items}</ul></details>`;
}

export interface PageArgs {
  ctx: Ctx;
  lang: Lang;
  /** The page's own address ("/", "/hi/topics/livelihoods", "/salon-whatsapp-deposits"). */
  path: string;
  title: string;
  description: string;
  body: string;
  /** This page in every language it exists in (its own included), for hreflang and the language switch. */
  alternates: Partial<Record<Lang, string>>;
  bodyClass?: string;
  noindex?: boolean;
  /** A 1200 px JPEG (or the SVG cover) for link previews. */
  shareImage?: string;
  shareType?: "website" | "article";
}

/** One whole HTML document. */
export function page(a: PageArgs): string {
  const s = STRINGS[a.lang];
  const hreflang = Object.entries(a.alternates)
    .map(([l, href]) => `<link rel="alternate" hreflang="${l}" href="${SITE}${href}">`)
    .concat(a.alternates.en ? [`<link rel="alternate" hreflang="x-default" href="${SITE}${a.alternates.en}">`] : [])
    .join("\n");
  // A language whose interface words still wait for a native speaker is built and linked, but not offered to search engines yet.
  const noindex = a.noindex || !interfaceReviewed(a.lang);
  const csp = "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'";
  return `<!doctype html>
<html lang="${a.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${csp}">
<title>${esc(a.title)}</title>
<meta name="description" content="${esc(a.description)}">
${noindex ? '<meta name="robots" content="noindex">\n' : ""}<link rel="canonical" href="${SITE}${a.path}">
${hreflang}
<meta property="og:site_name" content="Streetlist Journal">
<meta property="og:title" content="${esc(a.title)}">
<meta property="og:description" content="${esc(a.description)}">
<meta property="og:type" content="${a.shareType ?? "website"}">
<meta property="og:url" content="${SITE}${a.path}">
${a.shareImage ? `<meta property="og:image" content="${SITE}${a.shareImage}">\n<meta name="twitter:card" content="summary_large_image">\n` : ""}<meta name="color-scheme" content="light">
<meta name="theme-color" content="#f7f8f4">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="alternate" type="application/rss+xml" title="Streetlist Journal" href="/feed.xml">
<link rel="alternate" type="application/feed+json" title="Streetlist Journal" href="/feed.json">
<script src="${a.ctx.themeJs}"></script>
${a.ctx.fontPreload && a.lang === "en" ? `<link rel="preload" href="${a.ctx.fontPreload}" as="font" type="font/woff2" crossorigin>\n` : ""}<link rel="stylesheet" href="${a.ctx.css}">
</head>
<body${a.bodyClass ? ` class="${a.bodyClass}"` : ""}>
<a class="skip" href="#main">${esc(s.site.skip)}</a>
<header class="top">
<a class="brand" href="${url.home(a.lang)}">${MARK}<span class="brand-words"><span class="brand-a">Streetlist</span> <span class="brand-b">Journal</span></span></a>
<a class="to-streetlist" href="${STREETLIST}/" title="${esc(s.site.streetlistTitle)}">streetlist.in</a>
${langSwitch(a.lang, a.alternates)}
${themeSwitch(s.site.themeLabel)}
</header>
<main id="main">
${a.body}
</main>
${footer(a.lang)}
</body>
</html>
`;
}

/** The footer: About, the feed, Streetlist, Runs on Geometer, DiceBear's credit and the one public address. */
function footer(lang: Lang): string {
  const s = STRINGS[lang];
  const f = s.footer;
  const links = [
    [url.about(), f.about, ' hreflang="en"'],
    ["/feed.xml", f.feed, ""],
    [`${STREETLIST}/`, f.streetlist, ""],
  ].map(([href, label, extra]) => `<li><a href="${href}"${extra}>${esc(label)}</a></li>`).join("");
  return `<footer class="foot">
<div class="foot-in">
<div class="foot-brand"><a class="brand" href="${url.home(lang)}">${MARK}<span class="brand-words"><span class="brand-a">Streetlist</span> <span class="brand-b">Journal</span></span></a>
<p>${esc(s.site.tagline)}</p>
<p><a class="runs-on" href="${GEOMETER}/">${esc(s.site.runsOn)}</a></p></div>
<ul class="foot-links">${links}</ul>
<div class="foot-notes">
<p>${esc(f.write)} <a href="mailto:${CONTACT}">${esc(f.contact(CONTACT))}</a></p>
<p>${esc(f.credits)}</p>
</div>
</div>
</footer>`;
}
