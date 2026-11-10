/**
 * popover.tsx exports Popover (the primary component) and PopoverTrigger, an alias of React Aria's DialogTrigger.
 */
export const componentMeta = {
    importName: "Popover",
    description:
        'Dark, interactive explainer anchored to its trigger: body text plus an optional acknowledgement button. Popover props: children (body text; also names the dialog unless aria-label is set), acknowledgeLabel (label of the dismiss button, e.g. "Okay! Got It"; omit for none), onAcknowledge (called before it closes), aria-label, placement (default "bottom start"), offset (default 8), className, plus React Aria Popover props. Wrap the trigger (any pressable, e.g. Button) and the Popover in PopoverTrigger (opens on press; supports defaultOpen, isOpen, onOpenChange). Unlike Tooltip it is a non-modal dialog that can hold focusable content and returns focus to the trigger.',
    variants: {},
    a11y: "A non-modal dialog named by its body text (aria-labelledby) or aria-label; opens on press, closes on Escape, outside press or the acknowledge button, and returns focus to the trigger. The body is plain text; keep it short.",
    doNot: [
        "Do not use it for a hover or focus label with nothing to press; use Tooltip.",
        "Do not put long forms or critical blocking content in it; use Modal.",
        "Do not put the trigger outside PopoverTrigger.",
    ],
    examples: [
        {
            title: "Explainer with acknowledge button",
            code: '<PopoverTrigger>\n  <Button size="sm" color="outline-pill" iconTrailing={HelpCircleIcon}>Why this takes time</Button>\n  <Popover acknowledgeLabel="Okay! Got It">We train a private model on your selfies, then generate every look.</Popover>\n</PopoverTrigger>',
        },
    ],
};
