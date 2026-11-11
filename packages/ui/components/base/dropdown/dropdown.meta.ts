/**
 * dropdown.tsx has no single top-level component function -- it exports
 * `Dropdown` as a plain compound-namespace object (Dropdown.Root, Dropdown.Item,
 * etc.), with several internally-named function components (like
 * MenuTrigger) that aren't meant to be imported directly. docgen's
 * displayName heuristic latched onto one of those internal names
 * instead. Corrected here to the real exported binding.
 */
export const componentMeta = {
    importName: "Dropdown",
    description:
        'Action menu. Compose Dropdown.Root > trigger (Button, or Dropdown.DotsButton for a kebab) + Dropdown.Popover > Dropdown.Menu > Dropdown.Item (optionally grouped in Dropdown.Section with Dropdown.SectionHeader and Dropdown.Separator). Dropdown.Item takes label, icon, addon, count (a small chip right after the label, e.g. 32 for "All 32"), href, and variant="destructive" for delete/remove actions. Menus with selectionMode render checks/radios on items. Below the md breakpoint Dropdown.Popover becomes a bottom sheet; pass mobileSheet={false} to keep a short menu anchored to its trigger on phones (e.g. a toolbar Download menu). backLabel (default "Back") names the button that closes a submenu sheet.',
    a11y: 'Arrow keys move between items, typeahead jumps, Enter/Space activates, Escape closes and returns focus to the trigger. Give an icon-only trigger a specific name: <Dropdown.DotsButton aria-label="Actions for Acme" /> (defaults to "Open menu"). Translate backLabel when submenus are used.',
    doNot: [
        "Do not hand-position a portal menu -- use Dropdown (keyboard navigation and focus return come with it).",
        'Do not signal a destructive item by color alone and run it immediately; use variant="destructive" and confirm with a dialog.',
    ],
    examples: [
        {
            title: "Row actions",
            code: '<Dropdown.Root>\n  <Dropdown.DotsButton aria-label={`Actions for ${row.name}`} />\n  <Dropdown.Popover>\n    <Dropdown.Menu onAction={(key) => handle(key)}>\n      <Dropdown.Item id="edit" label="Edit" icon={Edit01} />\n      <Dropdown.Item id="duplicate" label="Duplicate" icon={Copy01} />\n      <Dropdown.Separator />\n      <Dropdown.Item id="delete" label="Delete" icon={Trash01} variant="destructive" />\n    </Dropdown.Menu>\n  </Dropdown.Popover>\n</Dropdown.Root>',
        },
        {
            title: "Anchored on phones",
            code: '<Dropdown.Root>\n  <Button color="secondary" size="sm">Download</Button>\n  <Dropdown.Popover mobileSheet={false} placement="bottom right" offset={5} className="w-[116px]">\n    <Dropdown.Menu aria-label="Download" onAction={download}>\n      <Dropdown.Item id="all" label="All" count={32} />\n      <Dropdown.Separator />\n      <Dropdown.Item id="favorites" label="Favorites" count={8} />\n    </Dropdown.Menu>\n  </Dropdown.Popover>\n</Dropdown.Root>',
        },
        {
            title: "Single-choice section",
            code: '<Dropdown.Menu>\n  <Dropdown.Section selectionMode="single" selectedKeys={[theme]} onSelectionChange={(keys) => setTheme([...keys][0])}>\n    <Dropdown.SectionHeader>Theme</Dropdown.SectionHeader>\n    <Dropdown.Item id="light" label="Light" />\n    <Dropdown.Item id="dark" label="Dark" />\n  </Dropdown.Section>\n</Dropdown.Menu>',
        },
    ],
};
