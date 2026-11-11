/**
 * popover.tsx exports Popover (the primary component) and PopoverTrigger, an alias of React Aria's DialogTrigger.
 */
export const componentMeta = {
    importName: "Popover",
    description:
        'Dark, interactive explainer anchored to its trigger: body text plus an optional acknowledgement button. Popover props: children (body text, or any content with variant "bare"; also names the dialog unless aria-label is set), variant ("default": the dark padded text explainer; "bare": no surface, padding or width, for rich content such as a QRCard that brings its own -- give it an aria-label), size ("md" default: 273px wide; "sm": the phone explainer, viewport width minus 17px; "responsive": sm below the md breakpoint, md from it; ignored by bare; sm/responsive default containerPadding to 8), acknowledgeLabel (label of the dismiss button, e.g. "Okay! Got It"; omit for none), onAcknowledge (called before it closes), aria-label, placement (default "bottom start"), offset (default 8), className, plus React Aria Popover props. Wrap the trigger (any pressable, e.g. Button) and the Popover in PopoverTrigger (opens on press; supports defaultOpen, isOpen, onOpenChange). Unlike Tooltip it is a non-modal dialog that can hold focusable content and returns focus to the trigger.',
    variants: { variant: ["default", "bare"], size: ["md", "sm", "responsive"] },
    a11y: "A non-modal dialog named by its body text (aria-labelledby) or aria-label; opens on press, closes on Escape, outside press or the acknowledge button, and returns focus to the trigger. The default body is plain text; keep it short. Focus rings inside the default (dark) explainer are white so they stay visible on #151515. With variant bare, pass an aria-label and make sure the content provides its own focus-visible styles; a QRCard close button (onClose) also closes the popover through its close slot.",
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
        {
            title: "QR code beside a trigger",
            code: '<PopoverTrigger>\n  <Button>Use Phone Camera</Button>\n  <Popover variant="bare" placement="right bottom" offset={11} aria-label="Continue on your phone">\n    <QRCard value={captureUrl} caption="Use your phone to take the picture for a better quality" onClose={() => {}} />\n  </Popover>\n</PopoverTrigger>',
        },
    ],
};
