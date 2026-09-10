"use client";

import { useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { AlertTriangle, CheckCircle, Trash01 } from "@/components/foundations/icons";
import { Dialog, DialogTrigger, Modal, ModalBody, ModalFooter, ModalHeader, ModalOverlay } from "./modal";

export const BasicModalDemo = () => {
    return (
        <DialogTrigger>
            <Button size="md">Open modal</Button>
            <ModalOverlay>
                <Modal>
                    <Dialog>
                        {({ close }) => (
                            <>
                                <ModalHeader title="Update account" description="Make changes to your account details below." onClose={close} />
                                <ModalBody>
                                    <p>
                                        This is a standard modal built from the <code>Modal</code>, <code>Dialog</code>, <code>ModalHeader</code>,{" "}
                                        <code>ModalBody</code>, and <code>ModalFooter</code> primitives. It traps focus, locks background scroll, and dismisses
                                        on <kbd>Esc</kbd> or an outside click.
                                    </p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onPress={close}>
                                        Cancel
                                    </Button>
                                    <Button color="primary" onPress={close}>
                                        Save changes
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    );
};

export const ConfirmationModalDemo = () => {
    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <DialogTrigger>
            <Button size="md" color="secondary-destructive" iconLeading={Trash01}>
                Delete account
            </Button>
            <ModalOverlay isDismissable={!isDeleting}>
                <Modal size="sm">
                    <Dialog role="alertdialog">
                        {({ close }) => (
                            <>
                                <ModalHeader
                                    icon={AlertTriangle}
                                    iconColor="error"
                                    title="Delete account"
                                    description="Are you sure you want to delete your account? This action cannot be undone."
                                    onClose={close}
                                />
                                <ModalFooter>
                                    <Button color="secondary" isDisabled={isDeleting} onPress={close}>
                                        Cancel
                                    </Button>
                                    <Button
                                        color="primary-destructive"
                                        isLoading={isDeleting}
                                        onPress={() => {
                                            setIsDeleting(true);
                                            // Simulate an async delete request before dismissing.
                                            window.setTimeout(() => {
                                                setIsDeleting(false);
                                                close();
                                            }, 1200);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    );
};

export const SuccessModalDemo = () => {
    return (
        <DialogTrigger>
            <Button size="md">Complete payment</Button>
            <ModalOverlay>
                <Modal size="sm">
                    <Dialog>
                        {({ close }) => (
                            <>
                                <ModalHeader
                                    icon={CheckCircle}
                                    iconColor="success"
                                    title="Payment successful"
                                    description="Your payment has been processed. A receipt has been sent to your email."
                                    onClose={close}
                                />
                                <ModalFooter>
                                    <Button color="primary" onPress={close}>
                                        Done
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    );
};

export const SizesModalDemo = () => {
    const sizes = ["sm", "md", "lg", "xl"] as const;

    return (
        <div className="flex flex-wrap items-center gap-3">
            {sizes.map((size) => (
                <DialogTrigger key={size}>
                    <Button size="md" color="secondary">
                        {size.toUpperCase()}
                    </Button>
                    <ModalOverlay>
                        <Modal size={size}>
                            <Dialog>
                                {({ close }) => (
                                    <>
                                        <ModalHeader
                                            title={`Size: "${size}"`}
                                            description="Resize the viewport to see how each size behaves on mobile."
                                            onClose={close}
                                        />
                                        <ModalBody>
                                            <p>This dialog panel is constrained to the {size} max-width breakpoint on `sm` and larger screens.</p>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="secondary" onPress={close}>
                                                Close
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </Dialog>
                        </Modal>
                    </ModalOverlay>
                </DialogTrigger>
            ))}
        </div>
    );
};
