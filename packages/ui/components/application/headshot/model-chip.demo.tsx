"use client";

import { ModelChip } from "@/components/application/headshot/model-chip";

export const ModelChipDemo = ({ avatarSrc = "https://www.untitledui.com/images/avatars/drew-cano?fm=webp&q=80" }: { avatarSrc?: string }) => (
    <ModelChip name="Malik" avatarSrc={avatarSrc} onPressChange={() => {}} />
);

/** Several models across the selected outfits: text only, no avatar. */
export const MixDemo = () => <ModelChip name="Showing Mix" onPressChange={() => {}} />;
