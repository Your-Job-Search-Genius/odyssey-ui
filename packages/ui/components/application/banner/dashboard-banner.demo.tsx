"use client";

import { DashboardBanner } from "@/components/application/banner/dashboard-banner";
import { FractalGlass } from "@/components/application/modals/fractal-glass";
import { Button } from "@/components/base/buttons/button";
import { ArrowRight02SharpIcon } from "@/components/foundations/hugeicons";

const logo = new URL("./story-assets/bettershot-logo.png", import.meta.url).href;

/** The Figma art: the splash modal's fractal glass, faded out towards the bottom, with the product logo. */
const BettershotArt = () => (
    <>
        {/* White under the glass: its stripes overlay-blend, so over nothing (or a grey page) they show as grey bars. */}
        <div className="absolute inset-0 overflow-hidden rounded-[20px] bg-primary mask-[linear-gradient(to_bottom,black_12.6%,transparent_84.5%)]">
            <FractalGlass className="left-[172px] h-full overflow-visible mask-none" />
        </div>
        <img src={logo} alt="" className="absolute top-5 left-34 h-4 w-25 object-cover object-top" />
    </>
);

export const DashboardBannerDemo = () => (
    <DashboardBanner
        className="w-[1230px] max-w-full"
        title="Over 3 million are generating headshots with BetterShot. Get Yours in 3 easy steps"
        action={
            <Button color="secondary-brand" size="md" href="#" iconTrailing={ArrowRight02SharpIcon}>
                Create Headshot
            </Button>
        }
        media={<BettershotArt />}
    />
);
