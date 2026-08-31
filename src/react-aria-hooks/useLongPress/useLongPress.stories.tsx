import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { mergeProps, useLongPress, usePress } from "react-aria";
import { EventLog } from "../shared/EventLog";
import "../shared/hook-demos.css";

const meta: Meta = {
  title: "React Aria Hooks/Interactions/useLongPress",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`useLongPress` fires when the pointer is pressed and held over a target past a time " +
          "threshold (500ms by default), and cancels other active press interactions (like " +
          "`usePress`) once it fires, so only the long press wins. There's no standard keyboard " +
          "equivalent to 'holding down' a mouse button, so any long-press-only action needs an " +
          "explicit keyboard-accessible alternative — `useLongPress` doesn't provide one for you.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function Demo() {
  const [events, setEvents] = useState<string[]>([]);
  const [mode, setMode] = useState("Normal speed");

  const { longPressProps } = useLongPress({
    accessibilityDescription: "Long press to activate hyper speed",
    onLongPressStart: (e) => setEvents((ev) => [`long press start with ${e.pointerType}`, ...ev]),
    onLongPressEnd: (e) => setEvents((ev) => [`long press end with ${e.pointerType}`, ...ev]),
    onLongPress: (e) => {
      setMode("Hyper speed");
      setEvents((ev) => [`long press with ${e.pointerType}`, ...ev]);
    },
  });

  const { pressProps } = usePress({
    onPress: (e) => {
      setMode("Normal speed");
      setEvents((ev) => [`press with ${e.pointerType}`, ...ev]);
    },
  });

  return (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        A short press sets normal speed. Pressing and holding for 500ms activates hyper speed
        instead.
      </p>
      <button
        type="button"
        className="wsu-hookDemo__button"
        {...mergeProps(pressProps, longPressProps)}
      >
        {mode}
      </button>
      <EventLog events={events} />
    </div>
  );
}

export const Basic: Story = {
  render: () => <Demo />,
};
