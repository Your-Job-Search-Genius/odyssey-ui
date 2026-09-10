import type { FC } from "react";
import * as ModalDemos from "@/components/application/modals/modal.demo";

export default {
    title: "Application/Modals",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-secondary p-4">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <ModalDemos.BasicModalDemo />;

export const Confirmation = () => <ModalDemos.ConfirmationModalDemo />;
Confirmation.storyName = "Destructive confirmation";

export const Success = () => <ModalDemos.SuccessModalDemo />;
Success.storyName = "Success confirmation";

export const Sizes = () => <ModalDemos.SizesModalDemo />;
