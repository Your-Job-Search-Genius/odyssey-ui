"use client";

import { useState } from "react";
import { ResultTile } from "@/components/application/headshot/result-tile";

export const BasicDemo = () => {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <ResultTile
            src="https://www.untitledui.com/images/avatars/olivia-rhye"
            alt="Headshot 1"
            isFavorite={isFavorite}
            onFavoriteChange={setIsFavorite}
            onOpen={() => {}}
            onDownload={() => {}}
        />
    );
};
