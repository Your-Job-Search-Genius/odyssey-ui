import type { FC } from "react";
import * as ModalDemos from "@/components/application/modals/modal.demo";

export default {
    title: "Application/Modals",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-white p-4">
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

// Figma (BetterShot) patterns, rendered open for screenshot comparison. Screenshot `[role=dialog]`.
export const SelectionDialog = () => <ModalDemos.SelectionDialogDemo />;
export const FigmaSelectionDialog = () => <ModalDemos.SelectionDialogDemo defaultOpen />;
export const FigmaSelectionList = () => <ModalDemos.SelectionListDialogDemo defaultOpen />;
export const FigmaGuidance = () => <ModalDemos.GuidanceModalDemo defaultOpen />;
export const FigmaBrowseAll = () => <ModalDemos.BrowseAllModalDemo defaultOpen />;
export const FigmaSplash = () => <ModalDemos.SplashModalDemo defaultOpen />;
/** The board's light selection dialog (17102:121905, 372×433): `variant="light-inset"`. */
export const FigmaLightSelectionDialog = () => <ModalDemos.SelectionDialogDemo variant="light-inset" defaultOpen />;

const phone402 = { viewport: { options: { phone402: { name: "Phone 402", styles: { width: "402px", height: "691px" } } } } };

/** Purpose dialog on a phone (16160:63119): `mobileLayout="bottom"`, edge to edge and flush with the bottom. */
export const FigmaLightSelectionDialogPhone = () => <ModalDemos.SelectionDialogDemo variant="light-inset" mobileLayout="bottom" defaultOpen />;
FigmaLightSelectionDialogPhone.parameters = phone402;
FigmaLightSelectionDialogPhone.globals = { viewport: { value: "phone402" } };

/** Splash on a phone (14866:351502): `mobileLayout="bottom"`, 17px from the top. */
export const FigmaSplashPhone = () => <ModalDemos.SplashModalDemo mobileLayout="bottom" defaultOpen />;
FigmaSplashPhone.parameters = phone402;
FigmaSplashPhone.globals = { viewport: { value: "phone402" } };

export const FigmaCameraShell = () => <ModalDemos.CameraModalShellDemo defaultOpen />;

/** `mobileLayout="fullscreen"` at 390px: edge to edge, no radius, fills the dynamic viewport. */
export const FigmaCameraShellMobile = () => <ModalDemos.CameraModalShellDemo defaultOpen />;
FigmaCameraShellMobile.parameters = { viewport: { options: { phone390: { name: "Phone 390", styles: { width: "390px", height: "844px" } } } } };
FigmaCameraShellMobile.globals = { viewport: { value: "phone390" } };
export const FigmaPhotoSlotShell = () => <ModalDemos.PhotoSlotModalShellDemo defaultOpen />;
export const FigmaCropShell = () => <ModalDemos.CropModalShellDemo defaultOpen />;
export const FigmaModelPickerShell = () => <ModalDemos.ModelPickerModalShellDemo defaultOpen />;

/** `mobileLayout="fullscreen"`: the Dialog fills the screen, so the floating footer sits at the bottom edge. */
export const FigmaModelPickerShellPhone = () => <ModalDemos.ModelPickerModalShellDemo defaultOpen />;
FigmaModelPickerShellPhone.parameters = phone402;
FigmaModelPickerShellPhone.globals = { viewport: { value: "phone402" } };
export const FigmaBackgroundPickerShell = () => <ModalDemos.BackgroundPickerModalShellDemo defaultOpen />;
