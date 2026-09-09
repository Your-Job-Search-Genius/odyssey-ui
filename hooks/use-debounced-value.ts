import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of `value` that only updates after `delayMs` milliseconds
 * have elapsed without `value` changing. Useful for wiring a text input to a server
 * search/filter request without firing a request on every keystroke.
 *
 * @param value The live (unstable) value, e.g. the raw input value.
 * @param delayMs The debounce delay in milliseconds. @default 300
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedValue(value), delayMs);
        return () => clearTimeout(timeout);
    }, [value, delayMs]);

    return debouncedValue;
}
