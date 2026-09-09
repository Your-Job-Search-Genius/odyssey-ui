"use client";

import { RatingStars } from "@/components/foundations/rating-stars";

export const BasicDemo = () => <RatingStars rating={4} />;

export const PartialRatingDemo = () => <RatingStars rating={3.5} />;

export const CustomStarCountDemo = () => <RatingStars rating={7} stars={10} />;

export const AllRatingsDemo = () => (
    <div className="flex flex-col gap-3">
        {[0, 1, 2, 3, 3.5, 4, 5].map((rating) => (
            <div key={rating} className="flex items-center gap-3">
                <RatingStars rating={rating} />
                <span className="text-sm text-tertiary">{rating}</span>
            </div>
        ))}
    </div>
);
