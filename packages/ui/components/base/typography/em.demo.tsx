"use client";

import { Em } from "@/components/base/typography/em";
import { Paragraph } from "@/components/base/typography/paragraph";

export const Default = () => (
    <Paragraph className="max-w-md">
        We <Em>strongly</Em> recommend reviewing your changes before publishing them.
    </Paragraph>
);
