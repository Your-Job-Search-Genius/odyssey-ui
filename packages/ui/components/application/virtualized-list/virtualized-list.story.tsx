import type { FC } from "react";
import * as VirtualizedListDemos from "@/components/application/virtualized-list/virtualized-list.demo";

export default {
    title: "Application/Virtualized lists",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-secondary p-8">
                <div className="w-full max-w-2xl">
                    <Story />
                </div>
            </div>
        ),
    ],
};

export const BasicLargeList = () => <VirtualizedListDemos.BasicLargeListDemo />;
BasicLargeList.storyName = "12,000 rows, fixed height";

export const VariableHeight = () => <VirtualizedListDemos.VariableHeightDemo />;
VariableHeight.storyName = "Variable row height (ResizeObserver)";

export const ServerSynced = () => <VirtualizedListDemos.ServerSyncedDemo />;
ServerSynced.storyName = "Server-synced infinite scroll + search";

export const Selectable = () => <VirtualizedListDemos.SelectableDemo />;
Selectable.storyName = "Multi-selectable rows";

export const EmptyState = () => <VirtualizedListDemos.EmptyStateDemo />;
EmptyState.storyName = "Empty state (zero results)";
