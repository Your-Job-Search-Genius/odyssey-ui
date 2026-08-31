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
  | "utilities";

export interface Category {
  id: CategoryId;
  label: string;
}

export interface DemoEntry {
  /** File name without extension: "variants" -> demos/<slug>/variants.tsx */
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
  /** Component directory name for subpath imports, e.g. "DatePicker". */
  subpath: string;
  keywords?: string[];
  demos: DemoEntry[];
}
