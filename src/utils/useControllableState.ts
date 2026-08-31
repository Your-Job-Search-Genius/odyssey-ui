import { useCallback, useRef, useState } from "react";

export interface UseControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

/**
 * Shared controlled/uncontrolled state pattern: every input-like component
 * uses this so it works both as `<Input value={} onChange={}>` and as
 * `<Input defaultValue={}>` (uncontrolled), per the task's "controlled and
 * uncontrolled" requirement.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, (next: T) => void] {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const currentValue = isControlled ? (value as T) : uncontrolledValue;

  const isControlledRef = useRef(isControlled);
  if (process.env.NODE_ENV !== "production" && isControlledRef.current !== isControlled) {
    // eslint-disable-next-line no-console
    console.warn(
      "[@your-job-search-genius/odyssey-ui] A component switched between controlled and uncontrolled. Decide between `value`/`onChange` (controlled) or `defaultValue` (uncontrolled) and keep it consistent across renders.",
    );
  }
  isControlledRef.current = isControlled;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolledValue(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [currentValue, setValue];
}
