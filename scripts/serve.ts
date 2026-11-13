// `npm run preview`: serves dist/ the way GitHub Pages will, so what the owner previews (and what the browser tests check) behaves
// like the live Journal: /x is served from x.html, /hi/ from hi/index.html, /hi from a redirect to /hi/, and anything else gets
// 404.html with a 404 status. GitHub Pages sends no custom headers, so neither does this; the content security policy travels in
// each page's <meta> tag. Like GitHub Pages it gzips text (HTML, CSS, scripts, SVG, JSON, XML) for browsers that accept it, so the
// browser test's byte counts match what a phone downloads. Port: PORT, or 4310. Local use only.
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml", ".woff2": "font/woff2", ".jpg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif",
  ".png": "image/png", ".txt": "text/plain; charset=utf-8", ".json": "application/json", ".xml": "application/xml",
};

/** What GitHub Pages does with an address: a file, x.html for /x, index.html for a folder, or a redirect to add the slash. */
function resolvePath(path: string): { file?: string; redirect?: string } {
  let decoded: string;
  try { decoded = decodeURIComponent(path); } catch { return {}; }
  const clean = normalize(decoded);
  if (clean.split("/").some((part) => part.startsWith(".")) || !clean.startsWith("/")) return {};
  const at = (rel: string) => {
    const file = join(dist, rel);
    return file.startsWith(dist) && existsSync(file) && statSync(file).isFile() ? file : undefined;
  };
  if (clean.endsWith("/")) return { file: at(`${clean}index.html`) };
  const direct = at(clean) ?? at(`${clean}.html`);
  if (direct) return { file: direct };
  if (existsSync(join(dist, clean)) && statSync(join(dist, clean)).isDirectory()) return { redirect: `${clean}/` };
  return {};
}

const port = Number(process.env.PORT || 4310);
createServer((req, res) => {
  const path = new URL(req.url ?? "/", "http://localhost").pathname;
  const { file, redirect } = resolvePath(path);
  if (redirect) {
    res.writeHead(301, { Location: redirect });
    res.end();
    return;
  }
  const served = file ?? join(dist, "404.html");
  const type = TYPES[extname(served)] ?? "application/octet-stream";
  const body = readFileSync(served);
  const gzip = /^(text\/|image\/svg|application\/(json|xml))/.test(type) && /\bgzip\b/.test(String(req.headers["accept-encoding"] ?? ""));
  res.writeHead(file ? 200 : 404, { "Content-Type": type, ...(gzip ? { "Content-Encoding": "gzip", Vary: "Accept-Encoding" } : {}) });
  res.end(gzip ? gzipSync(body) : body);
}).listen(port, "127.0.0.1", () => console.log(`Streetlist Journal preview: http://127.0.0.1:${port}/`));
