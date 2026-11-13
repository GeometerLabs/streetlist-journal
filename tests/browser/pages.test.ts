// Browser checks (`npm run test:browser`, after `npm run build`), in Chromium through Playwright, against scripts/serve.ts (which
// serves dist/ the way GitHub Pages does):
//  - every English page, and the front, a section and a label page in Hindi, Malayalam and Kannada, at 390 and 1280 px in light and
//    dark: nothing sticks out sideways, axe (WCAG 2.1 A and AA) finds nothing, no console or policy error, nothing loaded from
//    another site, and the page is in the theme asked for. Light is the default whatever the phone says, so the light runs set the
//    phone to dark; the dark runs are a reader who picked dark with the switch. SHOTS_DIR=<folder> saves a screenshot of each;
//  - the light/dark switch by keyboard (picked, remembered, applied on the next page before it paints);
//  - the language switch: open it by keyboard, go to Hindi, and the page is Hindi with taller lines for its script;
//  - the header at 360 px (a common budget phone) in all four languages: nothing sideways, both switches inside the gutter;
//  - the reading measure on a piece: 18 px body text, about 66 characters a line on a laptop;
//  - the feeds and the sitemap are well-formed XML and JSON;
//  - a budget phone (CPU slowed 4x, a slow 4G connection): how long the front page and a piece take to show their main picture and
//    how many bytes they load, fonts included, gzipped as GitHub Pages sends them, against the budget.
import test from "node:test";
import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, type Browser, type Page } from "@playwright/test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const PORT = 4400 + Math.floor(Math.random() * 400);
const BASE = `http://127.0.0.1:${PORT}`;
const AXE = readFileSync(join(root, "node_modules/axe-core/axe.min.js"), "utf8");
const SHOTS = process.env.SHOTS_DIR;
const feed = JSON.parse(readFileSync(join(root, "dist/feed.json"), "utf8")) as { items: { url: string }[] };
const slugs = feed.items.map((i) => new URL(i.url).pathname);

const PAGES = [
  "/", ...slugs, "/topics/livelihoods", "/topics/community", "/topics/art", "/labels/idea", "/labels/opinion", "/about", "/no-such-page",
  "/hi/", "/hi/topics/livelihoods", "/hi/labels/idea", "/ml/", "/ml/topics/community", "/ml/labels/opinion", "/kn/", "/kn/topics/ideas", "/kn/labels/idea",
];
const WIDTHS = [390, 1280];
const SCHEMES = ["light", "dark"] as const;
const PAPER = { light: "rgb(247, 248, 244)", dark: "rgb(21, 29, 27)" } as const;
const THEME_KEY = "streetlist-journal-theme";
/** Whole-page budgets on a budget phone (390 px, first view, fonts included), in bytes over the wire. A front page allows for a Hindi, Malayalam or Kannada heading font (76 to 113 KB). */
const PHONE_BUDGET = { home: 220 * 1024, piece: 160 * 1024, lcpMs: 3500 };

let server: ChildProcess;
let browser: Browser;

test.before(async () => {
  server = spawn(process.execPath, [join(root, "scripts/serve.ts")], { env: { ...process.env, PORT: String(PORT) }, stdio: ["ignore", "pipe", "inherit"] });
  await new Promise<void>((ok, fail) => {
    const timer = setTimeout(() => fail(new Error("the preview server did not start")), 15000);
    server.stdout!.on("data", (d: Buffer) => { if (d.toString().includes("preview")) { clearTimeout(timer); ok(); } });
  });
  browser = await chromium.launch();
});

test.after(async () => {
  await browser?.close();
  server?.kill();
});

/** A page in a theme, recording console errors, page errors and every request that leaves the site. */
async function open(width: number, theme: "light" | "dark", path: string): Promise<{ page: Page; problems: string[] }> {
  const context = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 900 }, colorScheme: theme === "light" ? "dark" : "light", deviceScaleFactor: 1 });
  if (theme === "dark") await context.addInitScript((key) => { try { localStorage.setItem(key, "dark"); } catch { /* the colour check then fails */ } }, THEME_KEY);
  const page = await context.newPage();
  const problems: string[] = [];
  page.on("console", (m) => { if (m.type() === "error" && !/404 \(Not Found\)/.test(m.text())) problems.push(`console: ${m.text()}`); });
  page.on("pageerror", (e) => problems.push(`page error: ${e.message}`));
  page.on("request", (r) => { if (!r.url().startsWith(BASE)) problems.push(`left the site: ${r.url()}`); });
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  return { page, problems };
}

