import { useEffect, useRef } from "react";
import { Cancel02Icon } from "@your-job-search-genius/icons";
import { SidebarNav } from "./SidebarNav";

interface MobileDrawerProps {
  onClose: () => void;
}

export function MobileDrawer({ onClose }: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    drawer.querySelector<HTMLElement>("input, a, button")?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Minimal focus containment: keep Tab cycling inside the drawer.
      if (e.key === "Tab") {
        const focusables = drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <>
      <div className="docs-drawer-scrim" onClick={onClose} aria-hidden="true" />
      <div
        ref={drawerRef}
        className="docs-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        <div className="docs-drawer__head">
          <span style={{ fontWeight: 650, color: "var(--docs-ink)" }}>
            Navigation
          </span>
          <button
            type="button"
            className="docs-icon-btn"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <Cancel02Icon size={18} />
          </button>
        </div>
        <div className="docs-sidebar">
          <SidebarNav onNavigate={onClose} />
        </div>
      </div>
    </>
  );
}
