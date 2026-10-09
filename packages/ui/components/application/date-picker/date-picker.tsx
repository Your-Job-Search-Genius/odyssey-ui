"use client";

import { useMemo, useRef } from "react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useControlledState } from "@react-stately/utils";
import { useDateFormatter } from "react-aria";
import type { DatePickerProps as AriaDatePickerProps, DateValue } from "react-aria-components";
import { DatePicker as AriaDatePicker, Dialog as AriaDialog, Group as AriaGroup, Popover as AriaPopover } from "react-aria-components";
import { Button, type ButtonProps } from "@/components/base/buttons/button";
import { Calendar as CalendarIcon } from "@/components/foundations/icons";
import { cx } from "@/utils/cx";
import { Calendar } from "./calendar";

interface DatePickerProps extends AriaDatePickerProps<DateValue> {
    /** The function to call when the apply button is clicked. */
    onApply?: () => void;
    /** The function to call when the cancel button is clicked. Cancel also restores the value the picker had when it opened. */
    onCancel?: () => void;
    size?: ButtonProps["size"];
}

export const DatePicker = ({ value: valueProp, defaultValue, onChange, onApply, onCancel, onOpenChange, size = "sm", ...props }: DatePickerProps) => {
    const formatter = useDateFormatter({
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const [value, setValue] = useControlledState(valueProp, defaultValue || null, onChange);
    // Calendar clicks commit immediately; remember the value at open so Cancel can undo them.
    const valueAtOpen = useRef<DateValue | null>(value);
    // Computed per render (not at module load) so "today" is right after midnight and under SSR.
    const highlightedDates = useMemo(() => [today(getLocalTimeZone())], []);

    const formattedDate = value ? formatter.format(value.toDate(getLocalTimeZone())) : "Select date";

    return (
        <AriaDatePicker
            aria-label="Date picker"
            shouldCloseOnSelect={false}
            {...props}
            value={value}
            onChange={setValue}
            onOpenChange={(isOpen) => {
                if (isOpen) valueAtOpen.current = value;
                onOpenChange?.(isOpen);
            }}
        >
            <AriaGroup>
                {/* React Aria labels the trigger "Calendar" by default, hiding the chosen date from screen readers. */}
                <Button size={size} color="secondary" iconLeading={CalendarIcon} aria-label={value ? formattedDate : "Choose date"}>
                    {formattedDate}
                </Button>
            </AriaGroup>
            <AriaPopover
                offset={8}
                placement="bottom right"
                className={({ isEntering, isExiting }) =>
                    cx(
                        "origin-(--trigger-anchor-point) will-change-transform",
                        isEntering &&
                            "duration-150 ease-out animate-in fade-in placement-right:slide-in-from-left-0.5 placement-top:slide-in-from-bottom-0.5 placement-bottom:slide-in-from-top-0.5",
                        isExiting &&
                            "duration-100 ease-in animate-out fade-out placement-right:slide-out-to-left-0.5 placement-top:slide-out-to-bottom-0.5 placement-bottom:slide-out-to-top-0.5",
                    )
                }
            >
                <AriaDialog aria-label="Date picker" className="rounded-2xl bg-primary shadow-xl ring ring-secondary_alt">
                    {({ close }) => (
                        <>
                            <div className="flex px-6 py-5">
                                <Calendar highlightedDates={highlightedDates} />
                            </div>
                            <div className="grid grid-cols-2 gap-3 border-t border-secondary p-4">
                                <Button
                                    size="md"
                                    color="secondary"
                                    onClick={() => {
                                        if (value?.toString() !== valueAtOpen.current?.toString()) setValue(valueAtOpen.current);
                                        onCancel?.();
                                        close();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="md"
                                    color="primary"
                                    onClick={() => {
                                        onApply?.();
                                        close();
                                    }}
                                >
                                    Apply
                                </Button>
                            </div>
                        </>
                    )}
                </AriaDialog>
            </AriaPopover>
        </AriaDatePicker>
    );
};
