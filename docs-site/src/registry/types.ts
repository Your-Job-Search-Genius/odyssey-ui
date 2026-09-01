export type CategoryId =
  | "actions"
  | "forms"
  | "pickers"
  | "overlays"
  | "navigation"
  | "data-display"
  | "feedback"
  | "layout"
  | "ai"
  | "utilities"
  | "hooks";

export interface Category {
  id: CategoryId;
  label: string;
}

export type AudienceId = "generic" | "client" | "admin";

export interface Audience {
  id: AudienceId;
  label: string;
  description: string;
}

export interface DemoEntry {
  /** File name without extension: "variants" -> demos/<slug>/<id>.tsx */
  id: string;
  title: string;
  description?: string;
  /**
   * Render the preview canvas as block flow instead of centered flex.
   * Needed by components that measure their container width (Table,
   * Virtualizer) — a shrink-to-fit flex canvas collapses them to zero.
   */
  wide?: boolean;
}

export interface ComponentEntry {
  /** URL segment and demos directory name, e.g. "date-picker". */
  slug: string;
  /** Display name, e.g. "DatePicker". */
  name: string;
  category: CategoryId;
  description: string;
  /** Value exports shown in the import snippet. */
  importNames: string[];
  /**
   * Component directory name for subpath imports, e.g. "DatePicker".
   * Unused when `importPackage` is set (hooks import from react-aria directly).
   */
  subpath: string;
  /**
   * Package specifier for the import snippet. Defaults to the Odyssey UI
   * package. Hooks use `"react-aria"` — they are the primitives this library
   * builds on, not re-exported from the barrel.
   */
  importPackage?: string;
  /** When true, only show a single import line (no tree-shaken CSS pair). */
  skipTreeShake?: boolean;
  keywords?: string[];
  demos: DemoEntry[];
  /**
   * Team(s) whose current design this component embodies. Omit for a
   * generic, team-agnostic component — the default, true for almost
   * everything today. Only tag once a real, non-generic design exists.
   */
  audiences?: AudienceId[];
}
