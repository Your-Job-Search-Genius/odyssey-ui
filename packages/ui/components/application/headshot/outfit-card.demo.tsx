"use client";

import { useState } from "react";
import { OutfitCard } from "@/components/application/headshot/outfit-card";

const outfits = [
    { id: "jacket", caption: "Black T-Shirt and Leather Jacket" },
    { id: "suit", caption: "Navy Suit and White Shirt" },
    { id: "blazer", caption: "Grey Blazer and Turtleneck" },
    { id: "shirt", caption: "Oxford Shirt" },
    { id: "polo", caption: "Knit Polo" },
    { id: "sweater", caption: "Crew-neck Sweater" },
];

const photo = "https://www.untitledui.com/images/avatars/drew-cano?fm=webp&q=80";
const office = "https://www.untitledui.com/react/application/plants.webp";

/** Pick up to `max` outfits; the rest dim and disable once the limit is reached. */
export const OutfitGridDemo = ({ max = 2, src = photo, backgroundSrc = office }: { max?: number; src?: string; backgroundSrc?: string }) => {
    const [selected, setSelected] = useState<string[]>(["jacket"]);

    return (
        <div className="grid w-full max-w-[748px] grid-cols-2 gap-x-3.5 gap-y-[30px] sm:grid-cols-3">
            {outfits.map((outfit) => {
                const isSelected = selected.includes(outfit.id);
                return (
                    <OutfitCard
                        key={outfit.id}
                        src={src}
                        caption={outfit.caption}
                        backgroundSrc={backgroundSrc}
                        isSelected={isSelected}
                        isDisabled={!isSelected && selected.length >= max}
                        onChange={(next) => setSelected((prev) => (next ? [...prev, outfit.id] : prev.filter((id) => id !== outfit.id)))}
                    />
                );
            })}
        </div>
    );
};

export const SelectedOutfitCardDemo = ({ src = photo, backgroundSrc = office }: { src?: string; backgroundSrc?: string }) => (
    <OutfitCard src={src} caption="Black T-Shirt and Leather Jacket" backgroundSrc={backgroundSrc} defaultSelected className="w-60" />
);
