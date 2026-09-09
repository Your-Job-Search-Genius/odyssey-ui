"use client";

import type { PlaygroundControl } from "~/lib/playground-types";
import { InputBase } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { NativeSelect } from "@/components/base/select/select-native";
import { Toggle } from "@/components/base/toggle/toggle";

interface PlaygroundControlFieldProps {
    control: PlaygroundControl;
    value: unknown;
    onChange: (value: string | boolean) => void;
}

function labelFor(control: PlaygroundControl): string {
    return control.label ?? control.prop;
}

/**
 * One control in a ComponentPlayground's control panel. Deliberately
 * built from the library's own Toggle / NativeSelect / InputBase
 * components -- dogfooding the real controls to drive the real
 * components under test, rather than plain unstyled HTML inputs.
 */
export function PlaygroundControlField({ control, value, onChange }: PlaygroundControlFieldProps) {
    if (control.type === "boolean") {
        return <Toggle label={labelFor(control)} size="sm" isSelected={Boolean(value)} onChange={onChange} />;
    }

    if (control.type === "select") {
        return (
            <NativeSelect
                label={labelFor(control)}
                size="sm"
                className="w-40"
                value={typeof value === "string" ? value : ""}
                onChange={(event) => onChange(event.target.value)}
                options={control.options.map((option) => ({ label: option, value: option }))}
            />
        );
    }

    return (
        <div className="flex w-48 flex-col gap-1.5">
            <Label>{labelFor(control)}</Label>
            <InputBase size="sm" value={typeof value === "string" ? value : ""} onChange={(event) => onChange(event.target.value)} />
        </div>
    );
}
