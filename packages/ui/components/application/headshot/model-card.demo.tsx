"use client";

import { useState } from "react";
import { ModelCard, ModelCardGroup } from "@/components/application/headshot/model-card";

const avatar = (name: string) => `https://www.untitledui.com/images/avatars/${name}?fm=webp&q=80`;

const models = [
    { id: "malik", name: "Malik", src: avatar("drew-cano") },
    { id: "theo", name: "Theo", src: avatar("abraham-baker") },
    { id: "jun", name: "Jun", src: avatar("adem-lane") },
    { id: "omar", name: "Omar", src: avatar("ammar-foley") },
];

/** The grid inside the dark model picker; the shell itself is the picker modal. */
export const ModelCardGridDemo = ({ src }: { src?: string }) => {
    const [value, setValue] = useState("malik");

    return (
        <div className="w-full max-w-[856px] rounded-[20px] bg-inverse p-4">
            <ModelCardGroup aria-label="Model for outfit try-ons" value={value} onChange={setValue}>
                {models.map((model) => (
                    <ModelCard key={model.id} value={model.id} name={model.name} src={src ?? model.src} />
                ))}
            </ModelCardGroup>
        </div>
    );
};

/** One card, selected. */
export const SelectedModelCardDemo = ({ src = models[0].src }: { src?: string }) => (
    <ModelCardGroup aria-label="Model for outfit try-ons" defaultValue="malik" className="block w-[197px]">
        <ModelCard value="malik" name="Malik" src={src} />
    </ModelCardGroup>
);
