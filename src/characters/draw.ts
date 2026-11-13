// Draws a cast member as an SVG string: DiceBear's own drawing on DiceBear's own tile, exactly as Streetlist shows its faces
// (streetlist.in's src/characters/draw.ts, trimmed: the Journal shows still faces only, so there is no animation and no
// reduced-motion twin). One finish at every size, from the 32 px face beside a heading to the large cover tile.
// Drawn at build time only (scripts/build.ts writes the files); the Journal loads no DiceBear code in the browser and never calls
// DiceBear's web service.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Avatar, Style } from "@dicebear/core";
import { FACES } from "./faces.ts";
import { STYLES, type Look, type Mood, type StyleId } from "./cast.ts";

const XMLNS = 'xmlns="http://www.w3.org/2000/svg"';

/** The five style definitions, read once from the installed @dicebear/styles package (CC0). */
let styles: Map<StyleId, Style> | undefined;
function styleOf(id: StyleId): Style {
  if (!styles) {
    styles = new Map();
    for (const s of STYLES) {
      const def = JSON.parse(readFileSync(fileURLToPath(import.meta.resolve(`@dicebear/styles/${s}.json`)), "utf8"));
      styles.set(s, new Style(def as ConstructorParameters<typeof Style>[0]));
    }
  }
  return styles.get(id)!;
}

/**
 * "zzz" for a Clay face that is asleep (the closed mood), top right of the 100-unit tile. Clay has no closed eyes, so Streetlist's
 * approved table dims it and adds this sign; the other four styles close their eyes and need nothing extra.
 */
const ZZZ = `<g fill="none" stroke-linecap="round" stroke-linejoin="round" transform="translate(-14 4) scale(.95)">`
  + `<g stroke="#ffffff" stroke-width="5.4" opacity=".9"><path d="M84 22h7l-7 8h7"/><path d="M95 12h8l-8 9h8"/><path d="M106 3h6l-6 7h6"/></g>`
  + `<g stroke="#3a4a8c" stroke-width="2.6"><path d="M84 22h7l-7 8h7"/><path d="M95 12h8l-8 9h8"/><path d="M106 3h6l-6 7h6"/></g></g>`;
const DIM = `<filter id="dim"><feColorMatrix type="saturate" values=".35"/>`
  + `<feComponentTransfer><feFuncR type="linear" slope=".85"/><feFuncG type="linear" slope=".85"/><feFuncB type="linear" slope=".85"/></feComponentTransfer></filter>`;

/** One face in one mood, as DiceBear draws it: the seed decides the look, the mood table the eyes and mouth. */
export function drawFace(look: Look, mood: Mood): string {
  const [eyes, mouth] = FACES[look.style][mood];
  const options = {
    seed: look.seed,
    eyesVariant: [eyes],
    mouthVariant: [mouth],
    // Fixed ids keep the build reproducible (the same face is the same file on every build). Where several faces share one
    // document (a cover), src/images.ts prefixes each face's ids so they cannot clash.
    idRandomization: false,
  };
  const svg = new Avatar(styleOf(look.style), options as never).toString();
  if (mood !== "closed" || look.style !== "clay") return svg;
  const nested = svg.replace(/^<svg /, `<svg x="0" y="0" width="100" height="100" `).replace(/ aria-hidden="true"/, "");
  return `<svg ${XMLNS} viewBox="0 0 100 100"><defs>${DIM}</defs><g filter="url(#dim)">${nested}</g>${ZZZ}</svg>`;
}

/** Gives every id inside one drawing a prefix (and every reference to it), so several drawings can live in one SVG document. */
export function prefixIds(svg: string, prefix: string): string {
  return svg
    .replace(/\bid="([^"]+)"/g, `id="${prefix}$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${prefix}$1)`)
    .replace(/href="#([^"]+)"/g, `href="#${prefix}$1"`);
}
