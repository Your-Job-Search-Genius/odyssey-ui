import * as Demos from "./bottom-bar.demo";

export default { title: "Application/Bottom bar" };

export const Default = () => (
    <div className="min-h-[200vh] bg-primary p-4 text-sm text-tertiary">
        Scroll: the bar stays pinned to the bottom of the viewport.
        <Demos.BottomBarDemo />
    </div>
);
Default.globals = { viewport: { value: "mobile" } };

/** P40 (14853:229395): the bar at the bottom of the visible viewport, a 402×134 slice of the mobile frame ending at Safari's toolbar (y 660–794). */
export const Figma = () => (
    <div data-compare className="relative inline-flex h-[134px] w-[402px] [transform:translateZ(0)] flex-col items-start gap-4 overflow-hidden bg-white p-0">
        <Demos.BottomBarDemo className="absolute md:block" />
    </div>
);
