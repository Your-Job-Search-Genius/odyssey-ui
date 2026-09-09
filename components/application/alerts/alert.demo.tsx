"use client";

import { useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { Alert, Toaster, toast } from "./alert";

export const ColorsAlertDemo = () => {
    return (
        <div className="flex w-full max-w-md flex-col gap-4">
            <Alert color="info" title="New feature available" description="You can now export your reports directly to CSV or PDF." />
            <Alert color="success" title="Changes saved" description="Your profile has been updated successfully." />
            <Alert color="warning" title="Storage almost full" description="You've used 90% of your available storage. Consider upgrading your plan." />
            <Alert color="error" title="Payment failed" description="We couldn't process your last payment. Please update your billing details." />
        </div>
    );
};

export const DismissibleAlertDemo = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) {
        return (
            <Button size="sm" color="secondary" onPress={() => setIsVisible(true)}>
                Reset
            </Button>
        );
    }

    return (
        <div className="w-full max-w-md">
            <Alert
                color="warning"
                title="Unsaved changes"
                description="You have unsaved changes that will be lost if you navigate away."
                onDismiss={() => setIsVisible(false)}
            />
        </div>
    );
};

export const AlertWithActionsDemo = () => {
    return (
        <div className="w-full max-w-md">
            <Alert
                color="error"
                title="Subscription expired"
                description="Your team has lost access to premium features. Renew now to avoid interruption."
                actions={
                    <>
                        <Button size="sm" color="primary-destructive">
                            Renew now
                        </Button>
                        <Button size="sm" color="link-gray">
                            Dismiss
                        </Button>
                    </>
                }
            />
        </div>
    );
};

export const ToastDemo = () => {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <Button size="md" color="secondary" onPress={() => toast.info("Heads up", { description: "A new version is available." })}>
                Info toast
            </Button>
            <Button size="md" color="secondary" onPress={() => toast.success("Changes saved", { description: "Your changes were saved successfully." })}>
                Success toast
            </Button>
            <Button size="md" color="secondary" onPress={() => toast.warning("Low balance", { description: "Your account balance is running low." })}>
                Warning toast
            </Button>
            <Button
                size="md"
                color="secondary"
                onPress={() =>
                    toast.error("Something went wrong", {
                        description: "We couldn't save your changes. Try again.",
                        duration: Infinity,
                        actions: (
                            <Button size="sm" color="link-color">
                                Retry
                            </Button>
                        ),
                    })
                }
            >
                Persistent error toast
            </Button>

            {/* Mount once — every `toast()` call anywhere in the tree renders here. */}
            <Toaster position="bottom-right" />
        </div>
    );
};
