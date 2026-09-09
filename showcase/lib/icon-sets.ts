import * as icons from "@/components/foundations/icons";
import * as integrationIcons from "@/components/foundations/integration-icons";
import * as paymentIcons from "@/components/foundations/payment-icons";
import * as socialIcons from "@/components/foundations/social-icons";

export const iconSets = {
    icons: { label: "Icons", importPath: "@/components/foundations/icons", module: icons },
    "payment-icons": { label: "Payment Icons", importPath: "@/components/foundations/payment-icons", module: paymentIcons },
    "integration-icons": { label: "Integration Icons", importPath: "@/components/foundations/integration-icons", module: integrationIcons },
    "social-icons": { label: "Social Icons", importPath: "@/components/foundations/social-icons", module: socialIcons },
} as const;

export type IconSetId = keyof typeof iconSets;
