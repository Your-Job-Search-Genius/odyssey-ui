import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useKeyboard } from "react-aria";
import { EventLog } from "../shared/EventLog";
import "../shared/hook-demos.css";

const meta: Meta = {
  title: "React Aria Hooks/Interactions/useKeyboard",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`useKeyboard` handles keyboard interactions with one difference from raw DOM events: " +
          "propagation stops by default once a handler runs, so a parent doesn't also react to a " +
          "key its child already handled — call `event.continuePropagation()` to opt back in. " +
          "The `shortcuts` map (`'Mod+s'`, `'Shift+ArrowLeft'`, etc.) is often the more ergonomic " +
          "API: return nothing to fully consume the shortcut, or `false` to allow the browser " +
          "default and let propagation continue.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function Demo() {
  const [events, setEvents] = useState<string[]>([]);
  const add = (message: string) => setEvents((e) => [message, ...e]);

  const { keyboardProps: parentProps } = useKeyboard({
    onKeyDown: () => add("parent onKeyDown"),
  });

  const { keyboardProps: childProps } = useKeyboard({
    shortcuts: {
      "Mod+s": () => add("child shortcut: Mod+S (prevents save dialog)"),
      ArrowLeft: () => add("child shortcut: ArrowLeft (prevents default, stops propagation)"),
      ArrowRight: () => {
        add("child shortcut: ArrowRight (allows default, continues propagation)");
        return false;
      },
    },
    onKeyDown: () => add("child onKeyDown"),
  });

  return (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Focus the field, then press <kbd>Mod</kbd>+<kbd>S</kbd>, <kbd>&larr;</kbd>, or{" "}
        <kbd>&rarr;</kbd>. <kbd>&larr;</kbd> prevents the cursor from moving and stops
        propagation to the parent; <kbd>&rarr;</kbd> moves the cursor and lets the parent see the
        event too.
      </p>
      <div className="wsu-hookDemo__container" {...parentProps}>
        <label className="wsu-hookDemo__field">
          Text field
          <input
            className="wsu-hookDemo__input"
            defaultValue="Move the cursor with arrow keys"
            {...childProps}
          />
        </label>
      </div>
      <EventLog events={events} />
    </div>
  );
}

export const Shortcuts: Story = {
  name: "Shortcuts and propagation",
  render: () => <Demo />,
};
