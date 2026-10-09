"use client";

import { type KeyboardEvent, type RefObject, useContext, useEffect, useRef } from "react";
import { ComboBoxStateContext } from "react-aria-components";
import { SearchLg } from "@/components/foundations/icons";
import { cx } from "@/utils/cx";

interface ComboBoxSheetSearchProps {
    size: "sm" | "md" | "lg";
    placeholder?: string;
    /** Accessible name of the search field, e.g. "Search team members". */
    label?: string;
    /** The combobox's trigger (the element wrapping its input); focus returns to its input when the sheet closes. */
    triggerRef?: RefObject<HTMLElement | null>;
}

/**
 * The search field at the top of a combobox's mobile bottom sheet. On mobile the sheet is modal, so typing
 * moves from the trigger into this field; it edits the combobox's own input value, so the combobox's
 * filtering, `onInputChange` and `onLoadMore` keep working unchanged.
 *
 * A native input on purpose: React Aria's `Input` would pick up the combobox's input context, and
 * `SearchField` clears the value on Escape (which would clear a single selection).
 */
export const ComboBoxSheetSearch = ({ size, placeholder, label = "Search", triggerRef }: ComboBoxSheetSearchProps) => {
    const state = useContext(ComboBoxStateContext);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus in an effect, not `autoFocus`: by now the popover's ref is attached, so the combobox sees focus
    // moving into its popover and stays open. The popover skips its own focusing when focus is already inside.
    useEffect(() => {
        inputRef.current?.focus();
        const trigger = triggerRef?.current;
        return () => {
            // React Aria restores focus while the trigger is still inert behind the modal sheet, so it can land on
            // <body>. Once the sheet is gone, put it back on the combobox input -- only if focus was actually lost.
            requestAnimationFrame(() => {
                if (document.activeElement && document.activeElement !== document.body) return;
                trigger?.querySelector<HTMLInputElement>("input")?.focus();
            });
        };
    }, [triggerRef]);

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        // Arrow Down moves into the list (it uses real focus in the sheet, not the trigger's virtual focus).
        if (event.key !== "ArrowDown") return;
        const firstOption = inputRef.current?.closest("[data-trigger]")?.querySelector<HTMLElement>('[role="option"]:not([aria-disabled="true"])');
        if (!firstOption) return;
        event.preventDefault();
        firstOption.focus();
    };

    return (
        <div className="sticky top-0 z-10 shrink-0 border-b border-secondary bg-primary p-2">
            <div className="flex items-center gap-2 rounded-lg bg-primary px-3 ring-1 ring-primary ring-inset focus-within:ring-2 focus-within:ring-brand">
                <SearchLg aria-hidden="true" className="size-5 shrink-0 text-fg-quaternary" />
                <input
                    ref={inputRef}
                    type="text"
                    enterKeyHint="search"
                    autoComplete="off"
                    aria-label={label}
                    placeholder={placeholder}
                    value={state?.inputValue ?? ""}
                    onChange={(event) => state?.setInputValue(event.target.value)}
                    onKeyDown={onKeyDown}
                    className={cx(
                        "w-full min-w-0 bg-transparent text-primary outline-hidden placeholder:text-placeholder",
                        size === "sm" ? "py-2 text-sm" : "py-2.5 text-md",
                    )}
                />
            </div>
        </div>
    );
};
