import type { ReactNode } from "react";
import { ThemeProvider } from "@your-job-search-genius/odyssey-ui";

/**
 * The surface demos render on. Always light — the library ships light tokens
 * only — regardless of the docs chrome theme. Mirrors the Storybook
 * decorator (ThemeProvider + padding + centered content).
 */
export function PreviewCanvas({ children }: { children: ReactNode }) {
  return (
    <div className="docs-demo__canvas">
      <ThemeProvider>{children}</ThemeProvider>
    </div>
  );
}
