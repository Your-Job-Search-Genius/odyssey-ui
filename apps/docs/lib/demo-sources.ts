import demoExportsJson from "../.generated/demo-exports.json";
import demoSourcesJson from "../.generated/demo-sources.json";

const demoSources: Record<string, string> = demoSourcesJson;
const demoExports: Record<string, string[]> = demoExportsJson;

/** Exact source text for a given "<demo id>#<export name>", or undefined if unknown. */
export function getDemoSource(demo: string, exportName: string): string | undefined {
    return demoSources[`${demo}#${exportName}`];
}

/** Every named export found in a demo/story file, in declaration order. */
export function getDemoExportNames(demo: string): string[] {
    return demoExports[demo] ?? [];
}
