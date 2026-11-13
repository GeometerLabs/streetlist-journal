// Vite builds only the browser side of the Journal: the stylesheet (src/styles/site.css, which pulls in the self-hosted Baloo 2,
// Baloo Chettan 2 and Baloo Tamma 2 font files) and the theme script (src/client/theme.ts, loaded as a classic blocking script in
// <head>, so it has no imports). Both get content-hashed names and a manifest; scripts/build.ts then writes the HTML pages, reading
// the hashed names from dist/.vite/manifest.json. public/ (the favicon and CNAME) is copied as it is. Used by `npm run build`.
// The same arrangement as streetlist.in's site, minus its client app: the Journal needs no other script.
import { defineConfig } from "vite";

export default defineConfig({
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    manifest: true,
    modulePreload: { polyfill: false },
    assetsInlineLimit: 0, // fonts stay files, so the strict content security policy (no data: URLs) holds
    rollupOptions: {
      input: { theme: "src/client/theme.ts", site: "src/styles/site.css" },
    },
  },
});
