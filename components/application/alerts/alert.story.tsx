import type { FC } from "react";
import * as AlertDemos from "@/components/application/alerts/alert.demo";

export default {
    title: "Application/Alerts",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-start justify-center bg-secondary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Colors = () => <AlertDemos.ColorsAlertDemo />;

export const Dismissible = () => <AlertDemos.DismissibleAlertDemo />;

export const WithActions = () => <AlertDemos.AlertWithActionsDemo />;
WithActions.storyName = "With actions";

export const Toasts = () => <AlertDemos.ToastDemo />;
