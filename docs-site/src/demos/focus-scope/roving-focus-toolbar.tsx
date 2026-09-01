import type { KeyboardEvent, ReactNode } from "react";
import { FocusScope, useFocusManager } from "react-aria";

function ToolbarButton({ children }: { children: ReactNode }) {
  const focusManager = useFocusManager();
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowRight") focusManager?.focusNext({ wrap: true });
    if (e.key === "ArrowLeft") focusManager?.focusPrevious({ wrap: true });
  };
  return (
    <button type="button" className="wsu-hookDemo__button" onKeyDown={onKeyDown}>
      {children}
    </button>
  );
}

export default function FocusScopeRovingFocusToolbar() {
  return (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Focus a button, then use the arrow keys to roam between them — useFocusManager reads the
        parent FocusScope&rsquo;s focus-movement API instead of each button tracking its own
        index.
      </p>
      <div role="toolbar" aria-label="Example toolbar" className="wsu-hookDemo__row">
        <FocusScope>
          <ToolbarButton>Cut</ToolbarButton>
          <ToolbarButton>Copy</ToolbarButton>
          <ToolbarButton>Paste</ToolbarButton>
        </FocusScope>
      </div>
    </div>
  );
}
