import type { Meta, StoryObj } from "@storybook/react";
import { FocusRing } from "react-aria";
import "../shared/hook-demos.css";

const meta: Meta = {
  title: "React Aria Hooks/Focus/FocusRing",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`FocusRing` applies a CSS class to its child only while the user is navigating with a " +
          "keyboard — never on mouse, touch, or other pointer input. It's the CSS-class-based " +
          "counterpart to `useFocusRing` for consumers who style with plain classes instead of JS. " +
          "Reach for it when a custom interactive element needs a focus indicator that behaves " +
          "like the browser's native `:focus-visible`, on elements or in browsers where that " +
          "pseudo-class alone isn't reliable enough.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Click the button with a mouse — no ring appears. Then press <kbd>Tab</kbd> to reach it
        with the keyboard instead — the ring shows up immediately, styled with this design
        system&rsquo;s own <code>--wsu-shadow-focus-ring</code> token.
      </p>
      <FocusRing focusRingClass="wsu-hookDemo__focusRing">
        <button type="button" className="wsu-hookDemo__button">
          Tab to me
        </button>
      </FocusRing>
    </div>
  ),
};
