/**
 * Registry override for Carousel (carousel-base.tsx also exports CarouselContext; docgen picked that up as
 * the primary component, so the public name is set here).
 */
export const componentMeta = {
    importName: "Carousel",
    description:
        "Embla-based carousel. Carousel.Root (orientation horizontal|vertical, opts, plugins, setApi) > Carousel.Content > Carousel.Item per slide. Controls: Carousel.PrevTrigger / Carousel.NextTrigger (bare triggers you style), Carousel.Arrows (a ready-styled 20px prev/next chevron pair for a header row, each dimmed to 50% at the end it cannot scroll past), Carousel.IndicatorGroup > Carousel.Indicator for dots. Arrow keys scroll the carousel unless focus is in a widget that owns them (radiogroup, listbox, grid, tablist, menu, slider, text fields). When focus lands on a slide that is partly out of view the carousel scrolls it into view with the least movement.",
    variants: { orientation: ["horizontal", "vertical"] },
    a11y: "Renders a region; Carousel.Arrows buttons are disabled at the ends. Carousel.Arrows has no visible text, give the surrounding header row a heading that names the carousel. Scrolling respects prefers-reduced-motion on focus.",
    doNot: [
        "Do not hand-roll horizontal scroll rows with arrow buttons -- use Carousel.",
        "Do not nest a second carousel or a component that handles left/right arrows without role-based semantics inside slides.",
    ],
    examples: [
        {
            title: "Header row with arrows",
            code: '<Carousel.Root>\n  <div className="flex items-center justify-between">\n    <span className="text-sm font-medium text-primary">Eyewear</span>\n    <Carousel.Arrows />\n  </div>\n  <Carousel.Content className="gap-2">\n    {items.map((item) => (\n      <Carousel.Item key={item.id}>{item.name}</Carousel.Item>\n    ))}\n  </Carousel.Content>\n</Carousel.Root>',
        },
    ],
};
