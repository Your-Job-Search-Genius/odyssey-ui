"use client";

import { ShootCard } from "@/components/application/headshot/shoot-card";

const cover = "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80";

export const ShootCardDemo = ({ src = cover }: { src?: string }) => (
    <ShootCard
        href="#"
        tag="Shoot for Graduation"
        src={src}
        alt="Smiling woman with curly hair in a pink cardigan"
        count={23}
        countLabel="Portraits"
        date="Dec 2026"
        className="w-full max-w-[378px]"
    />
);

/** Activity Library: three columns, 11px apart. */
export const ActivityLibraryDemo = ({ src = cover }: { src?: string }) => (
    <div className="grid w-full grid-cols-1 gap-[11px] sm:grid-cols-2 lg:grid-cols-3">
        {["Shoot for Graduation", "LinkedIn refresh", "Conference badge"].map((tag, index) => (
            <ShootCard key={tag} href="#" tag={tag} src={src} alt={`Cover photo of ${tag}`} count={23 - index * 5} countLabel="Portraits" date="Dec 2026" />
        ))}
    </div>
);
