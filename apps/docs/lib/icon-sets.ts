import * as icons from "@/components/foundations/icons";
import * as integrationIcons from "@/components/foundations/integration-icons";
import * as paymentIcons from "@/components/foundations/payment-icons";
import * as socialIcons from "@/components/foundations/social-icons";

// importPath is what visitors copy to their own app, so it is the
// published package specifier -- the local "@/" alias only exists inside
// this monorepo (the imports above use it because this file compiles here).
export const iconSets = {
    icons: { label: "Icons", importPath: "@your-job-search-genius/odyssey-ui/components/foundations/icons", module: icons },
    "payment-icons": { label: "Payment Icons", importPath: "@your-job-search-genius/odyssey-ui/components/foundations/payment-icons", module: paymentIcons },
    "integration-icons": {
        label: "Integration Icons",
        importPath: "@your-job-search-genius/odyssey-ui/components/foundations/integration-icons",
        module: integrationIcons,
    },
    "social-icons": { label: "Social Icons", importPath: "@your-job-search-genius/odyssey-ui/components/foundations/social-icons", module: socialIcons },
} as const;

export type IconSetId = keyof typeof iconSets;
