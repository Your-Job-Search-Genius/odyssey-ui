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

export const ResumeToast = () => <AlertDemos.ResumeToastDemo />;

/** Figma P37. */
export const FigmaToast = () => <AlertDemos.FigmaToastDemo />;

/** Figma P08, padded like the Figma export (which includes the shadow). */
export const FigmaResumeToast = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white px-10 pt-5 pb-7">
        <AlertDemos.ResumeToastDemo />
    </div>
);
