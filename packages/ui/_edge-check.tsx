/* Temporary edge-case harness: renders every chart demo plus hostile inputs in jsdom and fails on thrown errors, React warnings, or NaN/Infinity in the markup. */
import { createRequire } from "node:module";
import type { ReactElement } from "react";

const require = createRequire(import.meta.url);
const { JSDOM } = require("../../node_modules/.pnpm/jsdom@27.4.0_supports-color@8.1.1/node_modules/jsdom");
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { pretendToBeVisual: true });
const w = dom.window as unknown as typeof globalThis & Window;
Object.defineProperty(globalThis, "navigator", { value: w.navigator, configurable: true });
Object.assign(globalThis, {
    window: w,
    document: w.document,
    HTMLElement: w.HTMLElement,
    SVGElement: w.SVGElement,
    Element: w.Element,
    Node: w.Node,
    Event: w.Event,
    FocusEvent: w.FocusEvent,
    KeyboardEvent: w.KeyboardEvent,
    getComputedStyle: w.getComputedStyle.bind(w),
    requestAnimationFrame: w.requestAnimationFrame.bind(w),
    cancelAnimationFrame: w.cancelAnimationFrame.bind(w),
    IS_REACT_ACT_ENVIRONMENT: true,
});
(globalThis as unknown as { CSS: unknown }).CSS = { escape: (v: string) => v, supports: () => false };
class RO {
    observe() {}
    unobserve() {}
    disconnect() {}
}
(w as unknown as { ResizeObserver: unknown }).ResizeObserver = RO;
(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = RO;
w.matchMedia = ((query: string) => ({
    matches: query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
})) as unknown as typeof w.matchMedia;
w.Element.prototype.getBoundingClientRect = function () {
    return { width: 600, height: 240, top: 0, left: 0, right: 600, bottom: 240, x: 0, y: 0, toJSON() {} } as DOMRect;
};
(w.SVGElement.prototype as unknown as { getTotalLength: () => number }).getTotalLength = () => 100;

const errors: string[] = [];
const origError = console.error;
const origWarn = console.warn;
const record = (...args: unknown[]) => {
    const text = args.map(String).join(" ");
    if (text.includes("Reduced Motion enabled")) return; // motion's own advisory, not a chart problem
    errors.push(text.slice(0, 300));
};
console.error = record;
console.warn = record;

async function main() {
    const React = await import("react");
    (globalThis as unknown as { React: unknown }).React = React;
    const { act } = React;
    const { createRoot } = await import("react-dom/client");

    const { LineChart } = await import("./components/application/charts/line-chart");
    const { BarChart } = await import("./components/application/charts/bar-chart");
    const { PieChart } = await import("./components/application/charts/pie-chart");
    const { RadialChart } = await import("./components/application/charts/radial-chart");
    const { RadarChart } = await import("./components/application/charts/radar-chart");
    const { ScatterChart } = await import("./components/application/charts/scatter-chart");
    const { HeatmapChart } = await import("./components/application/charts/heatmap-chart");
    const { TreemapChart } = await import("./components/application/charts/treemap-chart");
    const { SunburstChart } = await import("./components/application/charts/sunburst-chart");
    const { FunnelChart } = await import("./components/application/charts/funnel-chart");
    const { SankeyChart } = await import("./components/application/charts/sankey-chart");
    const { Sparkline } = await import("./components/application/charts/sparkline");
    const { StatTile } = await import("./components/application/charts/stat-tile");

    const demos: Record<string, Record<string, unknown>> = {
        line: await import("./components/application/charts/line-chart.demo"),
        bar: await import("./components/application/charts/bar-chart.demo"),
        pie: await import("./components/application/charts/pie-chart.demo"),
        radial: await import("./components/application/charts/radial-chart.demo"),
        radar: await import("./components/application/charts/radar-chart.demo"),
        scatter: await import("./components/application/charts/scatter-chart.demo"),
        heatmap: await import("./components/application/charts/heatmap-chart.demo"),
        treemap: await import("./components/application/charts/treemap-chart.demo"),
        sunburst: await import("./components/application/charts/sunburst-chart.demo"),
        funnel: await import("./components/application/charts/funnel-chart.demo"),
        sankey: await import("./components/application/charts/sankey-chart.demo"),
        sparkline: await import("./components/application/charts/sparkline.demo"),
        stat: await import("./components/application/charts/stat-tile.demo"),
        chart: await import("./components/application/charts/chart.demo"),
    };

    const h = React.createElement;
    const long = "An extraordinarily long category label that should never fit inside any axis margin";
    const cases: Array<[string, ReactElement]> = [];
    for (const [group, mod] of Object.entries(demos)) {
        for (const [name, Comp] of Object.entries(mod)) {
            if (typeof Comp === "function" && /^[A-Z]/.test(name)) cases.push([`demo:${group}:${name}`, h(Comp as React.FC)]);
        }
    }
    const one = [{ w: "W1", a: 5, b: -3 }];
    const neg = [
        { w: "W1", a: -5, b: 3 },
        { w: "W2", a: -8, b: -1 },
        { w: long, a: 2, b: 0 },
    ];
    cases.push(
        ["line:single", h(LineChart, { label: "l", data: one, xKey: "w", series: [{ key: "a" }] })],
        ["line:single-stacked", h(LineChart, { label: "l", data: one, xKey: "w", series: [{ key: "a" }, { key: "b" }], variant: "stacked-area", showEndLabels: true, showDots: true })],
        ["line:negative-area", h(LineChart, { label: "l", data: neg, xKey: "w", series: [{ key: "a" }, { key: "b" }], variant: "area", showEndLabels: true })],
        ["line:zero-domain", h(LineChart, { label: "l", data: neg, xKey: "w", series: [{ key: "a" }], yDomain: [0, 0] })],
        ["line:all-zero", h(LineChart, { label: "l", data: [{ w: "a", a: 0 }, { w: "b", a: 0 }], xKey: "w", series: [{ key: "a" }] })],
        ["bar:single-v", h(BarChart, { label: "b", data: one, xKey: "w", series: [{ key: "a" }], showValues: true })],
        ["bar:single-h", h(BarChart, { label: "b", data: one, xKey: "w", series: [{ key: "a" }, { key: "b" }], orientation: "horizontal", showValues: true })],
        ["bar:stacked-single", h(BarChart, { label: "b", data: one, xKey: "w", series: [{ key: "a" }], mode: "stacked", showValues: true })],
        ["bar:diverging-neg", h(BarChart, { label: "b", data: neg, xKey: "w", series: [{ key: "a" }], mode: "diverging", orientation: "horizontal", showValues: true })],
        ["bar:grouped-neg", h(BarChart, { label: "b", data: neg, xKey: "w", series: [{ key: "a" }, { key: "b" }], showValues: true })],
        ["bar:stacked-neg", h(BarChart, { label: "b", data: neg, xKey: "w", series: [{ key: "a" }, { key: "b" }], mode: "stacked", showValues: true })],
        ["pie:one", h(PieChart, { label: "p", data: [{ name: long, value: 5 }] })],
        ["pie:zero", h(PieChart, { label: "p", data: [{ name: "a", value: 0 }, { name: "b", value: -2 }] })],
        ["pie:max1", h(PieChart, { label: "p", data: [{ name: "a", value: 1 }, { name: "b", value: 2 }, { name: "c", value: 3 }], maxSlices: 1, innerRadius: 0 })],
        ["radial:rings-one", h(RadialChart, { label: "r", data: [{ name: long, value: 150, max: 100 }] })],
        ["radial:gauge-neg", h(RadialChart, { label: "r", variant: "gauge", data: [{ name: "x", value: -5, max: 0 }] })],
        ["radial:progress-nan", h(RadialChart, { label: "r", variant: "progress", size: "xs", data: [{ name: "x", value: Number.NaN }] })],
        ["radar:one-axis", h(RadarChart, { label: "r", data: [{ axis: long, a: 3, b: -2 }], axisKey: "axis", series: [{ key: "a" }, { key: "b" }] })],
        ["radar:two-axes", h(RadarChart, { label: "r", data: [{ axis: "x", a: 0 }, { axis: "y", a: 0 }], axisKey: "axis", series: [{ key: "a" }] })],
        ["scatter:one", h(ScatterChart, { label: "s", data: [{ x: 1, y: 1, s: 1, c: "a", n: long }], xKey: "x", yKey: "y", sizeKey: "s", categoryKey: "c", labelKey: "n" })],
        ["scatter:same", h(ScatterChart, { label: "s", data: [{ x: 1, y: 1, s: 0 }, { x: 1, y: 1, s: 0 }], xKey: "x", yKey: "y", sizeKey: "s" })],
        ["scatter:5cats", h(ScatterChart, { label: "s", data: ["a", "b", "c", "d", "e"].map((c, i) => ({ x: i, y: -i, c })), xKey: "x", yKey: "y", categoryKey: "c" })],
        ["heatmap:1x1", h(HeatmapChart, { label: "h", data: [{ x: "a", y: long, value: 1 }], showValues: true })],
        ["heatmap:all-null", h(HeatmapChart, { label: "h", data: [{ x: "a", y: "b", value: null }], showValues: true })],
        ["heatmap:div-neg", h(HeatmapChart, { label: "h", data: [{ x: "a", y: "b", value: -3 }, { x: "c", y: "b", value: -1 }], colorScale: "diverging", showValues: true })],
        ["treemap:one-leaf", h(TreemapChart, { label: "t", data: { name: "root", children: [{ name: long, value: 4 }] } })],
        ["treemap:negative", h(TreemapChart, { label: "t", data: { name: "root", children: [{ name: "a", value: -4 }, { name: "b", value: 2 }] } })],
        ["treemap:dup-names", h(TreemapChart, { label: "t", data: { name: "root", children: [{ name: "a", value: 1 }, { name: "a", value: 2 }] } })],
        ["treemap:root-leaf", h(TreemapChart, { label: "t", data: { name: "root", value: 5 } })],
        ["sunburst:one-branch", h(SunburstChart, { label: "s", data: { name: "root", children: [{ name: long, children: [{ name: "x", value: 3 }] }] } })],
        ["sunburst:root-leaf", h(SunburstChart, { label: "s", data: { name: "root", value: 5 } })],
        ["sunburst:negative", h(SunburstChart, { label: "s", data: { name: "root", children: [{ name: "a", value: -1 }, { name: "a", value: 3 }] } })],
        ["funnel:one", h(FunnelChart, { label: "f", data: [{ name: long, value: 5 }] })],
        ["funnel:zero-first", h(FunnelChart, { label: "f", data: [{ name: "a", value: 0 }, { name: "b", value: -3 }], orientation: "vertical" })],
        ["sankey:one", h(SankeyChart, { label: "k", nodes: [{ id: "a", name: long }, { id: "b", name: long }], links: [{ source: "a", target: "b", value: 3 }] })],
        ["sankey:self-loop", h(SankeyChart, { label: "k", nodes: [{ id: "a", name: "a" }], links: [{ source: "a", target: "a", value: 3 }] })],
        ["sankey:cycle", h(SankeyChart, { label: "k", nodes: [{ id: "a", name: "a" }, { id: "b", name: "b" }], links: [{ source: "a", target: "b", value: 3 }, { source: "b", target: "a", value: 1 }] })],
        ["sankey:orphan", h(SankeyChart, { label: "k", nodes: [{ id: "a", name: "a" }, { id: "b", name: "b" }, { id: "z", name: "orphan" }], links: [{ source: "a", target: "b", value: 3 }], mutedNodes: ["b"] })],
        ["sparkline:empty", h(Sparkline, { label: "s", data: [] })],
        ["sparkline:one", h(Sparkline, { label: "s", data: [4], variant: "bar" })],
        ["sparkline:nan", h(Sparkline, { label: "s", data: [1, Number.NaN, 3] })],
        ["stat:nan", h(StatTile, { label: "s", value: Number.NaN, trend: [1] })],
        ["stat:string", h(StatTile, { label: "s", value: "31%", delta: { value: "1", direction: "flat" } })],
    );

    let failures = 0;
    for (const [name, element] of cases) {
        const before = errors.length;
        const container = w.document.createElement("div");
        w.document.body.appendChild(container);
        const root = createRoot(container);
        try {
            await act(async () => {
                root.render(element);
            });
            // Exercise keyboard focus + arrows + hidden legend on every chart.
            const items = Array.from(container.querySelectorAll<SVGElement>("[data-chart-item]"));
            if (items.length) {
                await act(async () => {
                    items[0].dispatchEvent(new w.FocusEvent("focusin", { bubbles: true }));
                });
                for (const key of ["ArrowRight", "ArrowDown", "End", "Home", "ArrowUp", "ArrowLeft"]) {
                    await act(async () => {
                        w.document.activeElement?.dispatchEvent(new w.KeyboardEvent("keydown", { key, bubbles: true }));
                        items[0].dispatchEvent(new w.KeyboardEvent("keydown", { key, bubbles: true }));
                    });
                }
                await act(async () => {
                    items[0].dispatchEvent(new w.Event("pointerenter", { bubbles: false }));
                });
            }
            const html = container.innerHTML;
            const bad = html.match(/(?:="|,| )(?:NaN|-?Infinity)(?:"|,| |px|\))/g);
            if (bad) {
                failures++;
                console.log(`FAIL ${name}: NaN/Infinity in markup (${bad.length}): ${bad.slice(0, 3).join(" ")}`);
            }
            const toggles = Array.from(container.querySelectorAll<HTMLButtonElement>("button[aria-pressed]"));
            for (const t of toggles) {
                await act(async () => {
                    t.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
                });
            }
            if (toggles.length) {
                const items2 = Array.from(container.querySelectorAll<SVGElement>("[data-chart-item]"));
                if (items2.length) {
                    await act(async () => {
                        items2[0].dispatchEvent(new w.FocusEvent("focusin", { bubbles: true }));
                        items2[0].dispatchEvent(new w.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
                    });
                }
                const html2 = container.innerHTML;
                if (/(?:="|,| )(?:NaN|-?Infinity)(?:"|,| |px|\))/.test(html2)) {
                    failures++;
                    console.log(`FAIL ${name}: NaN/Infinity after hiding every series`);
                }
            }
        } catch (error) {
            failures++;
            console.log(`FAIL ${name}: threw ${(error as Error).message.slice(0, 200)}`);
        }
        const newErrors = errors.slice(before);
        if (newErrors.length) {
            failures++;
            console.log(`FAIL ${name}: console errors:\n  ${newErrors.slice(0, 3).join("\n  ")}`);
        }
        await act(async () => root.unmount());
        container.remove();
    }
    console.error = origError;
    console.warn = origWarn;
    console.log(`${cases.length} cases, ${failures} failures`);
    process.exit(failures ? 1 : 0);
}

main().catch((e) => {
    console.error = origError;
    console.error(e);
    process.exit(1);
});
