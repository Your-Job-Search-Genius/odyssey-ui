/**
 * Registry override for TagGroup / TagList / Tag.
 */
export const componentMeta = {
    description:
        "Tag chips on React Aria's TagGroup: TagGroup (label, size, selectionMode, onRemove) > TagList (items) > Tag. Removable chips are keyboard reachable (arrow keys between tags, Backspace/Delete removes).",
    variants: { size: ["sm", "md", "lg"] },
    a11y: "TagGroup needs a label (visible or aria-label). Prefer TagGroup onRemove={(keys) => ...} over per-Tag callbacks so removal always sees current state.",
    doNot: [
        "Do not show a remove button only on hover -- removable tags must be reachable by keyboard and touch.",
        "Do not rely on a per-Tag onClose closure that captures list state: TagList caches rendered items, so the closure can be stale (removing one chip can remove all). Use TagGroup onRemove, or read the latest list from a ref.",
    ],
    examples: [
        {
            title: "Removable chips",
            code: '<TagGroup label="Selected schools" onRemove={(keys) => setSelected((prev) => prev.filter((s) => !keys.has(s.id)))}>\n  <TagList items={selected}>{(school) => <Tag id={school.id}>{school.name}</Tag>}</TagList>\n</TagGroup>',
        },
    ],
};
