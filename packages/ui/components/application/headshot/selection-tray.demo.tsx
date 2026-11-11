"use client";

import { useState } from "react";
import { SelectionTray } from "@/components/application/headshot/selection-tray";
import { Button } from "@/components/base/buttons/button";
import { InformationCircleIcon } from "@/components/foundations/hugeicons";

const photo = "https://www.untitledui.com/images/avatars/drew-cano?fm=webp&q=80";

const InfoButton = ({ size }: { size: "size-5" | "size-6" }) => (
    // In the app this opens the "how selection works" popover.
    <button type="button" aria-label="About your selection" className="rounded-full text-fg-primary outline-focus-ring focus-visible:outline-2">
        <InformationCircleIcon aria-hidden="true" className={size} />
    </button>
);

export const SelectionTrayDemo = ({ src = photo }: { src?: string }) => {
    const [items, setItems] = useState(
        ["Black T-Shirt and Leather Jacket", "Navy Suit", "Grey Blazer", "Oxford Shirt"].map((alt, index) => ({ id: String(index), src, alt })),
    );

    return (
        <SelectionTray
            items={items}
            max={4}
            onRemove={(id) => setItems((prev) => prev.filter((item) => item.id !== id))}
            info={<InfoButton size={items.length ? "size-6" : "size-5"} />}
            className="w-full max-w-[362px]"
        >
            <Button size="lg" className="w-full" isDisabled={items.length === 0}>
                {items.length === 4 ? "Create Headshot" : "Review Shoot"}
            </Button>
        </SelectionTray>
    );
};

export const EmptySelectionTrayDemo = () => <SelectionTray items={[]} max={1} info={<InfoButton size="size-5" />} className="w-full max-w-[361px]" />;
