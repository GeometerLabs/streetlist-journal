// The Journal's machine-readable files, written at build time:
//  - /feed.xml (RSS 2.0) and /feed.json (JSON Feed 1.1): every published English piece, newest first. streetlist.in and
//    geometer.dev read feed.json at their own build and show the first three, so each item carries what a card needs (absolute
//    addresses, the 1200 px picture with its alt text and size, the section and label, the read time, the companion's face) under
//    "_streetlist_journal" (JSON Feed's place for extensions).
//  - /sitemap.xml: every indexable page with its language versions (hreflang), and /robots.txt pointing at it. Pages in a language
//    whose interface words wait for review, and the 404, are left out.
// With no published piece both feeds are valid and empty (no lastBuildDate in the RSS, which would need a made-up date).
// Dates are written from the content (no build clock), so the files only change when the content does.
import { interfaceReviewed, LANGS, STRINGS, url, type Lang } from "./i18n/index.ts";
import { readMinutes, type Piece } from "./content.ts";
import { esc, labelOf, pictureAlt, SITE, topicOf, type Ctx } from "./pages/layout.ts";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2026-11-09" as RSS wants it, at the start of the day in India: "Mon, 09 Nov 2026 00:00:00 +0530". */
function rfc822(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const day = DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${day}, ${String(d).padStart(2, "0")} ${MONTHS[m - 1]} ${y} 00:00:00 +0530`;
}
const isoIst = (iso: string) => `${iso}T00:00:00+05:30`;
const abs = (path: string) => (path.startsWith("http") ? path : `${SITE}${path}`);

function newest(pieces: Piece[]): string {
  return pieces.reduce((latest, p) => (p.updated > latest ? p.updated : latest), "1970-01-01");
}

export function rssFeed(ctx: Ctx): string {
  const pieces = ctx.content.pieces.en;
  const s = STRINGS.en;
  const items = pieces.map((p) => {
    const pic = ctx.pictures.get(p.slug)!;
    const bytes = ctx.images.written.get(pic.share) ?? 0;
    const type = pic.share.endsWith(".svg") ? "image/svg+xml" : "image/jpeg";
    return `<item>
<title>${esc(p.title)}</title>
<link>${SITE}${url.piece("en", p.slug)}</link>
<guid isPermaLink="true">${SITE}${url.piece("en", p.slug)}</guid>
<pubDate>${rfc822(p.published)}</pubDate>
<dc:creator>${esc(p.author)}</dc:creator>
<description>${esc(p.summary)}</description>
<category>${esc(topicOf(ctx, p.topic).name)}</category>
<category>${esc(labelOf(ctx, p.label).name)}</category>
<enclosure url="${abs(pic.share)}" length="${bytes}" type="${type}"/>
</item>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
<title>Streetlist Journal</title>
<link>${SITE}/</link>
<description>${esc(s.site.sub)}</description>
<language>en-IN</language>
${pieces.length ? `<lastBuildDate>${rfc822(newest(pieces))}</lastBuildDate>\n` : ""}
<atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
</channel>
</rss>
`;
}

export function jsonFeed(ctx: Ctx): string {
  const s = STRINGS.en;
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "Streetlist Journal",
    home_page_url: `${SITE}/`,
    feed_url: `${SITE}/feed.json`,
    description: `${s.site.tagline} ${s.site.sub}`,
    language: "en-IN",
    favicon: `${SITE}/favicon.svg`,
    authors: [{ name: "Geometer", url: "https://geometer.dev/" }],
    items: ctx.content.pieces.en.map((p) => {
      const pic = ctx.pictures.get(p.slug)!;
      const topic = topicOf(ctx, p.topic);
      const label = labelOf(ctx, p.label);
      return {
        id: `${SITE}${url.piece("en", p.slug)}`,
        url: `${SITE}${url.piece("en", p.slug)}`,
        title: p.title,
        summary: p.summary,
        content_text: p.summary,
        image: abs(pic.share),
        date_published: isoIst(p.published),
        date_modified: isoIst(p.updated),
        authors: [{ name: p.author }],
        tags: [topic.name, label.name],
        language: "en-IN",
        _streetlist_journal: {
          about: "What a card on streetlist.in or geometer.dev needs. Pictures are 3:2.",
          topic: { id: topic.id, name: topic.name, url: `${SITE}${url.topic("en", topic.id)}` },
          label: { id: label.id, name: label.name, gloss: label.gloss },
          read_minutes: readMinutes(p),
          featured: Boolean(p.featured),
          image: { url: abs(pic.share), svg: pic.kind === "cover" ? abs(pic.src) : undefined, alt: pictureAlt(ctx, p, "en"), width: 1200, height: 800, credit: p.image?.credit ?? s.piece.coverCredit, credit_url: p.image?.creditUrl },
          companion: { face: abs(ctx.images.face(p.companion.look, p.companion.mood)), mood: p.companion.mood },
          translations: Object.fromEntries(p.langs.filter((l) => l !== "en").map((l) => [l, `${SITE}${url.piece(l, p.slug)}`])),
        },
      };
    }),
  };
  return `${JSON.stringify(feed, null, 1)}\n`;
}

/** Every indexable page, grouped with its language versions: [path, lastmod?, alternates]. */
export function sitemap(entries: { path: string; lastmod?: string; alternates: Partial<Record<Lang, string>> }[]): string {
  const indexable = (path: string): boolean => {
    const lang = LANGS.find((l) => l !== "en" && path.startsWith(`/${l}/`)) ?? "en";
    return interfaceReviewed(lang);
  };
  const urls = entries.filter((e) => indexable(e.path)).map((e) => {
    const alts = Object.entries(e.alternates).filter(([, href]) => indexable(href!))
      .map(([l, href]) => `<xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${href}"/>`).join("");
    return `<url><loc>${SITE}${e.path}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}${alts}</url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
}

export const robots = () => `# The Streetlist Journal welcomes every reader and every search engine. The sitemap lists the pages to index.
User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;
