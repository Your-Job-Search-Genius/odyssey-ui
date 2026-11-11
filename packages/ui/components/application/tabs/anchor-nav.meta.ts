export const componentMeta = {
    description:
        'In-page section links (BetterShot persona side nav). AnchorNav (items: { id, href, label, icon? }[], currentId, onNavigate(id), aria-label default "Sections", plus nav attributes) renders a vertical nav of plain <a href="#section"> links, 12px apart: a 28px icon (20% opacity until current) and a Medium 14 label; the current link is SemiBold text-secondary with the icon in brand colour. The caller decides which section is current (e.g. from the scroll position).',
    variants: {},
    a11y: 'A nav landmark (name it with aria-label) of native links; the current one has aria-current="true", so the state is not carried by colour alone. Icons are aria-hidden. Each href must point at an element id on the page (give the target a heading).',
    doNot: [
        "Do not use Tabs for in-page anchors -- a tablist hides the other panels.",
        "Do not use it for page-to-page navigation; use the sidebar or header navigation.",
    ],
    examples: [
        {
            title: "Persona sections",
            code: '<AnchorNav aria-label="Persona sections" currentId={inView} items={[{ id: "basic", href: "#basic-details", label: "Basic Details", icon: UserAccountIcon }, { id: "features", href: "#facial-features", label: "Facial Features", icon: HijabIcon }]} />',
        },
    ],
};
