"use client";

import Link from "next/link";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { ArrowRight, Grid01, LayersTwo01, Package, PuzzlePiece01 } from "@/components/foundations/icons";

const categories = [
    {
        href: "/docs/base-components",
        title: "Base Components",
        description: "Buttons, inputs, selects, badges, and every other foundational form and display control.",
        icon: PuzzlePiece01,
    },
    {
        href: "/docs/application",
        title: "Application",
        description: "Higher-order patterns: modals, tables, date pickers, charts, navigation, and more.",
        icon: LayersTwo01,
    },
    {
        href: "/docs/foundations",
        title: "Foundations",
        description: "Icons, featured icons, logos, and the visual primitives everything else is built from.",
        icon: Grid01,
    },
    {
        href: "/docs/shared-assets",
        title: "Shared Assets",
        description: "Illustrations, credit cards, background patterns, and other reusable marketing assets.",
        icon: Package,
    },
];

export default function HomePage() {
    return (
        <main className="mx-auto flex max-w-container flex-1 flex-col items-center px-4 py-20 text-center md:py-28">
            <span className="rounded-full bg-brand-secondary px-3 py-1 text-sm font-medium text-brand-secondary">Component showcase</span>
            <h1 className="mt-6 max-w-3xl text-display-md font-semibold text-primary md:text-display-lg">Writesea Odyssey</h1>
            <p className="mt-4 max-w-2xl text-lg text-tertiary">
                A React 19 + Tailwind CSS + React Aria component library. Browse every component with live, interactive previews, real code, and props you can
                actually test.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button size="lg" href="/docs" iconTrailing={ArrowRight}>
                    Browse components
                </Button>
                <Button size="lg" color="secondary" href="/docs/getting-started/introduction">
                    Getting started
                </Button>
            </div>

            <div className="mt-20 grid w-full grid-cols-1 gap-5 text-left sm:grid-cols-2">
                {categories.map((category) => (
                    <Link
                        key={category.href}
                        href={category.href}
                        className="group flex flex-col gap-4 rounded-2xl border border-secondary bg-primary p-6 text-left transition duration-100 ease-linear hover:border-brand hover:shadow-sm"
                    >
                        <FeaturedIcon icon={category.icon} color="brand" theme="light" size="lg" />
                        <div>
                            <h2 className="text-lg font-semibold text-primary">{category.title}</h2>
                            <p className="mt-1 text-sm text-tertiary">{category.description}</p>
                        </div>
                        <span className="mt-auto flex items-center gap-1 text-sm font-semibold text-brand-secondary">
                            Explore
                            <ArrowRight className="size-4 transition duration-100 ease-linear group-hover:translate-x-0.5" />
                        </span>
                    </Link>
                ))}
            </div>
        </main>
    );
}
