"use client";

import { useMemo, useRef, useState } from "react";
import { endOfMonth, endOfWeek, getLocalTimeZone, startOfMonth, startOfWeek, today } from "@internationalized/date";
import { useControlledState } from "@react-stately/utils";
import { useDateFormatter } from "react-aria";
import type { DateRangePickerProps as AriaDateRangePickerProps, DateValue } from "react-aria-components";
import { DateRangePicker as AriaDateRangePicker, Dialog as AriaDialog, Group as AriaGroup, Popover as AriaPopover, useLocale } from "react-aria-components";
import { Button, type ButtonProps } from "@/components/base/buttons/button";
import { InputDateBase } from "@/components/base/input/input-date";
import { Calendar as CalendarIcon } from "@/components/foundations/icons";
import { cx } from "@/utils/cx";
import { RangeCalendar, RangePresetButton } from "./range-calendar";

interface DateRangePickerProps extends AriaDateRangePickerProps<DateValue> {
    size?: ButtonProps["size"];
    /** The function to call when the apply button is clicked. */
    onApply?: () => void;
    /** The function to call when the cancel button is clicked. Cancel also restores the range the picker had when it opened. */
    onCancel?: () => void;
}

export const DateRangePicker = ({ value: valueProp, defaultValue, onChange, onApply, onCancel, onOpenChange, size = "sm", ...props }: DateRangePickerProps) => {
    const { locale } = useLocale();
    const formatter = useDateFormatter({
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const [value, setValue] = useControlledState(valueProp, defaultValue || null, onChange);
    const [focusedValue, setFocusedValue] = useState<DateValue | null>(null);
    // Calendar clicks and presets commit immediately; remember the range at open so Cancel can undo them.
    const valueAtOpen = useRef(value);
    // Per component (not module load), so "today" and the presets are right after midnight and under SSR.
    const now = useMemo(() => today(getLocalTimeZone()), []);
    const highlightedDates = useMemo(() => [now], [now]);

    const formattedStartDate = value?.start ? formatter.format(value.start.toDate(getLocalTimeZone())) : "Select date";
    const formattedEndDate = value?.end ? formatter.format(value.end.toDate(getLocalTimeZone())) : "Select date";

    const presets = useMemo(
        () => ({
            today: { label: "Today", value: { start: now, end: now } },
            yesterday: { label: "Yesterday", value: { start: now.subtract({ days: 1 }), end: now.subtract({ days: 1 }) } },
            thisWeek: { label: "This week", value: { start: startOfWeek(now, locale), end: endOfWeek(now, locale) } },
            lastWeek: {
                label: "Last week",
                value: {
                    start: startOfWeek(now, locale).subtract({ weeks: 1 }),
                    end: endOfWeek(now, locale).subtract({ weeks: 1 }),
                },
            },
            thisMonth: { label: "This month", value: { start: startOfMonth(now), end: endOfMonth(now) } },
            lastMonth: {
                label: "Last month",
                value: {
                    start: startOfMonth(now).subtract({ months: 1 }),
                    end: endOfMonth(now).subtract({ months: 1 }),
                },
            },
            thisYear: { label: "This year", value: { start: startOfMonth(now.set({ month: 1 })), end: endOfMonth(now.set({ month: 12 })) } },
            lastYear: {
                label: "Last year",
                value: {
                    start: startOfMonth(now.set({ month: 1 }).subtract({ years: 1 })),
                    end: endOfMonth(now.set({ month: 12 }).subtract({ years: 1 })),
                },
            },
            allTime: {
                label: "All time",
                value: {
                    start: now.set({ year: 2000, month: 1, day: 1 }),
                    end: now,
                },
            },
        }),
        [locale, now],
    );

    return (
        <AriaDateRangePicker
            aria-label="Date range picker"
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
                {/* React Aria labels the trigger "Calendar" by default, hiding the chosen range from screen readers. */}
                <Button
                    size={size}
                    color="secondary"
                    iconLeading={CalendarIcon}
                    aria-label={value ? `${formattedStartDate} – ${formattedEndDate}` : "Choose dates"}
                >
                    {!value ? <span className="text-placeholder">Select dates</span> : `${formattedStartDate} – ${formattedEndDate}`}
                </Button>
            </AriaGroup>
            <AriaPopover
                placement="bottom right"
                offset={8}
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
                <AriaDialog aria-label="Date range picker" className="flex rounded-2xl bg-primary shadow-xl ring ring-secondary_alt focus:outline-hidden">
                    {({ close }) => (
                        <>
                            <div className="hidden w-38 flex-col gap-0.5 border-r border-solid border-secondary p-3 lg:flex">
                                {Object.values(presets).map((preset) => (
                                    <RangePresetButton
                                        key={preset.label}
                                        value={preset.value}
                                        onClick={() => {
                                            setValue(preset.value);
                                            setFocusedValue(preset.value.start);
                                        }}
                                    >
                                        {preset.label}
                                    </RangePresetButton>
                                ))}
                            </div>
                            <div className="flex flex-col">
                                <RangeCalendar
                                    focusedValue={focusedValue}
                                    onFocusChange={setFocusedValue}
                                    highlightedDates={highlightedDates}
                                    presets={{
                                        lastWeek: presets.lastWeek,
                                        lastMonth: presets.lastMonth,
                                        lastYear: presets.lastYear,
                                    }}
                                />
                                <div className="flex justify-between gap-3 border-t border-secondary p-4">
                                    <div className="hidden items-center gap-2 md:flex">
                                        <InputDateBase slot="start" size="sm" />
                                        <div className="text-md text-quaternary">–</div>
                                        <InputDateBase slot="end" size="sm" />
                                    </div>
                                    <div className="grid w-full grid-cols-2 gap-3 md:flex md:w-auto">
                                        <Button
                                            size="sm"
                                            color="secondary"
                                            onClick={() => {
                                                const before = valueAtOpen.current;
                                                const isChanged =
                                                    value?.start?.toString() !== before?.start?.toString() ||
                                                    value?.end?.toString() !== before?.end?.toString();
                                                if (isChanged) setValue(before);
                                                onCancel?.();
                                                close();
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            color="primary"
                                            onClick={() => {
                                                onApply?.();
                                                close();
                                            }}
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </AriaDialog>
            </AriaPopover>
        </AriaDateRangePicker>
    );
};
