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

/** Phone frame `14839:181942`, the card (370 wide): Edit Details inline after the subtitle, details wrap with the dot ending line 1, no next arrow or fade. Shoot at a 402px viewport. */
export const FigmaPhone = () => (
    <div data-compare className="inline-flex w-[370px] flex-col items-start gap-4 bg-white p-0">
        <Demos.ReviewCardDemo selfieSrc={portrait} lookSrc={man} />
    </div>
);
