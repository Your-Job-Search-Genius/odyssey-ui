"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";

/** Entry animation length in seconds. */
export const CHART_ENTER_DURATION = 0.7;
/** Data-update animation length in seconds. */
export const CHART_UPDATE_DURATION = 0.4;
/** The cubic-out style easing shared by every chart animation. */
export const CHART_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface ChartTransitionOptions {
    /** Seconds. Defaults to the entry duration on first render and the update duration afterwards. */
    duration?: number;
    /** Seconds before the animation starts. */
    delay?: number;
    /** Set to false to freeze the value at 1 (no animation). */
    enabled?: boolean;
}

/**
 * Drives chart animations with a single progress value in [0, 1].
 *
 * The value restarts from 0 whenever `dependency` changes identity (pass the
 * chart's `data` array), so charts can interpolate from the previous geometry
 * to the next one. When the reader prefers reduced motion the hook returns 1
 * immediately and never animates, so the final frame renders at once.
 *
 * Because progress is React state, charts simply compute geometry from the
 * returned number inside render; there is no imperative DOM mutation.
 */
export function useChartTransition(dependency: unknown, options: ChartTransitionOptions = {}): number {
    const reducedMotion = useReducedMotion() ?? false;
    const { delay = 0, enabled = true } = options;
    const isFirstRun = useRef(true);
    const [progress, setProgress] = useState(() => (reducedMotion || !enabled ? 1 : 0));

    useEffect(() => {
        if (reducedMotion || !enabled) {
            setProgress(1);
            isFirstRun.current = false;
            return;
        }

        const duration = options.duration ?? (isFirstRun.current ? CHART_ENTER_DURATION : CHART_UPDATE_DURATION);
        isFirstRun.current = false;

        setProgress(0);
        const controls = animate(0, 1, {
            duration,
            delay,
            ease: CHART_EASE,
            onUpdate: (value) => setProgress(value),
            onComplete: () => setProgress(1),
        });

        return () => controls.stop();
        // `dependency` is the identity the caller wants to restart on; the
        // remaining options are stable per chart instance.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dependency, reducedMotion, enabled]);

    return progress;
}

/**
 * Returns the previous *distinct* value: the one `value` replaced when its
 * identity last changed. Unlike a plain previous-render ref, this stays
 * stable across the many renders an animation produces, so charts can
 * interpolate from the last dataset to the current one for the whole
 * duration of the transition.
 */
export function usePreviousDistinct<T>(value: T): T | undefined {
    const [state, setState] = useState<{ current: T; previous: T | undefined }>({ current: value, previous: undefined });
    if (state.current !== value) {
        setState({ current: value, previous: state.current });
        return state.current;
    }
    return state.previous;
}

/** Whether the reader has asked for reduced motion. Safe during SSR (returns false). */
export function useChartReducedMotion(): boolean {
    return useReducedMotion() ?? false;
}
