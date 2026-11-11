import { ShootCard } from "@/components/application/headshot/shoot-card";
import * as Demos from "@/components/application/headshot/shoot-card.demo";

export default { title: "Application/Headshot/Shoot card" };

const face = new URL("./story-assets/face.jpg", import.meta.url).href;

export const Default = () => <Demos.ShootCardDemo />;

export const ActivityLibrary = () => <Demos.ActivityLibraryDemo />;

/** Live board "Activity Card" (`17097:39331`, Preview 16): 378×423. */
export const Figma = () => (
    <div data-compare className="inline-flex w-[378px] flex-col items-start gap-4 bg-white p-0">
        <ShootCard
            href="#"
            tag="Spring Career Fair 2026"
            src={face}
            alt="Smiling woman with curly hair in a pink cardigan"
            count={23}
            countLabel="Portraits"
            date="Dec 2026"
            className="h-[423px] w-full"
        />
    </div>
);

/** No cover yet: the placeholder takes the photo's place. */
export const Generating = () => (
    <div className="w-[378px]">
        <ShootCard tag="LinkedIn refresh" alt="" placeholder="Generating…" count={0} countLabel="Portraits" date="Nov 2026" />
    </div>
);
