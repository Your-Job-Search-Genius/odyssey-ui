import * as Demos from "./bottom-bar.demo";

export default { title: "Application/Bottom bar" };

export const Default = () => (
    <div className="min-h-[200vh] bg-primary p-4 text-sm text-tertiary">
        Scroll: the bar stays pinned to the bottom of the viewport.
        <Demos.BottomBarDemo />
    </div>
);
Default.globals = { viewport: { value: "mobile" } };

/** P40 (14853:231227): the bar at the bottom of a 402px-wide slice of the mobile frame (compare against the PNG cropped to 162px). */
export const Figma = () => (
    <div data-compare className="relative inline-flex h-[162px] w-[402px] [transform:translateZ(0)] flex-col items-start gap-4 overflow-hidden bg-white p-0">
        <Demos.BottomBarDemo className="absolute md:block" />
    </div>
);
