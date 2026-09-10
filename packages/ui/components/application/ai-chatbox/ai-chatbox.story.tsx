import type { FC } from "react";
import * as AIChatboxDemos from "@/components/application/ai-chatbox/ai-chatbox.demo";

export default {
    title: "Application/AI Chatbox",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-secondary p-4">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <AIChatboxDemos.BasicChatboxDemo />;

export const ChipsLayout = () => <AIChatboxDemos.ChipsLayoutChatboxDemo />;
ChipsLayout.storyName = "Artifacts — pinned chips";

export const NoArtifacts = () => <AIChatboxDemos.NoArtifactsChatboxDemo />;

export const CustomFocusRing = () => <AIChatboxDemos.CustomFocusRingChatboxDemo />;

export const Launcher = () => <AIChatboxDemos.LauncherChatboxDemo />;
Launcher.storyName = "Collapsed launcher bubble";

export const FloatingOpen = () => <AIChatboxDemos.FloatingOpenChatboxDemo />;
FloatingOpen.storyName = "Floating widget — open";

export const BarCollapse = () => <AIChatboxDemos.BarCollapseChatboxDemo />;
BarCollapse.storyName = "Collapsed to header bar";