/** Elements that stick out past the right edge, unless an ancestor that fits clips them. */
async function sideways(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const out: string[] = [];
    if (document.documentElement.scrollWidth > vw + 1) out.push(`page scrolls sideways: ${document.documentElement.scrollWidth} > ${vw}`);
    for (const el of Array.from(document.body.querySelectorAll<HTMLElement>("*"))) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.right <= vw + 1) continue;
      let clipped = false;
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
        if (getComputedStyle(a).overflowX !== "visible" && a.getBoundingClientRect().right <= vw + 1) { clipped = true; break; }
      }
      if (!clipped) out.push(`${el.tagName.toLowerCase()}.${el.className} right edge ${Math.round(r.right)} > ${vw}`);
    }
    return out.slice(0, 8);
  });
}

/** axe-core's WCAG 2.1 A/AA rules on the page as it is now (injected through the test's channel: the page's policy refuses inline code). */
async function axe(page: Page): Promise<string[]> {
  await page.evaluate(AXE);
  return page.evaluate(async () => {
    const r = await (window as unknown as { axe: { run: (c: unknown, o: unknown) => Promise<{ violations: { id: string; nodes: { target: string[] }[] }[] }> } })
      .axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } });
    return r.violations.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(", ")}`);
  });
}

for (const path of PAGES) {
  for (const width of WIDTHS) {
    for (const scheme of SCHEMES) {
      test(`${path} at ${width} px, ${scheme}: no sideways scroll, no axe violation, no errors, nothing from elsewhere`, async () => {
        const { page, problems } = await open(width, scheme, path);
        assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), PAPER[scheme], `not in the ${scheme} theme`);
        assert.deepEqual(await sideways(page), []);
        assert.deepEqual(await axe(page), []);
        if (SHOTS) {
          mkdirSync(SHOTS, { recursive: true });
          await page.evaluate(async () => {
            const imgs = Array.from(document.images);
            imgs.forEach((i) => (i.loading = "eager"));
            await Promise.all(imgs.map((i) => i.decode().catch(() => undefined)));
          });
          const name = (path === "/" ? "home" : path.replace(/^\/|\/$/g, "").replace(/\//g, "-")) + `-${width}-${scheme}.png`;
          await page.screenshot({ path: join(SHOTS, name), fullPage: true });
        }
        assert.deepEqual(problems, []);
        await page.context().close();
      });
    }
  }
}

test("the theme switch, by keyboard: dark is picked, remembered, and on the next page before it paints", async () => {
  const { page } = await open(390, "light", "/");
  await page.focus(".theme-toggle");
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), "dark");
  assert.equal(await page.getAttribute(".theme-toggle", "aria-pressed"), "true");
  assert.equal(await page.evaluate((k) => localStorage.getItem(k), THEME_KEY), "dark");
  await page.goto(`${BASE}${slugs[0]}`, { waitUntil: "commit" });
  await page.waitForSelector("body");
  assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), "dark");
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), PAPER.dark);
  assert.deepEqual(await axe(page), []);
  await page.context().close();
});

test("the language switch, by keyboard: Hindi opens in Hindi, with taller lines for its script", async () => {
  const { page } = await open(1280, "light", "/topics/livelihoods");
  await page.focus(".langs summary");
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(() => (document.querySelector(".langs") as HTMLDetailsElement).open), true);
  await page.click('.langs a[hreflang="hi"]');
  await page.waitForURL(`${BASE}/hi/topics/livelihoods`);
  assert.equal(await page.evaluate(() => document.documentElement.lang), "hi");
  const lh = await page.evaluate(() => { const p = document.querySelector(".lead-line")!; const cs = getComputedStyle(p); return parseFloat(cs.lineHeight) / parseFloat(cs.fontSize); });
  assert.ok(Math.abs(lh - 1.7) < 0.02, `line-height ${lh}`);
  // An English piece on a Hindi page says so to screen readers.
  assert.equal(await page.evaluate(() => document.querySelector(".card-title")?.getAttribute("lang")), "en");
  await page.context().close();
});

test("the header fits a 360 px phone in all four languages, both switches inside the gutter", async () => {
  for (const path of ["/", "/hi/", "/ml/", "/kn/", slugs[0]]) {
    const context = await browser.newContext({ viewport: { width: 360, height: 760 } });
    const page = await context.newPage();
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    assert.deepEqual(await sideways(page), [], path);
    const right = await page.evaluate(() => Math.max(...[".theme-toggle", ".langs summary"].map((s) => document.querySelector(s)!.getBoundingClientRect().right)));
    assert.ok(right <= 360 - 15, `${path}: the switches reach ${right}px`);
    const top = await page.evaluate(() => [".brand", ".to-streetlist", ".langs summary", ".theme-toggle"].map((s) => document.querySelector(s)!.getBoundingClientRect().top));
    assert.ok(Math.max(...top) - Math.min(...top) < 14, `${path}: the header wraps (${top.join(", ")})`);
    await context.close();
  }
});

test("a piece reads at 18 px with about 66 characters a line on a laptop", async () => {
  const { page } = await open(1280, "light", slugs[0]);
  const m = await page.evaluate(() => {
    // Characters on each full line of the body's paragraphs (a paragraph's last, short line is left out), by where each
    // character is drawn.
    const counts: number[] = [];
    const paragraphs = Array.from(document.querySelectorAll<HTMLElement>(".body .part > p"));
    for (const p of paragraphs) {
      const text = p.firstChild as Text;
      const lines = new Map<number, number>();
      const range = document.createRange();
      for (let i = 0; i < text.length; i++) {
        range.setStart(text, i);
        range.setEnd(text, i + 1);
        const top = Math.round(range.getBoundingClientRect().top);
        lines.set(top, (lines.get(top) ?? 0) + 1);
      }
      counts.push(...[...lines.values()].slice(0, -1));
    }
    counts.sort((a, b) => a - b);
    return { size: parseFloat(getComputedStyle(paragraphs[0]).fontSize), median: counts[Math.floor(counts.length / 2)], lines: counts.length };
  });
  assert.equal(m.size, 18);
  assert.ok(m.median >= 60 && m.median <= 72, `${m.median} characters a line (median of ${m.lines} full lines)`);
  console.log(`reading measure: ${m.size}px, ${m.median} characters a line (median of ${m.lines} full lines)`);
  await page.context().close();
});

test("the feeds and the sitemap are well-formed, as served", async () => {
  // Fetched by the test (the pages' own policy rightly allows no fetch), then parsed by the browser's XML parser.
  const { page } = await open(390, "light", "/");
  for (const [file, root] of [["/feed.xml", "rss"], ["/sitemap.xml", "urlset"]]) {
    const res = await fetch(BASE + file);
    assert.equal(res.status, 200, file);
    const name = await page.evaluate((text) => {
      const doc = new DOMParser().parseFromString(text, "application/xml");
      return doc.getElementsByTagName("parsererror").length === 0 ? doc.documentElement.nodeName : "parsererror";
    }, await res.text());
    assert.equal(name, root, `${file} is not well-formed XML`);
  }
  const json = (await (await fetch(`${BASE}/feed.json`)).json()) as { items: unknown[] };
  assert.equal(json.items.length, slugs.length);
  await page.context().close();
});

/** One load on a budget phone: CPU slowed 4x, slow 4G (1.6 Mbit/s down, 150 ms). Bytes on the wire and the largest paint. */
async function phoneLoad(path: string): Promise<{ bytes: number; lcp: number }> {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  let bytes = 0;
  cdp.on("Network.loadingFinished", (e: { encodedDataLength: number }) => { bytes += e.encodedDataLength; });
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  // Fonts start loading only once the page is laid out, so wait for them (and a quiet network after) before counting bytes.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle");
  const times = await page.evaluate(() => new Promise<{ lcp: number }>((done) => {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      done({ lcp: entries[entries.length - 1].startTime });
    }).observe({ type: "largest-contentful-paint", buffered: true });
  }));
  await context.close();
  return { bytes, ...times };
}

test("on a budget phone (CPU 4x slower, slow 4G) the front page and a piece show quickly and stay within the byte budget", async () => {
  for (const [path, budget] of [["/", PHONE_BUDGET.home], [slugs[0], PHONE_BUDGET.piece], ["/salon-whatsapp-deposits", PHONE_BUDGET.piece], ["/hi/", PHONE_BUDGET.home], ["/kn/", PHONE_BUDGET.home]] as const) {
    const runs = [await phoneLoad(path), await phoneLoad(path)];
    const best = runs.reduce((a, b) => (a.lcp < b.lcp ? a : b));
    console.log(`budget phone ${path}: ${(best.bytes / 1024).toFixed(0)} KB, largest paint ${best.lcp.toFixed(0)} ms (runs: ${runs.map((r) => r.lcp.toFixed(0)).join(", ")} ms)`);
    assert.ok(best.bytes <= budget, `${path}: ${best.bytes} bytes`);
    assert.ok(best.lcp <= PHONE_BUDGET.lcpMs, `${path}: largest paint ${best.lcp} ms`);
  }
});
