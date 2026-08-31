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

export interface DemoEntry {
  /** File name without extension: "variants" -> demos/<slug>/<id>.tsx */
  id: string;
  title: string;
  description?: string;
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
}
