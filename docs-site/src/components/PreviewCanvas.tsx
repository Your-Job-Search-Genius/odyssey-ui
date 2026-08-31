import type { ReactNode } from "react";
import { ThemeProvider } from "@your-job-search-genius/odyssey-ui";

/**
 * The surface demos render on. Always light — the library ships light tokens
 * only — regardless of the docs chrome theme. Mirrors the Storybook
 * decorator (ThemeProvider + padding + centered content).
 */
export function PreviewCanvas({
  children,
  wide = false,
}: {
  children: ReactNode;
  /** Block flow instead of centered flex — for width-measuring components. */
  wide?: boolean;
}) {
  return (
    <div
      className={
        wide ? "docs-demo__canvas docs-demo__canvas--block" : "docs-demo__canvas"
      }
    >
      <ThemeProvider>{children}</ThemeProvider>
    </div>
  );
}
