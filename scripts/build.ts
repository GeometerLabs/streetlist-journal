// Step two of `npm run build` (after `vite build` has bundled the stylesheet, the fonts and the theme script into dist/assets):
// reads the content, makes every picture (src/images.ts), writes every page in every language, the feeds, the sitemap and
// robots.txt into dist/, and prints what it wrote with the sizes. GitHub Pages serves /x from x.html and /hi/ from hi/index.html.
//
// Pages written: per language, the front page, the five section pages and a page per label in use; each published piece in each
// language it is published in; the About page (English); and one 404.html for all. Translations waiting for a reviewer are
// listed at the end, so the owner can see what is not yet live.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { loadContent } from "../src/content.ts";
import { fileOf, LANGS, url, type Lang } from "../src/i18n/index.ts";
import { Images, type Picture } from "../src/images.ts";
import { jsonFeed, robots, rssFeed, sitemap } from "../src/feeds.ts";
import { aboutPage, notFoundPage } from "../src/pages/about.ts";
import { homePage } from "../src/pages/home.ts";
import { labelPage, topicPage } from "../src/pages/lists.ts";
import { piecePage } from "../src/pages/piece.ts";
import type { Ctx } from "../src/pages/layout.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

/** The hashed stylesheet and theme script from Vite's manifest, and the Latin Baloo 2 file to preload on English pages. */
function assets(): Pick<Ctx, "css" | "themeJs" | "fontPreload"> {
  const manifest = JSON.parse(readFileSync(join(dist, ".vite/manifest.json"), "utf8")) as Record<string, { file: string }>;
  const css = manifest["src/styles/site.css"]?.file;
  const themeJs = manifest["src/client/theme.ts"]?.file;
  if (!css || !themeJs) throw new Error("Vite's manifest has no site.css or theme.ts entry: run vite build first.");
  const font = readdirSync(join(dist, "assets")).find((f) => /^baloo-2-latin-wght-normal-.*\.woff2$/.test(f));
  return { css: `/${css}`, themeJs: `/${themeJs}`, fontPreload: font ? `/assets/${font}` : "" };
}

/** Every page the Journal has, as [address, html, lastmod, alternates] (the sitemap needs the last two). */
export function pages(ctx: Ctx): { path: string; html: string; lastmod?: string; alternates: Partial<Record<Lang, string>>; index: boolean }[] {
  const out: ReturnType<typeof pages> = [];
  const { taxonomy, pieces } = ctx.content;
  const all = (make: (l: Lang) => string) => Object.fromEntries(LANGS.map((l) => [l, make(l)]));
  const labelsInUse = taxonomy.labels.filter((l) => pieces.en.some((p) => p.label === l.id));
  for (const lang of LANGS) {
    out.push({ path: url.home(lang), html: homePage(ctx, lang), alternates: all(url.home), index: true });
    for (const topic of taxonomy.topics) out.push({ path: url.topic(lang, topic.id), html: topicPage(ctx, topic, lang), alternates: all((l) => url.topic(l, topic.id)), index: true });
    for (const label of labelsInUse) out.push({ path: url.label(lang, label.id), html: labelPage(ctx, label, lang), alternates: all((l) => url.label(l, label.id)), index: true });
    for (const piece of pieces[lang]) {
      out.push({
        path: url.piece(lang, piece.slug),
        html: piecePage(ctx, piece),
        lastmod: piece.updated,
        alternates: Object.fromEntries(piece.langs.map((l) => [l, url.piece(l, piece.slug)])),
        index: true,
      });
    }
  }
  out.push({ path: url.about(), html: aboutPage(ctx), alternates: { en: url.about() }, index: true });
  out.push({ path: "/404", html: notFoundPage(ctx), alternates: {}, index: false });
  return out;
}

/** Every piece's lead picture: the photo when it has one, otherwise its cover. */
export async function makePictures(images: Images, content: ReturnType<typeof loadContent>): Promise<Map<string, Picture>> {
  const pictures = new Map<string, Picture>();
  for (const piece of content.pieces.en) {
    const mascot = content.taxonomy.topics.find((t) => t.id === piece.topic)!.mascot;
    pictures.set(piece.slug, piece.image ? await images.photo(piece.image.src) : await images.cover(piece.slug, piece.topic, piece.companion, mascot));
  }
  return pictures;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const content = loadContent(root);
  const images = new Images(root, dist);
  const pictures = await makePictures(images, content);
  const ctx: Ctx = { ...assets(), content, images, pictures };
  const list = pages(ctx);
  for (const p of list) {
    const file = join(dist, fileOf(p.path));
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, p.html);
  }
  writeFileSync(join(dist, "feed.xml"), rssFeed(ctx));
  writeFileSync(join(dist, "feed.json"), jsonFeed(ctx));
  writeFileSync(join(dist, "sitemap.xml"), sitemap(list.filter((p) => p.index)));
  writeFileSync(join(dist, "robots.txt"), robots());

  // What was written, and how heavy: the HTML of every page gzipped (what GitHub Pages sends), and every picture.
  const kb = (n: number) => `${(n / 1024).toFixed(1)} KB`;
  const htmlGz = list.map((p) => gzipSync(p.html).length);
  const imageBytes = [...images.written.values()].reduce((a, b) => a + b, 0);
  const cssFile = join(dist, ctx.css);
  console.log(`build: ${list.length} pages (${LANGS.map((l) => `${l} ${list.filter((p) => (l === "en" ? !/^\/(hi|ml|kn)\//.test(p.path) : p.path.startsWith(`/${l}/`))).length}`).join(", ")}), `
    + `${content.pieces.en.length} pieces, ${images.written.size} picture files (${kb(imageBytes)}).`);
  console.log(`build: HTML ${kb(Math.min(...htmlGz))} to ${kb(Math.max(...htmlGz))} gzipped per page; stylesheet ${kb(gzipSync(readFileSync(cssFile)).length)} gzipped.`);
  if (existsSync(join(dist, "CNAME"))) console.log(`build: CNAME ${readFileSync(join(dist, "CNAME"), "utf8").trim()} (${statSync(join(dist, "CNAME")).size} bytes).`);
  for (const d of content.drafts) console.log(`build: not published yet: ${d}`);
}
