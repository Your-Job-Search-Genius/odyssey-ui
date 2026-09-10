"use client";

import { type ReactNode, useMemo, useState } from "react";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { playgroundRegistry } from "~/lib/playground-registry";
import type { PlaygroundSchema } from "~/lib/playground-types";
import { PlaygroundControlField } from "./playground-control-field";
import { PreviewErrorBoundary } from "./preview-error-boundary";
import { PreviewFrame } from "./preview-frame";

interface ComponentPlaygroundProps {
    /** Registry id, e.g. "base/buttons/button" -- matches lib/playgrounds/<id>.playground.ts. */
    playground: string;
}

function generateSnippet(schema: PlaygroundSchema, values: Record<string, unknown>): string {
    const props: string[] = [];

    for (const control of schema.controls) {
        if (control.prop === schema.childrenProp) continue;
        const value = values[control.prop];
        const defaultValue = schema.defaultProps[control.prop];

        if (value === undefined || value === false) continue;
        if (control.type === "boolean") {
            if (value === true) props.push(control.prop);
            continue;
        }
        // Skip values still at their seed default for string controls whose
        // default is itself falsy-equivalent to "unset" (keeps the snippet
        // minimal); otherwise always show explicitly-controlled values.
        if (value === "" || value === defaultValue) {
            if (value === "") continue;
        }
        props.push(`${control.prop}="${String(value)}"`);
    }

    const propsString = props.length ? ` ${props.join(" ")}` : "";
    const children = schema.childrenProp ? String(values[schema.childrenProp] ?? "") : undefined;

    return children !== undefined
        ? `<${schema.componentName}${propsString}>${children}</${schema.componentName}>`
        : `<${schema.componentName}${propsString} />`;
}

/**
 * A fully custom, testable playground: renders the real component live
 * with a control panel (built from the library's own Toggle /
 * NativeSelect / InputBase components) that lets a visitor toggle real
 * props and watch both the component and a live-generated JSX snippet
 * update in lockstep. Not a Storybook embed -- genuine React state.
 */
export function ComponentPlayground({ playground }: ComponentPlaygroundProps) {
    const schema = playgroundRegistry[playground];
    if (!schema) {
        throw new Error(
            `[ComponentPlayground] unknown playground id "${playground}". Add lib/playgrounds/${playground}.playground.ts and run \`pnpm run docs:sync\`.`,
        );
    }

    const [values, setValues] = useState<Record<string, unknown>>(() => ({ ...schema.defaultProps }));

    function setValue(prop: string, value: string | boolean) {
        setValues((prev) => ({ ...prev, [prop]: value }));
    }

    const Live = schema.component;
    const liveProps = { ...values };
    const childrenValue = schema.childrenProp ? liveProps[schema.childrenProp] : undefined;
    if (schema.childrenProp) delete liveProps[schema.childrenProp];

    const snippet = useMemo(() => generateSnippet(schema, values), [schema, values]);

    return (
        <div className="not-prose my-6 overflow-hidden rounded-xl border border-secondary">
            <PreviewFrame variant="embedded">
                <PreviewErrorBoundary label={playground}>
                    {schema.childrenProp ? <Live {...liveProps}>{childrenValue as ReactNode}</Live> : <Live {...liveProps} />}
                </PreviewErrorBoundary>
            </PreviewFrame>

            <div className="flex flex-wrap items-end gap-5 border-t border-secondary bg-secondary p-5">
                {schema.controls.map((control) => (
                    <PlaygroundControlField
                        key={control.prop}
                        control={control}
                        value={values[control.prop]}
                        onChange={(value) => setValue(control.prop, value)}
                    />
                ))}
            </div>

            <div className="border-t border-secondary">
                <CodeBlock className="my-0 rounded-none border-none">
                    <Pre>{snippet}</Pre>
                </CodeBlock>
            </div>
        </div>
    );
}
