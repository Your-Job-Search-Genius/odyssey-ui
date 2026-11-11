"use client";

import { useState } from "react";
import { ThumbStrip } from "@/components/application/headshot/thumb-strip";

const photos = [
    { src: "https://www.untitledui.com/images/avatars/olivia-rhye", alt: "Photo 1" },
    // Shows the square the member kept in the crop step.
    { src: "https://www.untitledui.com/images/avatars/phoenix-baker", alt: "Photo 2", crop: { x: 0.2, y: 0.1, size: 0.6 } },
];

export const BasicDemo = () => {
    const [selected, setSelected] = useState(0);

    return (
        <div className="rounded-3xl bg-inverse p-6">
            <ThumbStrip photos={photos} slots={5} selectedIndex={selected} onSelect={setSelected} onAdd={() => {}} />
        </div>
    );
};
