// Every picture the Journal shows, made at build time into dist/img/:
//  - Lead pictures (a photo or a drawing the owner adds through Pages CMS into content/media): cropped to the Journal's 3:2 frame
//    and written at 480, 800, 1200 and 1600 px wide as AVIF, WebP and JPEG, so a budget phone downloads the smallest file that is
//    sharp on its screen. The original stays in the repository and is never published (it can be several MB).
//  - Covers, for a piece that has no lead picture yet: the piece's companion large on its tile beside a speech bubble and the
//    section's mascot, on the section's colour. An SVG (a few KB, crisp at any size) and a 1200 px JPEG for the feeds and for link
//    previews, which do not show SVG. Flat colours only, as on streetlist.in.
//  - Faces: each cast member in each mood it is used in, as DiceBear draws it (src/characters/draw.ts), for bylines, headings and
//    section mascots.
// File names are stable (no content hash) so the feeds' picture addresses keep working for sites that copy them at their own build;
// GitHub Pages caches for ten minutes, so a replaced picture shows within minutes. Resized files are kept in .cache/img between
// local builds (keyed by the original's contents), since AVIF is slow to encode.
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import sharp from "sharp";
import { drawFace, prefixIds } from "./characters/draw.ts";
import { CAST, type CastId, type Mood } from "./characters/cast.ts";

/** The widths written for a lead picture, and the frame every lead picture is cropped to (3:2). */
export const WIDTHS = [480, 800, 1200, 1600] as const;
export const FRAME = { width: 1600, height: 1067 };
const FORMATS = ["avif", "webp", "jpg"] as const;
type Format = (typeof FORMATS)[number];

/** A lead picture as the pages need it: srcsets per format, a fallback, the 1200 px JPEG for feeds, and its frame. */
export interface Picture {
  kind: "photo" | "cover";
  width: number;
  height: number;
  srcset: Partial<Record<Format, string>>;
  /** The <img> src: the 800 px JPEG for a photo, the SVG for a cover. */
  src: string;
  /** A 1200 px JPEG for feeds and link previews. */
  share: string;
}

/** The colours of a cover, by section (the same meaning-based colours as the stamps in site.css; covers are images, so one set serves both themes). */
export const COVER_COLOURS: Record<string, { ground: string; deep: string }> = {
  technology: { ground: "#c9d6f6", deep: "#3459b8" },
  livelihoods: { ground: "#fbd98a", deep: "#b86e00" },
  community: { ground: "#bfe3cf", deep: "#136650" },
  ideas: { ground: "#d3d6ef", deep: "#5763a8" },
  art: { ground: "#f6c9d9", deep: "#c4386f" },
};
const FALLBACK_COLOURS = { ground: "#dde3dc", deep: "#1d2427" };

const hash = (data: Buffer | string) => createHash("sha256").update(data).digest("hex").slice(0, 12);

export class Images {
  private readonly root: string;
  private readonly out: string;
  private readonly cache: string;
  private faces = new Map<string, string>();
  /** Bytes written per published file, for the build's size report. */
  readonly written = new Map<string, number>();

  constructor(root: string, dist: string) {
    this.root = root;
    this.out = join(dist, "img");
    this.cache = join(root, ".cache/img");
    mkdirSync(join(this.out, "faces"), { recursive: true });
    mkdirSync(this.cache, { recursive: true });
  }

  private write(rel: string, data: Buffer | string): string {
    writeFileSync(join(this.out, rel), data);
    this.written.set(`/img/${rel}`, Buffer.byteLength(data));
    return `/img/${rel}`;
  }

  /** A face in a mood (still SVG), written once: /img/faces/<look>-<mood>.svg. */
  face(look: CastId, mood: Mood): string {
    const key = `${look}-${mood}`;
    let url = this.faces.get(key);
    if (!url) {
      url = this.write(`faces/${key}.svg`, drawFace(CAST[look], mood));
      this.faces.set(key, url);
    }
    return url;
  }

