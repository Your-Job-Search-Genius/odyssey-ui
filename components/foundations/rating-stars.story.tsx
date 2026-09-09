import type { FC } from "react";
import * as RatingStarsDemos from "@/components/foundations/rating-stars.demo";

export default {
    title: "Foundations/Rating stars",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <RatingStarsDemos.BasicDemo />;

export const PartialRating = () => <RatingStarsDemos.PartialRatingDemo />;

export const CustomStarCount = () => <RatingStarsDemos.CustomStarCountDemo />;

export const AllRatings = () => <RatingStarsDemos.AllRatingsDemo />;
