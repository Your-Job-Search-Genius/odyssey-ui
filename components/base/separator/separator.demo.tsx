"use client";

import { Button } from "@/components/base/buttons/button";
import { Separator } from "@/components/base/separator/separator";

export const HorizontalDemo = () => (
    <div className="flex w-80 flex-col gap-4">
        <p className="text-sm text-secondary">Section one content sits above the line.</p>
        <Separator />
        <p className="text-sm text-secondary">Section two content sits below the line.</p>
    </div>
);

export const VerticalDemo = () => (
    <div className="flex h-10 items-center gap-3 text-sm text-secondary">
        <span>Profile</span>
        <Separator orientation="vertical" />
        <span>Settings</span>
        <Separator orientation="vertical" />
        <span>Billing</span>
    </div>
);

export const LabeledDemo = () => (
    <div className="flex w-80 flex-col gap-4">
        <Button size="md" color="secondary" className="w-full">
            Continue with Google
        </Button>
        <Separator>OR</Separator>
        <Button size="md" color="secondary" className="w-full">
            Continue with email
        </Button>
    </div>
);

export const ToolbarDemo = () => (
    <div className="flex items-center gap-2 rounded-lg bg-primary p-2 ring-1 ring-secondary ring-inset">
        <Button size="sm" color="tertiary">
            Bold
        </Button>
        <Button size="sm" color="tertiary">
            Italic
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <Button size="sm" color="tertiary">
            Left
        </Button>
        <Button size="sm" color="tertiary">
            Center
        </Button>
        <Button size="sm" color="tertiary">
            Right
        </Button>
    </div>
);

export const DecorativeDemo = () => (
    <figure className="flex w-80 flex-col gap-3">
        <blockquote className="text-sm text-secondary">"Great components are invisible until you need them, then they're exactly right."</blockquote>
        {/* elementType="div" removes the separator role — purely decorative here since the
            figcaption below already conveys the boundary between quote and attribution. */}
        <Separator elementType="div" className="w-12" />
        <figcaption className="text-sm text-tertiary">Design systems team</figcaption>
    </figure>
);

export const InFlexAndGridDemo = () => (
    <div className="flex w-80 flex-col gap-6">
        <div>
            <p className="mb-2 text-sm font-medium text-primary">Flex row, vertical separator</p>
            <div className="flex h-8 items-stretch gap-2 rounded-md bg-secondary p-1">
                <div className="flex-1 rounded-sm bg-primary" />
                <Separator orientation="vertical" />
                <div className="flex-1 rounded-sm bg-primary" />
            </div>
        </div>

        <div>
            <p className="mb-2 text-sm font-medium text-primary">Grid, horizontal separator spanning a row</p>
            <div className="grid grid-cols-2 gap-2">
                <div className="rounded-sm bg-secondary p-2 text-center text-sm">A</div>
                <div className="rounded-sm bg-secondary p-2 text-center text-sm">B</div>
                <div className="col-span-2">
                    <Separator />
                </div>
                <div className="rounded-sm bg-secondary p-2 text-center text-sm">C</div>
                <div className="rounded-sm bg-secondary p-2 text-center text-sm">D</div>
            </div>
        </div>
    </div>
);
