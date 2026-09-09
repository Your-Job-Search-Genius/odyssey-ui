"use client";

import { Button } from "@/components/base/buttons/button";
import { Drawer, type DrawerPlacement } from "./drawer";

const placementLabels: Record<DrawerPlacement, string> = {
    left: "Left",
    right: "Right",
    top: "Top",
    bottom: "Bottom",
};

export const PlacementsDrawerDemo = () => {
    const placements: DrawerPlacement[] = ["left", "right", "top", "bottom"];

    return (
        <div className="flex flex-wrap items-center gap-3">
            {placements.map((placement) => (
                <Drawer.Trigger key={placement}>
                    <Button size="md" color="secondary">
                        {placementLabels[placement]}
                    </Button>
                    <Drawer placement={placement} size="md">
                        {({ close }) => (
                            <>
                                <Drawer.Header onClose={close}>
                                    <p className="text-lg font-semibold text-primary">{placementLabels[placement]} drawer</p>
                                    <p className="mt-1 text-sm text-tertiary">This panel slides in from the {placement} edge of the viewport.</p>
                                </Drawer.Header>
                                <Drawer.Content>
                                    <p className="text-sm text-tertiary">
                                        Focus is trapped inside this panel, background scroll is locked, and it dismisses on <kbd>Esc</kbd> or an outside click.
                                    </p>
                                </Drawer.Content>
                                <Drawer.Footer className="flex justify-end gap-3">
                                    <Button color="secondary" onPress={close}>
                                        Cancel
                                    </Button>
                                    <Button color="primary" onPress={close}>
                                        Save
                                    </Button>
                                </Drawer.Footer>
                            </>
                        )}
                    </Drawer>
                </Drawer.Trigger>
            ))}
        </div>
    );
};

export const SizesDrawerDemo = () => {
    const sizes = ["sm", "md", "lg", "xl"] as const;

    return (
        <div className="flex flex-wrap items-center gap-3">
            {sizes.map((size) => (
                <Drawer.Trigger key={size}>
                    <Button size="md" color="secondary">
                        {size.toUpperCase()}
                    </Button>
                    <Drawer placement="right" size={size}>
                        {({ close }) => (
                            <>
                                <Drawer.Header onClose={close}>
                                    <p className="text-lg font-semibold text-primary">Size: &quot;{size}&quot;</p>
                                </Drawer.Header>
                                <Drawer.Content>
                                    <p className="text-sm text-tertiary">This panel is constrained to the {size} width.</p>
                                </Drawer.Content>
                            </>
                        )}
                    </Drawer>
                </Drawer.Trigger>
            ))}
        </div>
    );
};

export const FormDrawerDemo = () => {
    return (
        <Drawer.Trigger>
            <Button size="md">Edit profile</Button>
            <Drawer placement="right" size="md">
                {({ close }) => (
                    <>
                        <Drawer.Header onClose={close}>
                            <p className="text-lg font-semibold text-primary">Edit profile</p>
                            <p className="mt-1 text-sm text-tertiary">Update your personal details.</p>
                        </Drawer.Header>
                        <Drawer.Content>
                            <label className="flex flex-col gap-1.5 text-sm">
                                <span className="font-medium text-secondary">Full name</span>
                                <input
                                    className="rounded-lg border border-primary bg-primary px-3 py-2 text-primary outline-none focus:ring-2 focus:ring-brand"
                                    defaultValue="Olivia Rhye"
                                />
                            </label>
                            <label className="flex flex-col gap-1.5 text-sm">
                                <span className="font-medium text-secondary">Email</span>
                                <input
                                    className="rounded-lg border border-primary bg-primary px-3 py-2 text-primary outline-none focus:ring-2 focus:ring-brand"
                                    defaultValue="olivia@example.com"
                                />
                            </label>
                        </Drawer.Content>
                        <Drawer.Footer className="flex justify-end gap-3">
                            <Button color="secondary" onPress={close}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={close}>
                                Save changes
                            </Button>
                        </Drawer.Footer>
                    </>
                )}
            </Drawer>
        </Drawer.Trigger>
    );
};
