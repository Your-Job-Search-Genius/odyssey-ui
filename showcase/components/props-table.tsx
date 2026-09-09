import type { PropItem } from "react-docgen-typescript";
import { getComponentDocs } from "~/lib/props-data";

interface PropsTableProps {
    /** Registry id, e.g. "base/buttons/button" -- matches "<category>/<group>/<file-name>". */
    component: string;
    /** Which exported component's props to show, if the file exports more than one. Defaults to the first. */
    name?: string;
}

function formatType(prop: PropItem): string {
    const raw = typeof prop.type.raw === "string" ? prop.type.raw : prop.type.name;
    return raw.replace(/\s*\|\s*undefined/g, "");
}

function formatDefault(prop: PropItem): string | undefined {
    const value = prop.defaultValue?.value;
    return value === undefined || value === null ? undefined : String(value);
}

/**
 * Renders a component's real prop table, generated at build time by
 * react-docgen-typescript (see showcase/scripts/sync-content.ts) from
 * its actual TypeScript interface -- name, type, default, and
 * description (including the library's own TSDoc comments) all read
 * straight from source, so this table can't drift from the real props.
 */
export function PropsTable({ component, name }: PropsTableProps) {
    const docs = getComponentDocs(component);

    if (!docs || docs.length === 0) {
        return (
            <p className="text-sm text-tertiary">
                Props for <code>{component}</code> couldn't be extracted automatically -- see the table below.
            </p>
        );
    }

    const doc = name ? (docs.find((d) => d.displayName === name) ?? docs[0]) : docs[0];
    const props = Object.values(doc.props).sort((a, b) => {
        if (a.required !== b.required) return a.required ? -1 : 1;
        return a.name.localeCompare(b.name);
    });

    if (props.length === 0) {
        return <p className="text-sm text-tertiary">{doc.displayName} takes no props.</p>;
    }

    return (
        <div className="my-6 overflow-x-auto rounded-xl border border-secondary">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="border-b border-secondary bg-secondary text-left">
                        <th className="px-4 py-2.5 font-semibold text-secondary">Prop</th>
                        <th className="px-4 py-2.5 font-semibold text-secondary">Type</th>
                        <th className="px-4 py-2.5 font-semibold text-secondary">Default</th>
                        <th className="px-4 py-2.5 font-semibold text-secondary">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {props.map((prop) => (
                        <tr key={prop.name} className="border-b border-secondary last:border-none">
                            <td className="px-4 py-2.5 align-top font-mono text-xs text-primary">
                                {prop.name}
                                {prop.required && <span className="ml-1 text-error-primary">*</span>}
                            </td>
                            <td className="max-w-72 px-4 py-2.5 align-top font-mono text-xs text-brand-secondary">{formatType(prop)}</td>
                            <td className="px-4 py-2.5 align-top font-mono text-xs text-tertiary">{formatDefault(prop) ?? "—"}</td>
                            <td className="px-4 py-2.5 align-top text-tertiary">{prop.description || "—"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
