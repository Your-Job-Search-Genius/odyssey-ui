"use client";

import { useState } from "react";
import { BackgroundTile, BackgroundTileGroup } from "@/components/application/headshot/background-tile";

const office = "https://www.untitledui.com/react/application/plants.webp";

const backgrounds = [
    { id: "office", label: "Office", src: office },
    { id: "studio", label: "Studio", swatch: "linear-gradient(#D4CFC8, #E8E4DD 45%, #C9C4BB)" },
    { id: "grey", label: "Grey", swatch: "linear-gradient(#9B9B9B, #6F6F6F)" },
    { id: "navy", label: "Navy", swatch: "linear-gradient(#2E3D5C, #1B2438)" },
    { id: "sand", label: "Sand", swatch: "linear-gradient(#E9DCC6, #CBB89A)" },
    { id: "white", label: "White", swatch: "linear-gradient(#FFFFFF, #E9EAEB)" },
];

/** The tile grid inside the background picker's left panel. */
export const BackgroundTileGridDemo = ({ src }: { src?: string }) => {
    const [value, setValue] = useState("office");

    return (
        <div className="inline-flex rounded-[20px] bg-inverse-subtle p-4">
            <BackgroundTileGroup aria-label="Background" value={value} onChange={setValue}>
                {backgrounds.map((background) => (
                    <BackgroundTile
                        key={background.id}
                        value={background.id}
                        label={background.label}
                        src={background.id === "office" && src ? src : background.src}
                        swatch={background.swatch}
                    />
                ))}
            </BackgroundTileGroup>
        </div>
    );
};

export const SelectedBackgroundTileDemo = ({ src = office }: { src?: string }) => (
    <BackgroundTileGroup aria-label="Background" defaultValue="office" className="block">
        <BackgroundTile value="office" label="Office" src={src} swatch="linear-gradient(#D4CFC8, #E8E4DD 45%, #C9C4BB)" />
    </BackgroundTileGroup>
);

/** The phone picker's grid: 4 fluid columns (`size="sm"`; `"responsive"` switches at `md`). */
export const PhoneBackgroundTileGridDemo = ({ src }: { src?: string }) => {
    const [value, setValue] = useState("office");

    return (
        <BackgroundTileGroup aria-label="Background" size="sm" value={value} onChange={setValue} className="w-[370px]">
            {backgrounds.map((background) => (
                <BackgroundTile
                    key={background.id}
                    size="sm"
                    value={background.id}
                    label={background.label}
                    src={background.id === "office" && src ? src : background.src}
                    swatch={background.swatch}
                />
            ))}
        </BackgroundTileGroup>
    );
};
