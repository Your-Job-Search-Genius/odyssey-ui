/**
 * dropdown.tsx has no single top-level component function -- it exports
 * `Dropdown` as a plain compound-namespace object (Dropdown.Trigger,
 * etc.), with several internally-named function components (like
 * MenuTrigger) that aren't meant to be imported directly. docgen's
 * displayName heuristic latched onto one of those internal names
 * instead. Corrected here to the real exported binding.
 */
export const componentMeta = {
    importName: "Dropdown",
};
