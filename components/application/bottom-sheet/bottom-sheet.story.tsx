import type { FC } from "react";
import * as BottomSheetDemos from "@/components/application/bottom-sheet/bottom-sheet.demo";

export default {
    title: "Application/Bottom sheets",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-end justify-center bg-secondary p-4 sm:items-center">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <BottomSheetDemos.BasicBottomSheetDemo />;

export const ActionList = () => <BottomSheetDemos.ActionListBottomSheetDemo />;
ActionList.storyName = "Action list";

export const LongContent = () => <BottomSheetDemos.LongContentBottomSheetDemo />;
LongContent.storyName = "Long scrollable content";
