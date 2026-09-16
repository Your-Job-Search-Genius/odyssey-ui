"use client";

const categorical = [
    { slot: 1, name: "Brand", light: "brand-600", dark: "brand-500" },
    { slot: 2, name: "Lime", light: "lime-600", dark: "lime-600" },
    { slot: 3, name: "Cyan", light: "cyan-600", dark: "cyan-600" },
    { slot: 4, name: "Orange", light: "orange-700", dark: "orange-600" },
    { slot: 5, name: "Sky", light: "sky-500", dark: "sky-600" },
    { slot: 6, name: "Amber", light: "amber-600", dark: "amber-600" },
    { slot: 7, name: "Blue", light: "blue-600", dark: "blue-600" },
    { slot: 8, name: "Emerald", light: "emerald-500", dark: "emerald-600" },
];

/** The eight categorical series slots, in their fixed assignment order. */
export const ChartPaletteCategorical = () => (
    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
        {categorical.map((slot) => (
            <div key={slot.slot} className="overflow-hidden rounded-lg ring-1 ring-secondary">
                <div className="h-10" style={{ backgroundColor: `var(--color-chart-${slot.slot})` }} />
                <div className="px-3 py-2">
                    <p className="text-xs font-semibold text-primary">
                        {slot.slot} · {slot.name}
                    </p>
                    <p className="text-xs text-quaternary">
                        --color-chart-{slot.slot}
                        <br />
                        {slot.light} / {slot.dark}
                    </p>
                </div>
            </div>
        ))}
    </div>
);

/** Sequential, diverging and status ramps used for magnitude, polarity and state. */
export const ChartPaletteRamps = () => (
    <div className="flex w-full flex-col gap-5">
        <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-primary">Sequential · brand ramp</p>
            <p className="text-xs text-tertiary">Magnitude. One hue, light to dark. `--color-chart-sequential-1` … `-7`.</p>
            <div className="grid h-7 grid-cols-7 gap-0.5 overflow-hidden rounded-lg">
                {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                    <div key={step} style={{ backgroundColor: `var(--color-chart-sequential-${step})` }} />
                ))}
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-primary">Diverging · orange ↔ brand</p>
            <p className="text-xs text-tertiary">Polarity around a neutral midpoint. `--color-chart-diverging-negative`, `-mid`, `-positive`.</p>
            <div className="grid h-7 grid-cols-3 gap-0.5 overflow-hidden rounded-lg">
                <div style={{ backgroundColor: "var(--color-chart-diverging-negative)" }} />
                <div style={{ backgroundColor: "var(--color-chart-diverging-mid)" }} />
                <div style={{ backgroundColor: "var(--color-chart-diverging-positive)" }} />
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-primary">Status · reserved</p>
            <p className="text-xs text-tertiary">Only when a value means good or bad, and always paired with an icon or label.</p>
            <div className="grid h-7 grid-cols-3 gap-0.5 overflow-hidden rounded-lg">
                <div className="bg-fg-success-primary" />
                <div className="bg-fg-warning-primary" />
                <div className="bg-fg-error-primary" />
            </div>
        </div>
    </div>
);
