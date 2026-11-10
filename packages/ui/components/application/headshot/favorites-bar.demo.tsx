"use client";

import { FavoritesBar } from "@/components/application/headshot/favorites-bar";

export const EmptyDemo = () => <FavoritesBar count={0} />;

export const WithFavoritesDemo = () => (
    <FavoritesBar
        count={8}
        thumbnails={["https://www.untitledui.com/images/avatars/olivia-rhye", "https://www.untitledui.com/images/avatars/phoenix-baker"]}
        onFavoritesPress={() => {}}
        feedbackTitle="Get Feedback from Friends on your Favourites"
        onShare={() => {}}
    />
);
