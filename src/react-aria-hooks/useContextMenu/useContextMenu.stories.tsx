import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useContextMenu } from "react-aria";
import { EventLog } from "../shared/EventLog";
import "../shared/hook-demos.css";

const meta: Meta = {
  title: "React Aria Hooks/Interactions/useContextMenu",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "There's no single standard way to trigger a context menu across platforms and " +
          "assistive technologies. `useContextMenu` normalizes right-click, Control+click on " +
          "macOS, long press on touch (including iOS, where the native `contextmenu` event " +
          "never fires), Shift+F10 / Control+Enter, and VoiceOver's context-menu gesture into " +
          "one `onContextMenu` callback with a consistent `{x, y, target}` payload — and " +
          "suppresses the browser/OS menu so it doesn't appear alongside a custom one.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function Demo() {
  const [events, setEvents] = useState<string[]>([]);
  const { contextMenuProps } = useContextMenu({
    onContextMenu: (e) => setEvents((ev) => [`context menu at (${e.x}, ${e.y})`, ...ev]),
  });

  return (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Right-click (or long-press on touch, or press <kbd>Shift</kbd>+<kbd>F10</kbd> while
        focused) to trigger the normalized context menu event.
      </p>
      <div role="button" tabIndex={0} className="wsu-hookDemo__box" {...contextMenuProps}>
        Right click here
      </div>
      <EventLog events={events} />
    </div>
  );
}

export const Basic: Story = {
  render: () => <Demo />,
};
