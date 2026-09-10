"use client";

import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/base/buttons/button";

export const BasicDemo = () => (
    <SlideoutMenu.Trigger>
        <Button size="md" color="secondary">
            Open menu
        </Button>
        <SlideoutMenu>
            {({ close }) => (
                <>
                    <SlideoutMenu.Header onClose={close}>
                        <p className="text-lg font-semibold text-primary">Account settings</p>
                        <p className="mt-1 text-sm text-tertiary">Manage your profile, notifications, and billing.</p>
                    </SlideoutMenu.Header>
                    <SlideoutMenu.Content>
                        <p className="text-sm text-tertiary">
                            Focus is trapped inside this panel, background scroll is locked, and it dismisses on <kbd>Esc</kbd> or an outside click.
                        </p>
                    </SlideoutMenu.Content>
                    <SlideoutMenu.Footer className="flex justify-end gap-3">
                        <Button color="secondary" onPress={close}>
                            Cancel
                        </Button>
                        <Button color="primary" onPress={close}>
                            Save
                        </Button>
                    </SlideoutMenu.Footer>
                </>
            )}
        </SlideoutMenu>
    </SlideoutMenu.Trigger>
);

export const WithFormDemo = () => (
    <SlideoutMenu.Trigger>
        <Button size="md" color="secondary">
            Invite member
        </Button>
        <SlideoutMenu>
            {({ close }) => (
                <>
                    <SlideoutMenu.Header onClose={close}>
                        <p className="text-lg font-semibold text-primary">Invite team member</p>
                        <p className="mt-1 text-sm text-tertiary">They'll receive an email invitation to join your workspace.</p>
                    </SlideoutMenu.Header>
                    <SlideoutMenu.Content>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-secondary">Email address</span>
                            <input
                                type="email"
                                placeholder="olivia@example.com"
                                className="rounded-lg bg-primary px-3.5 py-2.5 text-md text-primary ring-1 ring-primary outline-hidden ring-inset placeholder:text-placeholder"
                            />
                        </label>
                    </SlideoutMenu.Content>
                    <SlideoutMenu.Footer className="flex justify-end gap-3">
                        <Button color="secondary" onPress={close}>
                            Cancel
                        </Button>
                        <Button color="primary" onPress={close}>
                            Send invite
                        </Button>
                    </SlideoutMenu.Footer>
                </>
            )}
        </SlideoutMenu>
    </SlideoutMenu.Trigger>
);
