import type { ComponentDoc } from "react-docgen-typescript";
import propsJson from "../.generated/props.json";

const propsData = propsJson as unknown as Record<string, ComponentDoc[]>;

/**
 * The generated react-docgen-typescript output for a component id
 * (e.g. "base/buttons/button"), or undefined if it wasn't extractable
 * (see showcase/scripts/sync-content.ts's writeProps doc comment) -- in
 * that case, author a plain markdown table by hand instead of using
 * <PropsTable> for that page's Props section.
 */
export function getComponentDocs(component: string): ComponentDoc[] | undefined {
    return propsData[component];
}
