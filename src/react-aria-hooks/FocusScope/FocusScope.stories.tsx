import { useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FocusScope, useFocusManager } from "react-aria";
import "../shared/hook-demos.css";

const meta: Meta = {
  title: "React Aria Hooks/Focus/FocusScope",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`FocusScope` manages focus for a subtree: it can trap <kbd>Tab</kbd> inside the scope " +
          "(`contain`), auto-focus its first focusable child on mount (`autoFocus`), and restore " +
          "focus to whatever was focused before the scope mounted once it unmounts " +
          "(`restoreFocus`). This is the exact contract this library's own `Modal` relies on " +
          "internally (via `react-aria-components`). `useFocusManager` reads a `FocusScope`'s " +
          "programmatic focus-movement API — handy for roving-focus widgets like a toolbar.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function DialogDemo() {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Opening mounts a <code>FocusScope</code> that auto-focuses the first input. Press{" "}
        <kbd>Tab</kbd> — focus stays trapped inside. Closing it restores focus back to the Open
        button.
      </p>
      <button type="button" className="wsu-hookDemo__button" onClick={() => setOpen(true)}>
        Open
      </button>
      {isOpen && (
        // FocusScope's `autoFocus` prop, not the DOM attribute the rule guards against: this
        // scope only mounts once the user explicitly opens it, so moving focus in is expected.
        // eslint-disable-next-line jsx-a11y/no-autofocus
        <FocusScope contain restoreFocus autoFocus>
          <div className="wsu-hookDemo__container" style={{ marginTop: 16 }}>
            <label className="wsu-hookDemo__field">
              First name
              <input className="wsu-hookDemo__input" />
            </label>
            <label className="wsu-hookDemo__field">
              Last name
              <input className="wsu-hookDemo__input" />
            </label>
            <button type="button" className="wsu-hookDemo__button" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </FocusScope>
      )}
    </div>
  );
}

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

function ToolbarDemo() {
  return (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Focus a button below, then use <kbd>&larr;</kbd> / <kbd>&rarr;</kbd> to roam between
        them — <code>useFocusManager</code> reads the parent <code>FocusScope</code>&rsquo;s
        focus-movement API instead of each button tracking its own index.
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

export const ContainAndRestore: Story = {
  name: "Contain, restore, and auto focus",
  render: () => <DialogDemo />,
};

export const RovingFocusToolbar: Story = {
  name: "useFocusManager: roving focus toolbar",
  render: () => <ToolbarDemo />,
};
