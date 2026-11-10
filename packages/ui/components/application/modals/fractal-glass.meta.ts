export const componentMeta = {
    description:
        'Decorative "fractal glass" hero art for a splash modal: soft colour blocks seen through 53px vertical glass stripes, fading into the panel below. Pure CSS, aria-hidden, pointer-events-none. Absolutely positioned at the top of its nearest positioned ancestor (e.g. a Dialog), 437px tall; put the modal\'s content below it. Takes div attributes; className can reposition or resize it (it is also reused as the media art of DashboardBanner).',
    variants: {},
    a11y: 'Purely decorative: it is aria-hidden="true" and ignores pointer events, so it must never carry information or controls.',
    doNot: ["Do not put content inside it; it renders its own children.", "Do not use it outside a positioned container; it is absolutely positioned."],
    examples: [
        {
            title: "Splash modal hero",
            code: '<Dialog className="relative overflow-hidden">\n  <FractalGlass />\n  <div className="relative pt-[300px]">…modal content…</div>\n</Dialog>',
        },
    ],
};
