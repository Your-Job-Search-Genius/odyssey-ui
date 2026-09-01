import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { useDesignMode } from "./DesignModeContext";
import { ThemeProvider } from "./ThemeProvider";
import type { DesignMode } from "./types";

/** Renders the resolved design mode as text so tests can assert on it directly. */
function Probe({ localOverride }: { localOverride?: DesignMode }) {
  return <span data-testid="probe">{useDesignMode(localOverride)}</span>;
}

describe("useDesignMode", () => {
  it("resolves to \"generic\" with no ThemeProvider mounted", () => {
    render(<Probe />);
    expect(screen.getByTestId("probe")).toHaveTextContent("generic");
  });

  it("resolves to the nearest ThemeProvider's mode when there's no local override", () => {
    render(
      <ThemeProvider mode="client">
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("probe")).toHaveTextContent("client");
  });

  it("prefers a local override over the ambient ThemeProvider mode", () => {
    render(
      <ThemeProvider mode="client">
        <Probe localOverride="admin" />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("probe")).toHaveTextContent("admin");
  });

  it("lets a nested ThemeProvider scope a different mode to its own subtree", () => {
    render(
      <ThemeProvider mode="client">
        <Probe />
        <ThemeProvider mode="admin">
          <Probe />
        </ThemeProvider>
      </ThemeProvider>,
    );
    const probes = screen.getAllByTestId("probe");
    expect(probes[0]).toHaveTextContent("client");
    expect(probes[1]).toHaveTextContent("admin");
  });
});
