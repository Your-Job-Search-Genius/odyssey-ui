"use client";

import { Text } from "@/components/base/typography/text";

export const Default = () => <Text>Inline text with no size override, inheriting the ambient size.</Text>;

export const Sizes = () => (
    <div className="flex flex-col items-start gap-2">
        <Text size="xs">Extra small text</Text>
        <Text size="sm">Small text</Text>
        <Text size="md">Medium text</Text>
        <Text size="lg">Large text</Text>
        <Text size="xl">Extra large text</Text>
    </div>
);

export const Colors = () => (
    <div className="flex flex-col items-start gap-2">
        <Text color="text-primary">Primary text</Text>
        <Text color="text-secondary">Secondary text</Text>
        <Text color="text-tertiary">Tertiary text</Text>
        <Text color="text-brand-primary">Brand text</Text>
        <Text color="text-error-primary">Error text</Text>
    </div>
);
