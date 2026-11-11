"use client";

import { useState } from "react";
import { AnchorNav } from "@/components/application/tabs/anchor-nav";
import { HijabIcon, UserAccountIcon } from "@/components/foundations/hugeicons";

const items = [
    { id: "basic", href: "#basic-details", label: "Basic Details", icon: UserAccountIcon },
    { id: "features", href: "#facial-features", label: "Facial Features", icon: HijabIcon },
];

/** Persona side nav; a real screen updates `currentId` from the scroll position too. */
export const AnchorNavDemo = ({ defaultId = "features" }: { defaultId?: string }) => {
    const [currentId, setCurrentId] = useState(defaultId);

    return <AnchorNav aria-label="Persona sections" items={items} currentId={currentId} onNavigate={setCurrentId} />;
};
