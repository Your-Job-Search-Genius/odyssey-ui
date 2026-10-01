/**
 * Registry override for ButtonGroup / ButtonGroupItem.
 */
export const componentMeta = {
    description:
        "Segmented toggle buttons. ButtonGroup (size sm|md|lg, selectionMode single by default, selectedKeys/onSelectionChange) > ButtonGroupItem (id, iconLeading, iconTrailing, children). Selected text items show a check (showSelectedIndicator, default true) on the active surface.",
    variants: { size: ["sm", "md", "lg"] },
    a11y: 'Single selection exposes a radiogroup of radios (tests: getByRole("radio")); multiple selection exposes toggle buttons with aria-pressed. Give the group an aria-label. Icon-only items need aria-label.',
    doNot: [
        "Do not use a ButtonGroup for navigation between pages -- use Tabs or links.",
        "Do not turn showSelectedIndicator off unless selection is shown another way; color alone fails non-color selection cues.",
    ],
    examples: [
        {
            title: "Single-select filter",
            code: '<ButtonGroup aria-label="Status" selectedKeys={[status]} onSelectionChange={(keys) => setStatus([...keys][0] as Status)}>\n  <ButtonGroupItem id="all">All</ButtonGroupItem>\n  <ButtonGroupItem id="running">Running</ButtonGroupItem>\n  <ButtonGroupItem id="failed">Failed</ButtonGroupItem>\n</ButtonGroup>',
        },
    ],
};
