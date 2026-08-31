import type { Meta, StoryObj } from "@storybook/react";
import { useFocusRing } from "react-aria";
import "../shared/hook-demos.css";

const meta: Meta = {
  title: "React Aria Hooks/Focus/useFocusRing",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`useFocusRing` is the hooks-only sibling of the `FocusRing` component: it returns an " +
          "`isFocusVisible` boolean directly, for consumers who drive styling from JS (inline " +
          "styles, CSS-in-JS, a data attribute) instead of toggling a CSS class. Same rule as " +
          "`FocusRing` — visible on keyboard focus, hidden on mouse or touch.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function Demo() {
  const { isFocusVisible, focusProps } = useFocusRing();
  return (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Tab to the button — <code>isFocusVisible</code> flips to <code>true</code> and drives the
        box-shadow directly, inline, with no CSS class involved.
      </p>
      <button
        type="button"
        className="wsu-hookDemo__button"
        {...focusProps}
        style={{ boxShadow: isFocusVisible ? "var(--wsu-shadow-focus-ring)" : "none" }}
      >
        Test
      </button>
    </div>
  );
}

export const Basic: Story = {
  render: () => <Demo />,
};
