import type { PlaygroundSchema } from "~/lib/playground-types";
import { Button } from "@/components/base/buttons/button";

const schema: PlaygroundSchema = {
    component: Button,
    componentName: "Button",
    defaultProps: {
        children: "Button CTA",
        size: "sm",
        color: "primary",
        isDisabled: false,
        isLoading: false,
    },
    controls: [
        { prop: "size", type: "select", options: ["xs", "sm", "md", "lg", "xl"] },
        {
            prop: "color",
            type: "select",
            options: [
                "primary",
                "secondary",
                "tertiary",
                "link-color",
                "link-gray",
                "primary-destructive",
                "secondary-destructive",
                "tertiary-destructive",
                "link-destructive",
            ],
        },
        { prop: "children", type: "text", label: "Text" },
        { prop: "isDisabled", type: "boolean" },
        { prop: "isLoading", type: "boolean" },
    ],
    childrenProp: "children",
};

export default schema;
