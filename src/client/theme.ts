// The light/dark switch (the sun and moon button in every page's header), the same script as streetlist.in's. Light is the default for everyone,
// whatever the phone's own setting (owner, 14 Nov 2026: "make the light mode default"); the dark theme shows only when the visitor
// picks it. The pick is kept in localStorage and set as data-theme="light"|"dark" on <html>, which site.css reads.
//
// Loaded as a classic, blocking <script> in <head>, before the stylesheet (src/pages/layout.ts), so a stored dark pick is applied
// before the first paint and the page never flashes light first. That is also why this file must have no imports and no exports:
// Vite then emits it as plain code that runs as a classic script (tests/site.test.ts checks the built file). The content security
// policy allows it because it is a file from the site itself, not inline code.
//
// Without scripts the button stays hidden (site.css shows it only under the "js" class set here) and the page is light.
// localStorage can be missing or blocked (private windows, strict settings): every use is wrapped, and the switch still works for
// the visit.
(() => {
  const root = document.documentElement;
  const KEY = "streetlist-journal-theme";
  // The page colours the phone's browser bar takes (the same as --paper in site.css, light and dark).
  const BAR = { light: "#f7f8f4", dark: "#151d1b" };

  root.classList.add("js");
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "light" || stored === "dark") root.dataset.theme = stored;
  } catch {
    // No storage: the default, light.
  }

  const isDark = (): boolean => root.dataset.theme === "dark";

  /** Shows the state on every switch (pressed means dark) and tints the browser bar to match. */
  function sync(): void {
    const dark = isDark();
    document.querySelectorAll(".theme-toggle").forEach((b) => b.setAttribute("aria-pressed", String(dark)));
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", dark ? BAR.dark : BAR.light));
  }

  sync(); // the <meta> tag is already parsed (it comes before this script); the button is not yet
  document.addEventListener("DOMContentLoaded", sync);
  // One listener for the whole page, so the switch works however the header was rendered.
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element) || !target.closest(".theme-toggle")) return;
    const next = isDark() ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // Not remembered, but applied for this visit.
    }
    sync();
  });
})();
