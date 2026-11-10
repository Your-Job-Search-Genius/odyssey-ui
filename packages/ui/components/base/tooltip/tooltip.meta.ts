/**
 * Registry override for Tooltip / TooltipTrigger (tooltip.tsx).
 */
export const componentMeta = {
    importName: "Tooltip",
    description:
        "Short hint on hover or focus. Tooltip (title, description, arrow, delay 300ms, placement) wraps one trigger, usually TooltipTrigger. Renders a dark popover surface (bg-popover #151515, 14px radius, 10px padding, 14px text) that stays dark in both themes: a title-only tooltip uses the muted text-popover color; with a description the title is white and medium weight.",
    a11y: "Opens on hover and keyboard focus, closes on Escape; ignores the scroll caused by Tab focusing a trigger and a Tab keydown still in flight. Keep it to supplementary text -- anything essential belongs in the visible UI. An icon-only trigger still needs its own aria-label.",
    doNot: [
        "Do not put interactive content or essential instructions in a tooltip.",
        "Do not wrap a non-focusable element without TooltipTrigger -- keyboard users cannot open it.",
    ],
    examples: [
        {
            title: "With description",
            code: '<Tooltip title="Share" description="Copy a link to this page"><TooltipTrigger aria-label="Share"><Share01 className="size-4" /></TooltipTrigger></Tooltip>',
        },
    ],
};
