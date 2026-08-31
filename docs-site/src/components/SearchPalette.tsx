import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CommandPalette } from "@your-job-search-genius/odyssey-ui";
import { categoryLabel } from "../registry/categories";
import { registry } from "../registry/registry";

const items = registry.map((c) => ({
  id: c.slug,
  label: c.name,
  description: categoryLabel(c.category),
}));

interface SearchPaletteProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

/**
 * Site-wide component search, dogfooding the library's own CommandPalette.
 * The library shortcut (⌘J) is disabled in favor of the docs-standard ⌘K.
 */
export function SearchPalette({ isOpen, onOpenChange }: SearchPaletteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!isOpen);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onOpenChange]);

  return (
    <CommandPalette
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      items={items}
      label="Search components"
      placeholder="Search components…"
      enableShortcut={false}
      onAction={(id) => {
        onOpenChange(false);
        navigate(`/components/${String(id)}`);
      }}
    />
  );
}
