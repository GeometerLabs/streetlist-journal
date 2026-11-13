// The About page (English only for now; a draft for the owner's review, see src/i18n/about.ts and docs/review.md) and the friendly
// 404. About adds the five sections with their mascots and the six labels with their meanings, both from content/taxonomy.json,
// so the page never disagrees with the rest of the Journal. The 404 is one page for every language (GitHub Pages serves a single
// 404.html): the Journal's sleeping companion behind a half-pulled shutter (Streetlist's 404 picture), and a way back in all four.
import { about } from "../i18n/about.ts";
import { CONTACT } from "../i18n/en.ts";
import { LANG_INFO, LANGS, STRINGS, url } from "../i18n/index.ts";
import { esc, faceImg, page, type Ctx } from "./layout.ts";

export function aboutPage(ctx: Ctx): string {
  const { labels, topics } = ctx.content.taxonomy;
  const withPieces = new Set(ctx.content.pieces.en.map((p) => p.label));
  const parts = about.parts.map((part) => `<h2>${esc(part.heading)}</h2>${part.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}`).join("\n");
  const sections = topics.map((t) =>
    `<li class="t-${t.id}">${faceImg(ctx, t.mascot.look, t.mascot.mood, 48, "about-face")}<div><a class="stamp t-${t.id}" href="${url.topic("en", t.id)}">${esc(t.name)}</a><p>${esc(t.gloss)}</p></div></li>`).join("");
  const labelList = labels.map((l) =>
    `<div><dt>${withPieces.has(l.id) ? `<a class="lbl l-${l.id}" href="${url.label("en", l.id)}">${esc(l.name)}</a>` : `<span class="lbl l-${l.id}">${esc(l.name)}</span>`}</dt><dd>${esc(l.gloss)}</dd></div>`).join("");
  const body = `<article class="about read">
<h1>${esc(about.title)}</h1>
<p class="standfirst">${esc(about.lead)}</p>
${parts}
<h2>${esc(about.sectionsHeading)}</h2>
<ul class="about-sections">${sections}</ul>
<h2>${esc(about.labelsHeading)}</h2>
<p>${esc(about.labelsIntro)}</p>
<dl class="about-labels">${labelList}</dl>
<h2>${esc(about.languagesHeading)}</h2>
<p>${esc(about.languages)}</p>
<h2>${esc(about.writeHeading)}</h2>
<p>${esc(about.write[0])}</p>
<p>${esc(about.write[1])} <a href="mailto:${CONTACT}">${CONTACT}</a>.</p>
</article>`;
  return page({
    ctx, lang: "en", path: url.about(),
    title: `${about.title} | Streetlist Journal`,
    description: about.lead,
    body,
    alternates: { en: url.about() },
    bodyClass: "about-page",
  });
}

export function notFoundPage(ctx: Ctx): string {
  const s = STRINGS.en;
  const lead = ctx.content.pieces.en[0];
  const look = lead?.companion.look ?? "clay-1";
  const others = LANGS.filter((l) => l !== "en")
    .map((l) => `<a href="${url.home(l)}" hreflang="${l}" lang="${l}">${esc(LANG_INFO[l].name)}</a>`).join(" · ");
  const body = `<section class="lost wrap">
<div class="shutter-box">${faceImg(ctx, look, "closed", 200, "lost-face", false)}<span class="shutter" aria-hidden="true"></span></div>
<div><h1>${esc(s.notFound.title)}</h1><p class="standfirst">${esc(s.notFound.text)}</p>
<p><a class="pill" href="/">${esc(s.notFound.home)}</a></p>
<p class="lost-langs">${esc(s.notFound.other)}: ${others}</p></div>
</section>`;
  return page({
    ctx, lang: "en", path: "/404",
    title: `${s.notFound.title} | Streetlist Journal`,
    description: s.notFound.text,
    body,
    alternates: {},
    bodyClass: "lost-page",
    noindex: true,
  });
}
