"use client";

import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { BottomSheet } from "./bottom-sheet";

export const BasicBottomSheetDemo = () => {
    return (
        <BottomSheet.Trigger>
            <Button size="md">Open bottom sheet</Button>
            <BottomSheet size="md">
                {({ close }) => (
                    <>
                        <BottomSheet.Header onClose={close}>
                            <p className="text-lg font-semibold text-primary">Filters</p>
                            <p className="mt-1 text-sm text-tertiary">Drag the handle down, tap the backdrop, or press Esc to dismiss.</p>
                        </BottomSheet.Header>
                        <BottomSheet.Content>
                            <p className="text-sm text-tertiary">
                                Built on the same `ModalOverlay`/`Modal`/`Dialog` primitives as `Modal` and `Drawer`, so it inherits focus trapping, background
                                scroll locking, and outside-click/Escape dismissal for free. A drag handle adds touch-friendly swipe-to-dismiss on top.
                            </p>
                        </BottomSheet.Content>
                        <BottomSheet.Footer className="flex justify-end gap-3">
                            <Button color="secondary" onPress={close}>
                                Reset
                            </Button>
                            <Button color="primary" onPress={close}>
                                Apply filters
                            </Button>
                        </BottomSheet.Footer>
                    </>
                )}
            </BottomSheet>
        </BottomSheet.Trigger>
    );
};

export const ActionListBottomSheetDemo = () => {
    const actions = ["Share", "Duplicate", "Rename", "Move to folder", "Delete"];

    return (
        <BottomSheet.Trigger>
            <Button size="md" color="secondary">
                Post options
            </Button>
            <BottomSheet size="sm">
                {({ close }) => (
                    <>
                        <BottomSheet.Header onClose={close}>
                            <p className="text-lg font-semibold text-primary">Post options</p>
                        </BottomSheet.Header>
                        <BottomSheet.Content className="gap-0 pb-2">
                            {actions.map((action) => (
                                <button
                                    key={action}
                                    type="button"
                                    onClick={close}
                                    className={
                                        "w-full rounded-lg px-2 py-3 text-left text-sm font-medium text-secondary transition duration-100 ease-linear hover:bg-primary_hover"
                                    }
                                >
                                    {action}
                                </button>
                            ))}
                        </BottomSheet.Content>
                    </>
                )}
            </BottomSheet>
        </BottomSheet.Trigger>
    );
};

export const LongContentBottomSheetDemo = () => {
    return (
        <BottomSheet.Trigger>
            <Button size="md" color="secondary">
                What&apos;s new
            </Button>
            <BottomSheet size="md">
                {({ close }) => (
                    <>
                        <BottomSheet.Header onClose={close}>
                            <div className="flex items-center gap-2">
                                <p className="text-lg font-semibold text-primary">What&apos;s new</p>
                                <Badge color="brand" size="sm">
                                    v2.4
                                </Badge>
                            </div>
                        </BottomSheet.Header>
                        <BottomSheet.Content>
                            {Array.from({ length: 8 }).map((_, index) => (
                                <div key={index} className="flex flex-col gap-1 border-b border-secondary pb-4 last:border-none">
                                    <p className="text-sm font-semibold text-primary">Update {index + 1}</p>
                                    <p className="text-sm text-tertiary">
                                        This is placeholder changelog copy that demonstrates the sheet's internal scroll region staying independent from its
                                        fixed header and footer.
                                    </p>
                                </div>
                            ))}
                        </BottomSheet.Content>
                        <BottomSheet.Footer>
                            <Button color="primary" className="w-full" onPress={close}>
                                Got it
                            </Button>
                        </BottomSheet.Footer>
                    </>
                )}
            </BottomSheet>
        </BottomSheet.Trigger>
    );
};
