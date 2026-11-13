// The list pages, one per language: a section (topic) page, with its mascot large beside the heading (the page's one bold place)
// and every piece in it as a card; and a label page (Idea, Opinion and so on), with what the label means. A section with no
// pieces yet shows its mascot asleep and an invitation to write; a label page is made only when a piece carries that label.
import { CONTACT } from "../i18n/en.ts";
import { LANGS, STRINGS, url, type Lang } from "../i18n/index.ts";
import type { Label, Topic } from "../content.ts";
import { piecesFor } from "./home.ts";
import { card, esc, faceImg, labelIn, page, topicIn, type Ctx } from "./layout.ts";

export function topicPage(ctx: Ctx, topic: Topic, lang: Lang): string {
  const s = STRINGS[lang];
  const t = topicIn(topic, lang);
  const pieces = piecesFor(ctx, lang).filter((p) => p.topic === topic.id);
  const list = pieces.length
    ? `<div class="cards">${pieces.map((p) => card(ctx, p, lang)).join("")}</div>`
    : `<p class="list-empty">${esc(s.lists.emptyTopic)} <a href="mailto:${CONTACT}">${esc(s.home.write)}</a></p>`;
  const body = `<header class="list-head t-${topic.id}"><div class="wrap list-head-in">
${faceImg(ctx, topic.mascot.look, pieces.length ? topic.mascot.mood : "closed", 132, "list-face", false)}
<div><h1>${esc(t.name)}</h1><p class="lead-line">${esc(t.gloss)}</p><p class="count">${esc(s.lists.count(pieces.length))}</p></div>
</div></header>
<section class="wrap list-body">${list}</section>`;
  return page({
    ctx, lang, path: url.topic(lang, topic.id),
    title: `${t.name} | Streetlist Journal`,
    description: t.gloss,
    body,
    alternates: Object.fromEntries(LANGS.map((l) => [l, url.topic(l, topic.id)])),
    bodyClass: "list-page",
  });
}

export function labelPage(ctx: Ctx, label: Label, lang: Lang): string {
  const s = STRINGS[lang];
  const l = labelIn(label, lang);
  const pieces = piecesFor(ctx, lang).filter((p) => p.label === label.id);
  const body = `<header class="list-head is-label"><div class="wrap list-head-in">
<div><h1 class="lbl-title l-${label.id}">${esc(l.name)}</h1><p class="lead-line">${esc(l.gloss)}</p><p class="count">${esc(s.lists.count(pieces.length))}</p></div>
</div></header>
<section class="wrap list-body"><div class="cards">${pieces.map((p) => card(ctx, p, lang)).join("")}</div></section>`;
  return page({
    ctx, lang, path: url.label(lang, label.id),
    title: `${l.name} | Streetlist Journal`,
    description: l.gloss,
    body,
    alternates: Object.fromEntries(LANGS.map((x) => [x, url.label(x, label.id)])),
    bodyClass: "list-page",
  });
}
