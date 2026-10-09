import type { CSSProperties } from "react";

export interface Orb {
    size: number;
    color: "var(--sp-orb-1)" | "var(--sp-orb-2)" | "var(--sp-orb-3)";
    opacity: number;
    position: Pick<CSSProperties, "top" | "left" | "right" | "bottom">;
}

/** The blurred background color spots each mockup page places behind its content. */
export function SiteOrbs({ orbs }: { orbs: Orb[] }) {
    return (
        <>
            {orbs.map((orb, i) => (
                <div
                    key={i}
                    className="sp-orb"
                    aria-hidden="true"
                    style={{ width: orb.size, height: orb.size, background: orb.color, opacity: orb.opacity, ...orb.position }}
                />
            ))}
        </>
    );
}
