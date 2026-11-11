"use client";

import { ModelChip } from "@/components/application/headshot/model-chip";

export const ModelChipDemo = ({
    avatarSrc = "https://www.untitledui.com/images/avatars/drew-cano?fm=webp&q=80",
    size,
}: {
    avatarSrc?: string;
    size?: "md" | "sm" | "responsive";
}) => <ModelChip name="Malik" avatarSrc={avatarSrc} size={size} onPressChange={() => {}} />;

/** Phone: the chip hugs its content (`size="sm"`; `"responsive"` switches at `md`). */
export const PhoneDemo = () => <ModelChipDemo size="sm" />;

/** Several models across the selected outfits: text only, no avatar. */
export const MixDemo = () => <ModelChip name="Showing Mix" onPressChange={() => {}} />;
