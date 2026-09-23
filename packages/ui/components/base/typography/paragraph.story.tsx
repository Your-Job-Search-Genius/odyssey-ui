import type { FC } from "react";
import * as ParagraphDemos from "@/components/base/typography/paragraph.demo";

export default {
    title: "Base components/Typography",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Paragraph = () => <ParagraphDemos.Default />;
