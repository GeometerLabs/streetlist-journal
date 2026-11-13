// The build checks (`npm run test:ci`, also part of `npm test`; run after `npm run build`). They read dist/ and check what a reader
// and a search engine get: every page the content calls for was written; each has its language, one h1, a title, a description, a
// canonical address and the content security policy; nothing inline and nothing loaded from another site; every internal link,
// picture and #fragment resolves the way GitHub Pages serves them; hreflang links go both ways; pictures have sizes and only the
// first loads at once; the feeds and the sitemap list what exists; redirects.json points at real pages; and the size budget holds,
// so pages stay light on budget phones. Run in the deploy workflow too, so a broken build never goes live.
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { loadContent } from "../src/content.ts";
import { fileOf, interfaceReviewed, LANGS, url, type Lang } from "../src/i18n/index.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const SITE = "https://journal.streetlist.in";
const content = loadContent(root);

/**
 * The size budget for a budget phone on a slow connection. Pages are sent gzipped by GitHub Pages. A lead picture's phone file is
 * the 800 px AVIF (a phone at device pixel ratio 2 shows a 390 px wide picture). The browser test measures whole page loads.
 */
export const BUDGET = { htmlGz: 24 * 1024, cssGz: 14 * 1024, themeJsGz: 1024, phonePicture: 110 * 1024, cover: 40 * 1024, face: 12 * 1024 };

/** Every HTML file in dist/, by its address. */
function builtPages(): Map<string, string> {
  const out = new Map<string, string>();
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (name.startsWith(".")) continue;
      if (statSync(full).isDirectory()) walk(full);
      else if (name.endsWith(".html")) {
        const rel = relative(dist, full).replace(/\\/g, "/");
        const path = rel === "index.html" ? "/" : rel.endsWith("/index.html") ? `/${rel.slice(0, -10)}` : `/${rel.slice(0, -5)}`;
        out.set(path, readFileSync(full, "utf8"));
      }
    }
  };
  walk(dist);
  return out;
}

