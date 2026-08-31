import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useHover } from "react-aria";
import { EventLog } from "../shared/EventLog";
import "../shared/hook-demos.css";

const meta: Meta = {
  title: "React Aria Hooks/Interactions/useHover",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`useHover` normalizes pointer hover across browsers and, critically, ignores emulated " +
          "mouse events on touch devices — unlike CSS `:hover`, which stays 'stuck' on touch " +
          "until the user taps something else. Hover should never be the *only* way to reach an " +
          "interaction; pair it with a tap- or focus-friendly alternative for touch and keyboard " +
          "users.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function Demo() {
  const [events, setEvents] = useState<string[]>([]);
  const { hoverProps, isHovered } = useHover({
    onHoverStart: (e) => setEvents((ev) => [...ev, `hover start with ${e.pointerType}`]),
    onHoverEnd: (e) => setEvents((ev) => [...ev, `hover end with ${e.pointerType}`]),
  });

  return (
    <div className="wsu-hookDemo">
      <div
        role="button"
        tabIndex={0}
        className="wsu-hookDemo__box"
        data-active={isHovered}
        {...hoverProps}
      >
        Hover me
      </div>
      <EventLog events={events} />
    </div>
  );
}

export const Basic: Story = {
  render: () => <Demo />,
};
