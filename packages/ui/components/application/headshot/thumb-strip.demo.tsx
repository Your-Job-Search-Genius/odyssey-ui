"use client";

import { useState } from "react";
import { ThumbStrip } from "@/components/application/headshot/thumb-strip";

const photos = [
    { src: "https://www.untitledui.com/images/avatars/olivia-rhye", alt: "Photo 1" },
    { src: "https://www.untitledui.com/images/avatars/phoenix-baker", alt: "Photo 2" },
];

export const BasicDemo = () => {
    const [selected, setSelected] = useState(0);

    return (
        <div className="rounded-3xl bg-inverse p-6">
            <ThumbStrip photos={photos} slots={5} selectedIndex={selected} onSelect={setSelected} onAdd={() => {}} />
        </div>
    );
};
