import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { usePress } from "react-aria";
import { EventLog } from "../shared/EventLog";
import "../shared/hook-demos.css";

const meta: Meta = {
  title: "React Aria Hooks/Interactions/usePress",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`usePress` normalizes 'press' across mouse, touch, keyboard (`Enter`/`Space`), and " +
          "screen-reader virtual clicks, and irons out a long list of cross-browser quirks — " +
          "disabling text selection mid-press, canceling on scroll, and normalizing focus " +
          "behavior on touch. It's the primitive behind every button-like control in " +
          "`react-aria-components`, which this library wraps for its own `Button`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function Demo() {
  const [events, setEvents] = useState<string[]>([]);
  const { pressProps, isPressed } = usePress({
    onPressStart: (e) => setEvents((ev) => [...ev, `press start with ${e.pointerType}`]),
    onPressEnd: (e) => setEvents((ev) => [...ev, `press end with ${e.pointerType}`]),
    onPress: (e) => setEvents((ev) => [...ev, `press with ${e.pointerType}`]),
  });

  return (
    <div className="wsu-hookDemo">
      <div
        role="button"
        tabIndex={0}
        className="wsu-hookDemo__box"
        data-active={isPressed}
        {...pressProps}
      >
        Press me
      </div>
      <EventLog events={events} />
    </div>
  );
}

export const Basic: Story = {
  render: () => <Demo />,
};
