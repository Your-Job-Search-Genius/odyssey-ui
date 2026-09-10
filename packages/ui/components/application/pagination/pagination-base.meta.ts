/**
 * pagination-base.tsx's real top-level export is `Pagination` (a
 * compound-namespace object), not `PaginationRoot` -- docgen's
 * displayName heuristic latched onto an internal type/interface name
 * instead of the actual exported binding.
 */
export const componentMeta = {
    importName: "Pagination",
};
