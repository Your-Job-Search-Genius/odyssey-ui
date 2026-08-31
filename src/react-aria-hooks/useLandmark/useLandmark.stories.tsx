import { useRef } from "react";
import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useLandmark } from "react-aria";
import "../shared/hook-demos.css";

const meta: Meta = {
  title: "React Aria Hooks/Interactions/useLandmark",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Browsers don't provide a consistent way to jump between page landmarks with the " +
          "keyboard. `useLandmark` registers an element as a navigable landmark and enables " +
          "`F6` / `Shift+F6` to cycle between every registered landmark on the page (`Alt+F6` " +
          "jumps straight to the `main` landmark), restoring focus to whatever was last focused " +
          "inside a landmark when navigating back to it.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function Navigation({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null);
  const { landmarkProps } = useLandmark({ role: "navigation" }, ref);
  return (
    <nav ref={ref} className="wsu-hookDemo__landmark" {...landmarkProps}>
      {children}
    </nav>
  );
}

function Search() {
  const ref = useRef<HTMLFormElement | null>(null);
  const { landmarkProps } = useLandmark({ role: "search" }, ref);
  return (
    <form ref={ref} className="wsu-hookDemo__landmark" {...landmarkProps}>
      <label className="wsu-hookDemo__field" htmlFor="hookdemo-landmark-search">
        Search
        <input id="hookdemo-landmark-search" type="search" className="wsu-hookDemo__input" />
      </label>
    </form>
  );
}

function Region({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null);
  const { landmarkProps } = useLandmark({ role: "region", "aria-label": "Example region" }, ref);
  return (
    <article ref={ref} className="wsu-hookDemo__landmark" {...landmarkProps}>
      {children}
    </article>
  );
}

export const Basic: Story = {
  render: () => (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Click anywhere on this page, then press <kbd>F6</kbd> / <kbd>Shift</kbd>+<kbd>F6</kbd> to
        jump between the three landmarks below.
      </p>
      <Navigation>
        <h3>Navigation</h3>
        <ul>
          <li>
            <a href="#hookdemo-link-1">Link 1</a>
          </li>
          <li>
            <a href="#hookdemo-link-2">Link 2</a>
          </li>
        </ul>
      </Navigation>
      <Search />
      <Region>
        <h3>Region</h3>
        <p>Example region with no focusable children.</p>
      </Region>
    </div>
  ),
};
