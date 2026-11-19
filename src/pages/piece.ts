// One piece, in one language: the section stamp and label with its meaning, a big headline, the standfirst, the byline with the
// piece's companion, the lead picture with its credit, then the body for long reading (18 px, about 66 characters a line). Each
// heading carries the companion in the mood of that part of the story (worried where things can go wrong, curious at an open
// question), so the face changes as the reader goes. An Idea's example (a short made-up exchange) sits after its second part, as on
// geometer.dev; the AI helper's lines carry the companion's face. Then the ending, the sources and corrections, and Keep reading.
import { STRINGS, url, LANG_INFO, type Lang } from "../i18n/index.ts";
import type { Example, Piece, Section } from "../content.ts";
import { card, esc, faceImg, labelIn, labelOf, labelTag, langAttr, meta, page, pictureAlt, pictureHtml, stamp, type Ctx } from "./layout.ts";

function sectionHtml(ctx: Ctx, piece: Piece, section: Section, index: number): string {
  const mood = piece.moods[index] ?? "well";
  const parts = [
    `<h2>${faceImg(ctx, piece.companion.look, mood, 36, "part-face")}<span>${esc(section.heading)}</span></h2>`,
    ...(section.paragraphs ?? []).map((t) => `<p>${esc(t).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>")}</p>`),
  ];
  if (section.items?.length) parts.push(`<ul class="items">${section.items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`);
  if (section.timeline?.length) {
    parts.push(`<ol class="timeline">${section.timeline.map((s) => `<li><strong>${esc(s.when)}</strong> <span>${esc(s.text)}</span></li>`).join("")}</ol>`);
  }
  parts.push(...(section.after ?? []).map((t) => `<p>${esc(t)}</p>`));
  return `<section class="part" id="part-${index + 1}">${parts.join("\n")}</section>`;
}

function exampleHtml(ctx: Ctx, piece: Piece, example: Example, lang: Lang): string {
  const who = STRINGS[lang].piece.exampleWho;
  const words = langAttr(piece.exampleLang, piece.lang);
  const lines = example.lines.map((line) => {
    const face = line.who === "helper" ? faceImg(ctx, piece.companion.look, "well", 36, "msg-face") : "";
    return `<li class="msg from-${line.who}">${face}<div class="msg-in"><span class="who">${esc(line.name || who[line.who])}</span><p>${esc(line.text)}</p></div></li>`;
  }).join("");
  return `<figure class="example"${words}><figcaption class="ex-title">${esc(example.title)}</figcaption><ol class="chat">${lines}</ol><p class="ex-note">${esc(example.caption)}</p></figure>`;
}

export function piecePage(ctx: Ctx, piece: Piece): string {
  const lang = piece.lang;
  const s = STRINGS[lang];
  const label = labelIn(labelOf(ctx, piece.label), lang);
  const pic = ctx.pictures.get(piece.slug)!;
  const alternates = Object.fromEntries(piece.langs.map((l) => [l, url.piece(l, piece.slug)]));
  const others = piece.langs.filter((l) => l !== lang);

  const credit = piece.image
    ? (piece.image.creditUrl ? `<a href="${esc(piece.image.creditUrl)}">${esc(piece.image.credit)}</a>` : esc(piece.image.credit))
    : esc(s.piece.coverCredit);

  const body = piece.sections.map((section, i) => {
    let html = sectionHtml(ctx, piece, section, i);
    if (i === 1 && piece.example) html += exampleHtml(ctx, piece, piece.example, lang);
    return html;
  }).join("\n");

  const e = piece.ending;
  const ending = e
    ? `<aside class="ending is-${e.kind}"${langAttr(piece.endingLang, lang)}><h2>${esc(e.title)}</h2><p>${esc(e.text)}</p>`
      + (e.code ? `<code>${esc(e.code)}</code>` : "")
      + `<p><a class="pill" href="${esc(e.href)}">${esc(e.linkText)} <span aria-hidden="true">→</span></a></p></aside>`
    : "";

  const sources = `<section class="sources" aria-labelledby="sources-title"><h2 id="sources-title">${esc(s.piece.sources)}</h2>`
    + (piece.sources.length ? `<ul>${piece.sources.map((src) => `<li><a href="${esc(src.url)}">${esc(src.title)}</a></li>`).join("")}</ul>` : "")
    + `<p>${esc(s.piece.corrections)} ${piece.corrections.length ? piece.corrections.map(esc).join("; ") : esc(s.piece.noCorrections)}</p>`
    + (piece.reviewedBy ? `<p>${esc(s.piece.reviewedBy(piece.reviewedBy))}</p>` : "")
    + `</section>`;

  const related = ctx.content.pieces.en.filter((p) => piece.related.includes(p.slug));
  const elsewhere = piece.elsewhere ?? [];
  const keep = related.length || elsewhere.length
    ? `<section class="keep wrap" aria-labelledby="keep-title"><h2 id="keep-title" class="sec-title">${esc(s.piece.keepReading)}</h2>
${related.length ? `<div class="cards">${related.map((p) => card(ctx, ctx.content.pieces[lang].find((q) => q.slug === p.slug) ?? p, lang)).join("")}</div>` : ""}
${elsewhere.length ? `<div class="elsewhere"><h3>${esc(s.piece.elsewhere)}</h3><ul>${elsewhere.map((e) => `<li lang="en"><a href="${esc(e.url)}">${esc(e.title)}</a></li>`).join("")}</ul></div>` : ""}
<p class="more"><a href="${url.home(lang)}">${esc(s.piece.allJournal)}</a></p></section>`
    : "";

  const html = `<article class="piece t-${piece.topic}">
<header class="piece-head read">
<p class="tags">${stamp(ctx, piece.topic, lang, true)} ${labelTag(ctx, piece.label, lang, true)} <span class="gloss">${esc(label.gloss)}</span></p>
<h1>${esc(piece.title)}</h1>
<p class="standfirst">${esc(piece.summary)}</p>
<div class="byline">${faceImg(ctx, piece.companion.look, piece.companion.mood, 48, "byline-face", false)}<p>${meta(piece, lang, true)}</p></div>
${others.length ? `<p class="also">${esc(s.piece.alsoIn)}: ${others.map((l) => `<a href="${url.piece(l, piece.slug)}" hreflang="${l}" lang="${l}">${esc(LANG_INFO[l].name)}</a>`).join(", ")}</p>` : ""}
</header>
<figure class="lead-fig${pic.kind === "cover" ? " is-cover" : ""}">${pictureHtml(pic, pictureAlt(ctx, piece, lang), "(max-width: 1080px) calc(100vw - 32px), 1048px", true)}<figcaption>${credit}</figcaption></figure>
<div class="body read">
${body}
${ending}
${sources}
</div>
</article>
${keep}`;

  return page({
    ctx, lang, path: url.piece(lang, piece.slug),
    title: `${piece.title} | Streetlist Journal`,
    description: piece.summary,
    body: html,
    alternates,
    bodyClass: "piece-page",
    shareImage: pic.share,
    shareType: "article",
  });
}
