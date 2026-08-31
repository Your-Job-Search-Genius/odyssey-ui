import type { HighlighterCore } from "shiki/core";

let instance: Promise<HighlighterCore> | null = null;

/**
 * Lazy shiki singleton with a minimal footprint: one grammar, two themes,
 * JS regex engine (no WASM). Everything shiki lives in one shared async
 * chunk, loaded the first time a code block renders.
 */
export function getHighlighter(): Promise<HighlighterCore> {
  if (!instance) {
    instance = (async () => {
      const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] =
        await Promise.all([
          import("shiki/core"),
          import("shiki/engine/javascript"),
        ]);
      return createHighlighterCore({
        langs: [import("shiki/langs/tsx.mjs")],
        themes: [
          import("shiki/themes/github-light.mjs"),
          import("shiki/themes/github-dark.mjs"),
        ],
        engine: createJavaScriptRegexEngine(),
      });
    })();
  }
  return instance;
}

export function highlight(code: string, highlighter: HighlighterCore): string {
  return highlighter.codeToHtml(code, {
    lang: "tsx",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: "light",
  });
}
