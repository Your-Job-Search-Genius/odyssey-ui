import type { FC } from "react";
import { FavoritesBar } from "@/components/application/headshot/favorites-bar";
import * as Demos from "@/components/application/headshot/favorites-bar.demo";

const favorite = new URL("./story-assets/favorite.jpg", import.meta.url).href;

export default {
    title: "Application/Headshot/Favorites bar",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Empty = () => <Demos.EmptyDemo />;

export const WithFavorites = () => <Demos.WithFavoritesDemo />;

export const Figma = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white p-0">
        <FavoritesBar count={8} thumbnails={[favorite, favorite]} feedbackTitle="Get Feedback from Friends on your Favourites" onShare={() => {}} />
    </div>
);

export const FigmaEmpty = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white p-0">
        <FavoritesBar count={0} />
    </div>
);
