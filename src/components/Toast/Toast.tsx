import type { CSSProperties, ReactNode } from "react";
import { flushSync } from "react-dom";
import {
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastRegion as AriaToastRegion,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastQueue as ToastQueue,
  Button as AriaButton,
  Text,
  type ToastOptions,
} from "react-aria-components/Toast";
import { MultiplicationSignIcon } from "@your-job-search-genius/icons";
import "./Toast.css";

export type { ToastOptions };

export interface ToastContent {
  title: string;
  description?: ReactNode;
}

/**
 * Wraps every add/close in a CSS view transition when the browser supports
 * one — `react-aria-components`' Toast has no `[data-entering]`/
 * `[data-exiting]` hold-open state the way ModalOverlay/Tooltip do, so this
 * is the mechanism the primitive itself is built around for animating a
 * toast in and out (see Toast.css). Falls back to an immediate DOM swap
 * where unsupported.
 */
export const toastQueue = new ToastQueue<ToastContent>({
  wrapUpdate(fn) {
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      document.startViewTransition(() => {
        flushSync(fn);
      });
    } else {
      fn();
    }
  },
});

export { ToastQueue };

export interface ToastRegionProps {
  /** Defaults to this library's shared `toastQueue` singleton. Override only for an isolated demo/test that must not see toasts queued elsewhere. */
  queue?: ToastQueue<ToastContent>;
}

/**
 * ToastRegion — mount once near the app root. Every `toastQueue.add(...)`
 * call anywhere in the app renders here, through a `react-aria-components`
 * portal onto `document.body` (WCAG doc §6, same overlay guarantee class as
 * Modal/Tooltip).
 *
 * Not present in the source Figma file (see docs/design-inventory.md
 * §2.14) — designed from the WAI-ARIA APG alert pattern plus this system's
 * own dark-surface/shadow/radius language, the same recipe already used
 * for Tooltip. Lands on `--wsu-z-toast` (1600), the top of the z-index
 * scale reserved for it (docs/design-inventory.md's z-index table) since a
 * toast is a global interrupt and must out-rank any per-field or
 * per-trigger overlay already on screen.
 *
 * For accessibility, keep any `timeout` passed to `toastQueue.add()` at
 * 5000ms or more (WCAG 2.2.1) — or omit it so the toast stays until the
 * user dismisses it. Timers pause automatically while the region is
 * hovered or focused.
 */
export function ToastRegion({ queue = toastQueue }: ToastRegionProps) {
  return (
    <AriaToastRegion queue={queue} className="wsu-ToastRegion">
      {({ toast }) => (
        <AriaToast
          toast={toast}
          className="wsu-Toast"
          style={{ viewTransitionName: toast.key } as CSSProperties}
        >
          <AriaToastContent className="wsu-Toast__content">
            <Text slot="title" className="wsu-Toast__title">
              {toast.content.title}
            </Text>
            {toast.content.description ? (
              <Text slot="description" className="wsu-Toast__description">
                {toast.content.description}
              </Text>
            ) : null}
          </AriaToastContent>
          <AriaButton slot="close" aria-label="Close" className="wsu-Toast__close">
            <MultiplicationSignIcon size="1rem" />
          </AriaButton>
        </AriaToast>
      )}
    </AriaToastRegion>
  );
}
