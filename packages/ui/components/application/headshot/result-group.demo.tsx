"use client";

import { ResultGroup } from "@/components/application/headshot/result-group";
import { ResultTile } from "@/components/application/headshot/result-tile";

export const BasicDemo = () => (
    <ResultGroup
        thumbnail={{ src: "https://www.untitledui.com/images/avatars/olivia-rhye", alt: "" }}
        eyebrow="OUTFIT 1"
        count={2}
        countLabel="Photos"
        title="White T-Shirt and Leather Jacket"
    >
        <ResultTile src="https://www.untitledui.com/images/avatars/olivia-rhye" alt="Headshot 1" onOpen={() => {}} onDownload={() => {}} />
        <ResultTile src="https://www.untitledui.com/images/avatars/phoenix-baker" alt="Headshot 2" isFavorite onOpen={() => {}} onDownload={() => {}} />
    </ResultGroup>
);
