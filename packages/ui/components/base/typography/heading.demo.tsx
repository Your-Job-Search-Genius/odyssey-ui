"use client";

import { Heading } from "@/components/base/typography/heading";

export const Default = () => (
    <div className="flex flex-col items-start gap-3">
        <Heading level={1}>Heading level 1</Heading>
        <Heading level={2}>Heading level 2</Heading>
        <Heading level={3}>Heading level 3</Heading>
        <Heading level={4}>Heading level 4</Heading>
        <Heading level={5}>Heading level 5</Heading>
        <Heading level={6}>Heading level 6</Heading>
    </div>
);

export const SizeOverride = () => (
    <div className="flex flex-col items-start gap-3">
        <Heading level={2} size={4}>
            Semantically an h2, visually styled like a level 4 heading
        </Heading>
        <Heading level={4}>Level 4 heading, for comparison</Heading>
    </div>
);
