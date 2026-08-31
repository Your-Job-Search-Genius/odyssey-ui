import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useFocusWithin } from "react-aria";
import { EventLog } from "../shared/EventLog";
import "../shared/hook-demos.css";

const meta: Meta = {
  title: "React Aria Hooks/Focus/useFocusWithin",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`useFocusWithin` handles focus for an element *and* its descendants — it fires when " +
          "the container or anything inside it gains focus, similar to the CSS `:focus-within` " +
          "pseudo-class. Use it for a fieldset-like group of inputs where the whole group should " +
          "look 'active' as long as focus is anywhere inside it. For a single element that should " +
          "ignore its descendants, see `useFocus`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function Demo() {
  const [events, setEvents] = useState<string[]>([]);
  const [isFocusWithin, setFocusWithin] = useState(false);
  const { focusWithinProps } = useFocusWithin({
    onFocusWithin: () => setEvents((e) => [...e, "focus within"]),
    onBlurWithin: () => setEvents((e) => [...e, "blur within"]),
    onFocusWithinChange: setFocusWithin,
  });

  return (
    <div className="wsu-hookDemo">
      <div className="wsu-hookDemo__container" data-active={isFocusWithin} {...focusWithinProps}>
        <label className="wsu-hookDemo__field">
          First name
          <input className="wsu-hookDemo__input" />
        </label>
        <label className="wsu-hookDemo__field">
          Last name
          <input className="wsu-hookDemo__input" />
        </label>
      </div>
      <EventLog events={events} />
    </div>
  );
}

export const Basic: Story = {
  render: () => <Demo />,
};
