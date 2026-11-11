"use client";

import { useState } from "react";
import { ModelSwitcher, ModelSwitcherOption } from "@/components/application/headshot/model-switcher";

const avatar = (name: string) => `https://www.untitledui.com/images/avatars/${name}?fm=webp&q=80`;

const MODELS = [
    { id: "drew", name: "Drew", src: avatar("drew-cano") },
    { id: "olly", name: "Olly", src: avatar("olly-schroeder") },
    { id: "phoenix", name: "Phoenix", src: avatar("phoenix-baker") },
    { id: "lana", name: "Lana", src: avatar("lana-steiner") },
    { id: "demi", name: "Demi", src: avatar("demi-wilkinson") },
];

export const ModelSwitcherDemo = ({ defaultValue = "mix" }: { defaultValue?: string }) => {
    const [value, setValue] = useState(defaultValue);
    return (
        <ModelSwitcher label="Who wears the outfits" value={value} onChange={setValue}>
            <ModelSwitcherOption value="mix" name="Mix" srcs={MODELS.slice(0, 3).map((m) => m.src)} />
            {MODELS.map((m) => (
                <ModelSwitcherOption key={m.id} value={m.id} name={m.name} src={m.src} />
            ))}
        </ModelSwitcher>
    );
};

/** A person picked instead of the mix. */
export const PickedDemo = () => <ModelSwitcherDemo defaultValue="phoenix" />;

/** Narrow container: the strip scrolls sideways. */
export const NarrowDemo = () => (
    <div className="w-80">
        <ModelSwitcherDemo />
    </div>
);
