import type { FC } from "react";
import * as AccordionDemos from "@/components/application/accordion/accordion.demo";

export default {
    title: "Application/Accordions",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const SingleOpen = () => <AccordionDemos.SingleOpenDemo />;
SingleOpen.storyName = "Single-open (default)";

export const MultiOpen = () => <AccordionDemos.MultiOpenDemo />;
MultiOpen.storyName = "Multi-open (allowsMultipleExpanded)";

export const Controlled = () => <AccordionDemos.ControlledDemo />;
Controlled.storyName = "Controlled expanded state";

export const DisabledItem = () => <AccordionDemos.DisabledItemDemo />;
DisabledItem.storyName = "Disabled item";

export const EmptyPanel = () => <AccordionDemos.EmptyPanelDemo />;
EmptyPanel.storyName = "Empty panel content";

export const LongContent = () => <AccordionDemos.LongContentDemo />;
LongContent.storyName = "Long panel content (natural expand)";

export const Nested = () => <AccordionDemos.NestedDemo />;
Nested.storyName = "Nested accordion";

export const Sizes = () => <AccordionDemos.SizesDemo />;
