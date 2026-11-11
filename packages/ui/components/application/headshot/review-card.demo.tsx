"use client";

import { ReviewCard } from "@/components/application/headshot/review-card";
import { Button } from "@/components/base/buttons/button";

const selfie = "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80";
const look = "https://www.untitledui.com/images/avatars/drew-cano?fm=webp&q=80";

export const ReviewCardDemo = ({ selfieSrc = selfie, lookSrc = look }: { selfieSrc?: string; lookSrc?: string }) => (
    <ReviewCard
        name="Moremi Sunfyre"
        subtitle="Woman"
        attributes={[
            { label: "Eye Color", value: "Blue" },
            { label: "Hair Style", value: "Style 4" },
            { label: "Facial Hair", value: "Full Beard" },
        ]}
        action={
            <Button size="xs" color="secondary-brand">
                Edit Details
            </Button>
        }
        className="w-full max-w-[734px]"
        headingLevel={2}
    >
        <ReviewCard.Section
            headingLevel={3}
            title="Selfies"
            count={5}
            action={
                <Button size="xs" color="secondary-brand">
                    Edit Photos
                </Button>
            }
        >
            {/* Runs through the section's right padding to its edge, like the looks carousel; scrollable by keyboard too. */}
            <div
                role="group"
                aria-label="Selfies"
                tabIndex={0}
                className="-mr-3.5 flex gap-2 overflow-x-auto pr-3.5 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2"
            >
                {Array.from({ length: 5 }, (_, index) => (
                    <ReviewCard.Photo key={index} src={selfieSrc} alt={`Selfie ${index + 1}`} />
                ))}
            </div>
        </ReviewCard.Section>
        {/* The board crops the looks section 10px under the photos. */}
        <ReviewCard.Section
            headingLevel={3}
            className="pb-2.5"
            title="Looks"
            count={12}
            action={
                <Button size="xs" color="secondary-brand">
                    Edit Looks
                </Button>
            }
        >
            <ReviewCard.Carousel aria-label="Looks">
                {Array.from({ length: 12 }, (_, index) => (
                    <ReviewCard.Photo
                        key={index}
                        src={lookSrc}
                        alt={`Look ${index + 1}`}
                        backgroundLabel="Bgd."
                        backgroundSrc={lookSrc}
                        className="h-[168px] w-[134px]"
                    />
                ))}
            </ReviewCard.Carousel>
        </ReviewCard.Section>
    </ReviewCard>
);
