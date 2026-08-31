import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useFocus } from "react-aria";
import { EventLog } from "../shared/EventLog";
import "../shared/hook-demos.css";

const meta: Meta = {
  title: "React Aria Hooks/Focus/useFocus",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`useFocus` handles focus events for the immediate target only — unlike React's " +
          "built-in focus events, it never fires when a descendant gains focus, matching native " +
          "DOM focus behavior (no bubbling). Use it when you specifically need *this element*, " +
          "not its subtree, to know when it's focused. For subtree-aware focus, see " +
          "`useFocusWithin`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function Demo() {
  const [events, setEvents] = useState<string[]>([]);
  const { focusProps } = useFocus({
    onFocus: () => setEvents((e) => [...e, "focus"]),
    onBlur: () => setEvents((e) => [...e, "blur"]),
    onFocusChange: (isFocused) => setEvents((e) => [...e, `focus change: ${isFocused}`]),
  });

  return (
    <div className="wsu-hookDemo">
      <label className="wsu-hookDemo__field">
        Example input
        <input className="wsu-hookDemo__input" {...focusProps} />
      </label>
      <EventLog events={events} />
    </div>
  );
}

export const Basic: Story = {
  render: () => <Demo />,
};
