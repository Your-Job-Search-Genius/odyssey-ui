import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useMove } from "react-aria";
import { EventLog } from "../shared/EventLog";
import "../shared/hook-demos.css";

const CONTAINER_SIZE = 200;
const BALL_SIZE = 30;

const meta: Meta = {
  title: "React Aria Hooks/Interactions/useMove",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`useMove` reports relative movement deltas after a press-and-drag with the mouse or " +
          "touch, and — just as importantly — after the target is focused and the user presses " +
          "arrow keys. That keyboard fallback is what makes drag-style interactions built on top " +
          "of this hook (custom sliders, a draggable ball, etc.) usable without a pointer at all.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function Demo() {
  const [events, setEvents] = useState<string[]>([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const clamp = (pos: number) => Math.min(Math.max(pos, 0), CONTAINER_SIZE - BALL_SIZE);

  const { moveProps } = useMove({
    onMove(e) {
      setPosition(({ x, y }) => {
        if (e.pointerType === "keyboard") {
          x = clamp(x);
          y = clamp(y);
        }
        x += e.deltaX;
        y += e.deltaY;
        return { x, y };
      });
      setEvents((ev) => [
        `move with pointerType = ${e.pointerType}, deltaX = ${e.deltaX}, deltaY = ${e.deltaY}`,
        ...ev,
      ]);
    },
    onMoveEnd() {
      setPosition(({ x, y }) => ({ x: clamp(x), y: clamp(y) }));
    },
  });

  return (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Drag the ball with a mouse or touch, or Tab to it and use the arrow keys.
      </p>
      <div className="wsu-hookDemo__moveArea">
        <div
          {...moveProps}
          // a movable handle, not a native control; `moveProps` already wires arrow-key
          // movement for keyboard users.
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          className="wsu-hookDemo__ball"
          style={{ left: clamp(position.x), top: clamp(position.y) }}
        />
      </div>
      <EventLog events={events} />
    </div>
  );
}

export const Basic: Story = {
  render: () => <Demo />,
};