/** The file GitHub Pages serves for an internal address, or null: /x -> x or x.html, /x/ -> x/index.html. */
function served(path: string): string | null {
  const clean = decodeURIComponent(path.split(/[?#]/)[0]);
  const candidates = clean.endsWith("/") ? [`${clean}index.html`] : [clean, `${clean}.html`];
  for (const c of candidates) {
    const file = join(dist, c);
    if (file.startsWith(dist) && existsSync(file) && statSync(file).isFile()) return file;
  }
  return null;
}

/** The pages the content calls for, by address. */
function expectedPaths(): string[] {
  const paths: string[] = [];
  const labelsInUse = content.taxonomy.labels.filter((l) => content.pieces.en.some((p) => p.label === l.id));
  for (const lang of LANGS) {
    paths.push(url.home(lang));
    for (const t of content.taxonomy.topics) paths.push(url.topic(lang, t.id));
    for (const l of labelsInUse) paths.push(url.label(lang, l.id));
    for (const p of content.pieces[lang]) paths.push(url.piece(lang, p.slug));
  }
  paths.push(url.about(), "/404");
  return paths;
}

const pagesBuilt = existsSync(dist) ? builtPages() : new Map<string, string>();
const langOfPath = (path: string): Lang => LANGS.find((l) => l !== "en" && path.startsWith(`/${l}/`)) ?? "en";

test("dist/ holds exactly the pages the content calls for", () => {
  assert.ok(existsSync(dist), "dist/ is missing: run npm run build first");
  assert.deepEqual([...pagesBuilt.keys()].sort(), expectedPaths().sort());
  for (const path of expectedPaths()) assert.ok(existsSync(join(dist, fileOf(path))), `${path} is not written to ${fileOf(path)}`);
});

test("every page has its language, one h1, a title, a description, a canonical address and the content security policy", () => {
  for (const [path, html] of pagesBuilt) {
    assert.match(html, /^<!doctype html>/, path);
    assert.match(html, new RegExp(`<html lang="${langOfPath(path)}">`), `${path}: html lang`);
    assert.equal(html.match(/<h1[\s>]/g)?.length, 1, `${path}: exactly one h1`);
    assert.match(html, /<title>[^<]{8,}<\/title>/, path);
    assert.match(html, /<meta name="description" content="[^"]{20,}">/, path);
    assert.ok(html.includes(`<link rel="canonical" href="${SITE}${path}">`), `${path}: canonical`);
    assert.match(html, /<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'">/, path);
    assert.match(html, /<meta name="color-scheme" content="light">/, `${path}: light by default`);
  }
});

test("nothing inline and nothing loaded from another site", () => {
  for (const [path, html] of pagesBuilt) {
    assert.doesNotMatch(html, /<script(?![^>]*\ssrc=)[^>]*>/, `${path}: inline script`);
    assert.doesNotMatch(html, /<style[\s>]/, `${path}: inline style`);
    assert.doesNotMatch(html, /\sstyle="/, `${path}: style attribute`);
    assert.doesNotMatch(html, /\son[a-z]+="/, `${path}: inline event handler`);
    for (const [tag] of html.matchAll(/<(?:script|img|source|link)\b[^>]*>/g)) {
      if (/^<link\b/.test(tag) && /rel="(?:canonical|alternate)"/.test(tag)) continue; // addresses, not loads
      for (const m of tag.matchAll(/\s(?:src|srcset|href)="([^"]+)"/g)) {
        for (const ref of m[1].split(",").map((s) => s.trim().split(/\s+/)[0])) assert.ok(ref.startsWith("/"), `${path} loads ${ref} from elsewhere`);
      }
    }
  }
});

test("every internal link, picture and #fragment resolves the way GitHub Pages serves it", () => {
  for (const [path, html] of pagesBuilt) {
    for (const m of html.matchAll(/\s(?:href|src|srcset)="([^"]+)"/g)) {
      for (const ref of m[1].split(",").map((s) => s.trim().split(/\s+/)[0])) {
        if (!ref.startsWith("/") || ref.startsWith("//")) continue;
        const file = served(ref);
        assert.ok(file, `${path} links to ${ref}, which GitHub Pages would not find`);
        const hash = ref.split("#")[1];
        if (hash && file!.endsWith(".html")) assert.ok(readFileSync(file!, "utf8").includes(`id="${hash}"`), `${path}: ${ref} has no #${hash}`);
      }
      if (m[1].startsWith("#") && m[1].length > 1) assert.ok(html.includes(`id="${m[1].slice(1)}"`), `${path}: #${m[1].slice(1)} is missing`);
    }
  }
});

test("hreflang links go both ways, and the language switch only promises pages that exist", () => {
  for (const [path, html] of pagesBuilt) {
    const alts = [...html.matchAll(/<link rel="alternate" hreflang="([a-z-]+)" href="([^"]+)">/g)].map((m) => [m[1], m[2].replace(SITE, "")]);
    for (const [lang, href] of alts) {
      if (lang === "x-default") continue;
      const other = pagesBuilt.get(href);
      assert.ok(other, `${path}: hreflang ${lang} names ${href}, which is not built`);
      assert.ok(other!.includes(`hreflang="${langOfPath(path)}" href="${SITE}${path}"`), `${href} does not link back to ${path}`);
    }
  }
});

test("pictures have width, height and alt text; only the first on a page loads at once", () => {
  for (const [path, html] of pagesBuilt) {
    const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
    for (const img of imgs) {
      assert.match(img, /\swidth="\d+" height="\d+"|\sheight="\d+"/, `${path}: ${img.slice(0, 80)} has no size`);
      assert.match(img, /\salt="[^"]*"/, `${path}: ${img.slice(0, 80)} has no alt`);
    }
    const eagerPictures = imgs.filter((i) => /fetchpriority="high"/.test(i));
    assert.ok(eagerPictures.length <= 1, `${path}: ${eagerPictures.length} pictures load at once`);
    const lead = imgs.filter((i) => /\/img\/(?!faces\/)/.test(i));
    for (const img of lead.slice(1)) assert.match(img, /loading="lazy"/, `${path}: a picture below the first loads at once`);
  }
});

test("the theme script is a classic blocking script before the stylesheet, and the stylesheet never reads the phone's setting", () => {
  const home = pagesBuilt.get("/")!;
  const theme = home.match(/<script src="(\/assets\/theme-[^"]+\.js)"><\/script>/);
  assert.ok(theme, "theme script in <head>");
  assert.ok(home.indexOf(theme![0]) < home.indexOf('rel="stylesheet"'), "theme script before the stylesheet");
  const js = readFileSync(join(dist, theme![1]), "utf8");
  assert.doesNotMatch(js, /^\s*(import|export)\s/m, "the theme script must have no imports or exports");
  const css = readFileSync(join(dist, home.match(/href="(\/assets\/site-[^"]+\.css)"/)![1]), "utf8");
  assert.doesNotMatch(css, /prefers-color-scheme/);
});

test("the feeds list every published piece with absolute addresses and pictures that exist", () => {
  const feed = JSON.parse(readFileSync(join(dist, "feed.json"), "utf8"));
  assert.equal(feed.version, "https://jsonfeed.org/version/1.1");
  assert.equal(feed.feed_url, `${SITE}/feed.json`);
  assert.deepEqual(feed.items.map((i: { url: string }) => i.url), content.pieces.en.map((p) => `${SITE}/${p.slug}`));
  for (const item of feed.items) {
    for (const key of ["id", "url", "title", "summary", "content_text", "image", "date_published"]) assert.ok(item[key], `${item.id}: ${key}`);
    assert.ok(served(item.url.replace(SITE, "")), `${item.url} is not built`);
    assert.ok(served(item.image.replace(SITE, "")), `${item.image} is not built`);
    assert.ok(served(item._streetlist_journal.companion.face.replace(SITE, "")), "companion face");
    assert.ok(item._streetlist_journal.image.alt.length > 10, "picture alt");
    assert.match(item.date_published, /^\d{4}-\d{2}-\d{2}T00:00:00\+05:30$/);
  }
  const rss = readFileSync(join(dist, "feed.xml"), "utf8");
  assert.match(rss, /^<\?xml version="1.0" encoding="UTF-8"\?>\n<rss version="2.0"/);
  assert.equal(rss.match(/<item>/g)?.length, content.pieces.en.length);
  assert.doesNotMatch(rss.replace(/&(amp|lt|gt|quot|#39);/g, ""), /&/, "unescaped & in the RSS");
  for (const m of rss.matchAll(/<enclosure url="([^"]+)" length="(\d+)"/g)) {
    const file = served(m[1].replace(SITE, ""));
    assert.ok(file, m[1]);
    assert.equal(statSync(file!).size, Number(m[2]), `${m[1]}: enclosure length`);
  }
});

test("the sitemap lists every indexable page and nothing else", () => {
  const xml = readFileSync(join(dist, "sitemap.xml"), "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, ""));
  const indexable = [...pagesBuilt].filter(([, html]) => !/<meta name="robots" content="noindex">/.test(html)).map(([p]) => p);
  assert.deepEqual(locs.sort(), indexable.sort());
  for (const lang of LANGS) {
    const noindexed = [...pagesBuilt].filter(([p]) => langOfPath(p) === lang && p !== "/404").every(([, html]) => /content="noindex"/.test(html));
    assert.equal(noindexed, !interfaceReviewed(lang), `${lang}: noindex only while its interface words wait for review`);
  }
  assert.match(readFileSync(join(dist, "robots.txt"), "utf8"), new RegExp(`Sitemap: ${SITE}/sitemap.xml`));
});

test("redirects.json sends geometer.dev's six moved pieces to pages this site builds", () => {
  const { redirects } = JSON.parse(readFileSync(join(root, "redirects.json"), "utf8"));
  assert.equal(redirects.length, 6);
  for (const r of redirects) {
    assert.match(r.source, /^\/journal\/[a-z0-9-]+$/);
    assert.equal(r.destination, `${SITE}/${r.source.slice("/journal/".length)}`);
    assert.equal(r.type, 301);
    assert.ok(pagesBuilt.has(r.destination.replace(SITE, "")), `${r.destination} is not built`);
  }
});

test("CNAME names journal.streetlist.in", () => {
  assert.equal(readFileSync(join(dist, "CNAME"), "utf8").trim(), "journal.streetlist.in");
});

test("the size budget holds: pages, stylesheet, theme script, phone-sized pictures, covers and faces", () => {
  for (const [path, html] of pagesBuilt) assert.ok(gzipSync(html).length <= BUDGET.htmlGz, `${path}: ${gzipSync(html).length} bytes gzipped`);
  const home = pagesBuilt.get("/")!;
  const css = readFileSync(join(dist, home.match(/href="(\/assets\/site-[^"]+\.css)"/)![1]));
  assert.ok(gzipSync(css).length <= BUDGET.cssGz, `stylesheet ${gzipSync(css).length} bytes gzipped`);
  const js = readFileSync(join(dist, home.match(/<script src="(\/assets\/theme-[^"]+\.js)"/)![1]));
  assert.ok(gzipSync(js).length <= BUDGET.themeJsGz, `theme script ${gzipSync(js).length} bytes gzipped`);
  const img = join(dist, "img");
  for (const name of readdirSync(img)) {
    const size = statSync(join(img, name)).size;
    if (/-800\.avif$/.test(name)) assert.ok(size <= BUDGET.phonePicture, `${name}: ${size} bytes`);
    if (/^cover-.*\.svg$/.test(name)) assert.ok(gzipSync(readFileSync(join(img, name))).length <= BUDGET.cover, `${name} gzipped`);
  }
  for (const name of readdirSync(join(img, "faces"))) assert.ok(statSync(join(img, "faces", name)).size <= BUDGET.face, `faces/${name}`);
});
