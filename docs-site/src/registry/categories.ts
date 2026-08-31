import type { Category } from "./types";

export const categories: Category[] = [
  { id: "actions", label: "Actions" },
  { id: "forms", label: "Forms" },
  { id: "pickers", label: "Pickers" },
  { id: "overlays", label: "Overlays" },
  { id: "navigation", label: "Navigation" },
  { id: "data-display", label: "Data Display" },
  { id: "feedback", label: "Feedback" },
  { id: "layout", label: "Layout" },
  { id: "ai", label: "AI & Chat" },
  { id: "utilities", label: "Utilities" },
  { id: "hooks", label: "React Aria Hooks" },
];

export const categoryLabel = (id: string): string =>
  categories.find((c) => c.id === id)?.label ?? id;
