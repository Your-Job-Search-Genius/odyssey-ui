import type { Meta, StoryObj } from "@storybook/react";
import { useFocusVisible } from "react-aria";
import "../shared/hook-demos.css";

const meta: Meta = {
  title: "React Aria Hooks/Focus/useFocusVisible",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`useFocusVisible` tracks keyboard-focus visibility for the whole page, not a single " +
          "element — it's the primitive that both `useFocusRing` and `FocusRing` are built on. " +
          "Most components should reach for those two instead; use this one directly only when " +
          "a single global signal is needed (e.g. toggling a page-level 'keyboard mode' " +
          "indicator).",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function Demo() {
  const { isFocusVisible } = useFocusVisible();
  return (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Click anywhere with the mouse, then press <kbd>Tab</kbd> — the readout below flips
        instantly and globally, regardless of which field ends up focused.
      </p>
      <p>
        Focus visible: <strong>{String(isFocusVisible)}</strong>
      </p>
      <div className="wsu-hookDemo__row">
        <label className="wsu-hookDemo__field">
          First name
          <input className="wsu-hookDemo__input" />
        </label>
        <label className="wsu-hookDemo__field">
          Last name
          <input className="wsu-hookDemo__input" />
        </label>
      </div>
    </div>
  );
}

export const Basic: Story = {
  render: () => <Demo />,
};