  /** A lead picture from content/media, resized into every width and format (cached between local builds). */
  async photo(src: string): Promise<Picture> {
    const file = join(this.root, "content", src);
    const original = readFileSync(file);
    const name = basename(src, extname(src)).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const meta = await sharp(original).metadata();
    const widths = WIDTHS.filter((w) => w <= (meta.width ?? 0));
    if (widths.length === 0) widths.push(WIDTHS[0]);
    const key = hash(original);
    const srcset: Partial<Record<Format, string>> = {};
    for (const format of FORMATS) {
      const entries: string[] = [];
      for (const w of widths) {
        const h = Math.round((w * FRAME.height) / FRAME.width);
        const cached = join(this.cache, `${key}-${w}.${format}`);
        if (!existsSync(cached)) {
          const img = sharp(original).rotate().resize(w, h, { fit: "cover", position: "attention" });
          const data =
            format === "avif" ? await img.avif({ quality: 50, effort: 4 }).toBuffer()
            : format === "webp" ? await img.webp({ quality: 72 }).toBuffer()
            : await img.jpeg({ quality: 76, mozjpeg: true, progressive: true }).toBuffer();
          writeFileSync(cached, data);
        }
        const rel = `${name}-${w}.${format}`;
        copyFileSync(cached, join(this.out, rel));
        this.written.set(`/img/${rel}`, readFileSync(cached).length);
        entries.push(`/img/${rel} ${w}w`);
      }
      srcset[format] = entries.join(", ");
    }
    const jpg = (w: number) => `/img/${name}-${widths.includes(w as (typeof WIDTHS)[number]) ? w : widths[widths.length - 1]}.jpg`;
    return { kind: "photo", width: FRAME.width, height: FRAME.height, srcset, src: jpg(800), share: jpg(1200) };
  }

  /** A cover for a piece without a lead picture: its companion, a speech bubble and the section's mascot, on the section's colour. */
  async cover(slug: string, topic: string, companion: { look: CastId; mood: Mood }, mascot: { look: CastId; mood: Mood }): Promise<Picture> {
    const c = COVER_COLOURS[topic] ?? FALLBACK_COLOURS;
    const tile = (look: CastId, mood: Mood, x: number, y: number, size: number, radius: number, id: string, ring = 0) => {
      const face = prefixIds(drawFace(CAST[look], mood), `${id}-`)
        .replace(/^<svg /, `<svg x="${x}" y="${y}" width="${size}" height="${size}" `);
      return `<g><rect x="${x}" y="${y + size * 0.045}" width="${size}" height="${size}" rx="${radius}" fill="${c.deep}" opacity=".22"/>`
        + (ring ? `<rect x="${x - ring}" y="${y - ring}" width="${size + 2 * ring}" height="${size + 2 * ring}" rx="${radius + ring}" fill="#ffffff"/>` : "")
        + `<clipPath id="${id}-clip"><rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${radius}"/></clipPath>`
        + `<g clip-path="url(#${id}-clip)"><rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#ffffff"/>${face}</g></g>`;
    };
    // A few dots of the deeper colour, placed by hand so the cover is the same on every build.
    const dots = [[96, 118, 14], [1096, 110, 10], [1110, 690, 16], [640, 92, 9], [118, 690, 11], [700, 712, 8]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c.deep}" opacity=".55"/>`).join("");
    const bubble = `<g><path d="M760 176h268a52 52 0 0 1 52 52v108a52 52 0 0 1-52 52H806l-58 46 12-46a52 52 0 0 1-52-52V228a52 52 0 0 1 52-52z" fill="#ffffff"/>`
      + [834, 894, 954].map((x) => `<circle cx="${x}" cy="282" r="19" fill="${c.deep}"/>`).join("") + `</g>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">`
      + `<rect width="1200" height="800" fill="${c.ground}"/>${dots}`
      + tile(companion.look, companion.mood, 170, 150, 500, 112, "c")
      + bubble
      + tile(mascot.look, mascot.mood, 836, 470, 210, 50, "m", 9)
      + `</svg>`;
    const src = this.write(`cover-${slug}.svg`, svg);
    let share = src;
    try {
      share = this.write(`cover-${slug}-1200.jpg`, await sharp(Buffer.from(svg)).resize(1200, 800).jpeg({ quality: 80, mozjpeg: true }).toBuffer());
    } catch (error) {
      // librsvg could not draw it: feeds then carry the SVG, which every browser shows.
      console.warn(`cover ${slug}: no JPEG (${(error as Error).message}); the feeds use the SVG.`);
    }
    return { kind: "cover", width: 1200, height: 800, srcset: {}, src, share };
  }
}
