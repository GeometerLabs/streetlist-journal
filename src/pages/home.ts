// The front page, one per language: the masthead (the tagline, the line under it, the short introduction and the five section
// mascots), the lead story (the one bold place on the page: a big picture and a big Baloo headline), the latest pieces as cards,
// the five sections each with its mascot and its newest pieces (a section with none yet shows its mascot asleep and an invitation
// to write), and a pointer to About. Pieces not yet in the page's language show in English, marked with lang="en".
import { CONTACT } from "../i18n/en.ts";
import { LANGS, STRINGS, url, type Lang } from "../i18n/index.ts";
import { leadOf, type Piece } from "../content.ts";
import { card, esc, faceImg, labelTag, langAttr, meta, page, pictureAlt, pictureHtml, stamp, topicIn, type Ctx } from "./layout.ts";

/** The pieces a page in this language lists: its own versions first choice, the English otherwise, newest first. */
export function piecesFor(ctx: Ctx, lang: Lang): Piece[] {
  const own = new Map(ctx.content.pieces[lang].map((p) => [p.slug, p]));
  return ctx.content.pieces.en.map((p) => own.get(p.slug) ?? p);
}

export function homePage(ctx: Ctx, lang: Lang): string {
  const s = STRINGS[lang];
  const all = piecesFor(ctx, lang);
  const lead = leadOf(all);
  const rest = all.filter((p) => p !== lead);
  const topics = ctx.content.taxonomy.topics;

  const mascots = topics.map((t) => {
    const name = topicIn(t, lang).name;
    return `<li><a class="mascot t-${t.id}" href="${url.topic(lang, t.id)}">${faceImg(ctx, t.mascot.look, t.mascot.mood, 56, "mascot-face", false)}<span>${esc(name)}</span></a></li>`;
  }).join("");

  let leadHtml = "";
  if (lead) {
    const words = langAttr(lead.lang, lang);
    leadHtml = `<section class="lead wrap" aria-labelledby="lead-title">
<h2 class="vh">${esc(s.home.lead)}</h2>
<article class="lead-story t-${lead.topic}">
<div class="lead-pic">${pictureHtml(ctx.pictures.get(lead.slug)!, pictureAlt(ctx, lead, lang), "(max-width: 900px) calc(100vw - 32px), 620px", true)}</div>
<div class="lead-text">
<p class="tags">${stamp(ctx, lead.topic, lang, true)} ${labelTag(ctx, lead.label, lang, true)}</p>
<h3 class="lead-title" id="lead-title"${words}><a class="card-link" href="${url.piece(lead.lang, lead.slug)}">${esc(lead.title)}</a></h3>
<p class="lead-sum"${words}>${esc(lead.summary)}</p>
<p class="byline">${faceImg(ctx, lead.companion.look, lead.companion.mood, 44, "byline-face", false)}<span>${meta(lead, lang, true)}</span></p>
</div>
</article>
</section>`;
  }

  const latest = rest.length
    ? `<section class="latest wrap" aria-labelledby="latest-title"><h2 id="latest-title" class="sec-title">${esc(s.home.latest)}</h2>
<div class="cards">${rest.slice(0, 6).map((p) => card(ctx, p, lang)).join("")}</div></section>`
    : "";

  const sections = topics.map((t) => {
    const name = topicIn(t, lang);
    const inTopic = all.filter((p) => p.topic === t.id);
    const head = `<div class="shelf-head">${faceImg(ctx, t.mascot.look, inTopic.length ? t.mascot.mood : "closed", 64, "shelf-face")}`
      + `<div><h3 class="shelf-title"><a href="${url.topic(lang, t.id)}">${esc(name.name)}</a></h3><p class="shelf-gloss">${esc(name.gloss)}</p></div></div>`;
    const list = inTopic.length
      ? `<div class="shelf-list">${inTopic.slice(0, 3).map((p) => card(ctx, p, lang, { summary: false, compact: true })).join("")}</div>`
        + (inTopic.length > 3 ? `<p class="more"><a href="${url.topic(lang, t.id)}">${esc(s.home.more(name.name))}</a></p>` : "")
      : `<p class="shelf-empty">${esc(s.home.empty)} <a href="mailto:${CONTACT}">${esc(s.home.write)}</a></p>`;
    return `<section class="shelf t-${t.id}${inTopic.length ? "" : " is-empty"}" aria-label="${esc(name.name)}">${head}${list}</section>`;
  }).join("");

  const body = `<section class="mast wrap">
<h1 class="mast-title">${esc(s.site.tagline)}</h1>
<p class="mast-sub">${esc(s.site.sub)}</p>
<p class="mast-intro">${esc(s.home.intro)}</p>
<nav class="mascots-nav" aria-label="${esc(s.home.sections)}"><ul class="mascots">${mascots}</ul></nav>
</section>
${leadHtml}
${latest}
<section class="shelves wrap" aria-labelledby="sections-title"><h2 id="sections-title" class="sec-title">${esc(s.home.sections)}</h2>
<div class="shelf-grid">${sections}</div></section>
<section class="about-teaser wrap"><div class="about-card"><h2>${esc(s.home.aboutTitle)}</h2><p>${esc(s.home.aboutText)}</p>
<p><a class="pill" href="${url.about()}" hreflang="en">${esc(s.home.aboutLink)}</a></p></div></section>`;

  return page({
    ctx, lang, path: url.home(lang),
    title: `Streetlist Journal: ${s.site.tagline}`,
    description: s.site.sub,
    body,
    alternates: Object.fromEntries(LANGS.map((l) => [l, url.home(l)])),
    bodyClass: "home",
    shareImage: lead ? ctx.pictures.get(lead.slug)!.share : undefined,
  });
}
