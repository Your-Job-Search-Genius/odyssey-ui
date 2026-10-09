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
 * react-docgen-typescript (see apps/docs/scripts/sync-content.ts) from
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
        <section
            className="sp-glass sp-rise not-prose"
            aria-label={`${doc.displayName} props`}
            style={{ padding: "8px 0 4px", borderRadius: 24, margin: "20px 0" }}
        >
            <div style={{ overflowX: "auto", padding: "0 8px" }}>
                <table className="sp-table sp-ptable">
                    <thead>
                        <tr>
                            <th scope="col">Prop</th>
                            <th scope="col">Type</th>
                            <th scope="col">Default</th>
                            <th scope="col">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.map((prop) => (
                            <tr key={prop.name}>
                                <td>
                                    <span className="sp-mono" style={{ fontWeight: 500 }}>
                                        {prop.name}
                                    </span>
                                    {prop.required && (
                                        <span style={{ marginLeft: 4, color: "var(--sp-brand)" }} aria-label="required">
                                            *
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <span className="sp-chip sp-mono">{formatType(prop)}</span>
                                </td>
                                <td>
                                    <span className="sp-mono" style={{ color: "var(--sp-muted)" }}>
                                        {formatDefault(prop) ?? "—"}
                                    </span>
                                </td>
                                <td style={{ color: "var(--sp-muted)" }}>{prop.description || "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
