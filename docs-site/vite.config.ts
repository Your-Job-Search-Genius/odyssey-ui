import { copyFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const root = dirname(fileURLToPath(import.meta.url));

/**
 * GitHub Pages serves 404.html for unknown paths; making it a copy of
 * index.html lets BrowserRouter handle deep links without a redirect hack.
 */
function spaGithubPages404(): Plugin {
  return {
    name: "spa-github-pages-404",
    closeBundle() {
      copyFileSync(
        resolve(root, "dist/index.html"),
        resolve(root, "dist/404.html"),
      );
    },
  };
}

export default defineConfig({
  base: "/yjsg-ui/",
  plugins: [react(), spaGithubPages404()],
  resolve: {
    alias: [
      // Compile library source directly so demos can import the real package
      // specifier without a tsup build. Anchored so subpaths don't half-match.
      {
        find: /^@your-job-search-genius\/odyssey-ui$/,
        replacement: resolve(root, "../src/index.ts"),
      },
      {
        find: /^@your-job-search-genius\/odyssey-ui\/components\/([^/]+)$/,
        replacement: resolve(root, "../src/components/$1/index.ts"),
      },
    ],
    // Library source and docs code must share one copy of React and of
    // react-aria's module-singleton contexts.
    dedupe: [
      "react",
      "react-dom",
      "react-aria-components",
      "react-aria",
      "react-stately",
    ],
  },
  server: {
    fs: {
      allow: [resolve(root, "..")],
    },
  },
});
