import * as Demos from "@/components/application/headshot/review-card.demo";

export default { title: "Application/Headshot/Review card" };

const portrait = new URL("./story-assets/portrait.jpg", import.meta.url).href;
const man = new URL("./story-assets/favorite.jpg", import.meta.url).href;

export const Default = () => <Demos.ReviewCardDemo />;

/** `figma/review-card.png`: 734 wide. */
export const Figma = () => (
    <div data-compare className="inline-flex w-[734px] flex-col items-start gap-4 bg-white p-0">
        <Demos.ReviewCardDemo selfieSrc={portrait} lookSrc={man} />
    </div>
);
