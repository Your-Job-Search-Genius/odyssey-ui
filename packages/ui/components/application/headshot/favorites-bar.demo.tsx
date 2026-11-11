"use client";

import { useState } from "react";
import { FavoritesBar } from "@/components/application/headshot/favorites-bar";

export const EmptyDemo = () => <FavoritesBar count={0} />;

export const WithFavoritesDemo = () => {
    const [isActive, setIsActive] = useState(false);
    return (
        <FavoritesBar
            size="responsive"
            count={8}
            thumbnails={["https://www.untitledui.com/images/avatars/olivia-rhye", "https://www.untitledui.com/images/avatars/phoenix-baker"]}
            isFavoritesActive={isActive}
            onFavoritesPress={() => setIsActive((active) => !active)}
            feedbackTitle="Get Feedback from Friends on your Favourites"
            onShare={() => {}}
        />
    );
};

/** No feedback prompt or share action: just the tab. */
export const TabOnlyDemo = () => (
    <FavoritesBar
        count={3}
        thumbnails={["https://www.untitledui.com/images/avatars/olivia-rhye", "https://www.untitledui.com/images/avatars/phoenix-baker"]}
        onFavoritesPress={() => {}}
    />
);
