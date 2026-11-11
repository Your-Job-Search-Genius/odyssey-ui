/**
 * selection-tray.tsx exports SelectionTray (the primary component) and CounterRing, the decorative arc around the count.
 */
export const componentMeta = {
    importName: "SelectionTray",
    description:
        'Your Selection n/max with the picked thumbnails and a call to action; collapses to a single row when empty. Props: items ({ id, src, alt }[], required), max (required; counter reads items.length/max), title (default "Your Selection"), onRemove(id) (shows a remove badge on each thumbnail on hover/focus, always on touch), removeLabel(item) (default `Remove ${alt}`), info (trailing slot after the counter, e.g. an info button opening a Popover), children (CTA under the tray, e.g. a full-width lg Button), className. CounterRing (className sets its colour, default text-[#DBD8FF]) is the 24px decorative arc, for reuse in custom bars such as BottomBar.',
    variants: {},
    a11y: "Thumbnails are a list (ul/li) with alt text; each remove badge is a button named by removeLabel, revealed on hover or keyboard focus and always on touch. CounterRing is aria-hidden; the number carries the meaning. Give the info slot an aria-label.",
    doNot: [
        "Do not pass thumbnails without alt text; the default remove label is built from it.",
        "Do not use CounterRing alone to convey progress; it is decorative.",
    ],
    examples: [
        {
            title: "With remove, info and CTA",
            code: '<SelectionTray items={items} max={4} onRemove={(id) => setItems((prev) => prev.filter((i) => i.id !== id))} info={<InfoButton />}>\n  <Button size="lg" className="w-full" isDisabled={items.length === 0}>Review Shoot</Button>\n</SelectionTray>',
        },
        { title: "Empty", code: "<SelectionTray items={[]} max={1} />" },
    ],
};
