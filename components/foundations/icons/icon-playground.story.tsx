import type { FC } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as Icons from "@/components/foundations/icons";

type IconName = keyof typeof Icons;

const iconNames = Object.keys(Icons) as IconName[];
const DEFAULT_ICON: IconName = iconNames.includes("Home01" as IconName) ? ("Home01" as IconName) : iconNames[0];

interface IconPlaygroundProps {
    icon: IconName;
    size?: number;
    color?: string;
    strokeWidth?: number;
    className?: string;
}

const IconPlayground: FC<IconPlaygroundProps> = ({ icon, size = 24, color = "currentColor", strokeWidth, className }) => {
    const Icon = Icons[icon] || Icons[DEFAULT_ICON];
    const safeSize = Number.isFinite(size) && size! > 0 ? size : 24;

    return (
        <div className="flex min-h-56 w-full flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-secondary bg-secondary p-12">
            <Icon size={safeSize} color={color} strokeWidth={strokeWidth} className={className} />
            <span className="font-mono text-xs text-tertiary">{icon}</span>
        </div>
    );
};

const meta = {
    title: "Foundations/Icons/Playground",
    component: IconPlayground,
    argTypes: {
        icon: {
            control: { type: "select" },
            options: iconNames,
            description: `Any of the ${iconNames.length} icons exported from components/foundations/icons`,
        },
        size: {
            control: { type: "number", min: 8, max: 128, step: 1 },
        },
        color: {
            control: { type: "color" },
        },
        strokeWidth: {
            control: { type: "number", min: 0.5, max: 4, step: 0.25 },
        },
        className: {
            control: { type: "text" },
            description: 'Tailwind utility override, e.g. "size-6 text-fg-brand-primary" (wins over the size/color controls)',
        },
    },
    args: {
        icon: DEFAULT_ICON,
        size: 24,
        color: "currentColor",
        strokeWidth: 2,
        className: "",
    },
} satisfies Meta<typeof IconPlayground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        icon: "HeartOctagon",
        size: 40,
        color: "#ff0000",
        strokeWidth: 1,
        className: "\n",
    },
};

export const TailwindClasses: Story = {
    name: "Tailwind size/color classes",
    args: {
        className: "size-10 text-fg-brand-primary",
    },
};
