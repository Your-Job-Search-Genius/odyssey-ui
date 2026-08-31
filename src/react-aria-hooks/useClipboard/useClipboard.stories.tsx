import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useClipboard } from "react-aria";
import type { TextDropItem } from "react-aria";
import "../shared/hook-demos.css";

const meta: Meta = {
  title: "React Aria Hooks/Clipboard/useClipboard",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`useClipboard` wires up copy/cut/paste for a focusable element using the operating " +
          "system's native clipboard, so it works between apps too, not just within the page. " +
          "Data can be offered in multiple formats at once — a custom app-specific type plus " +
          "plain-text/HTML fallbacks — so the paste target picks whichever format it understands. " +
          "This is the keyboard-accessible alternative to building copy/paste on drag and drop.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

type Pasted = { message: string; style?: "bold" | "italic" };

function Copyable() {
  const { clipboardProps } = useClipboard({
    getItems() {
      return [
        {
          "text/plain": "hello world",
          "text/html": "<strong>hello world</strong>",
          "wsu-hookdemo-type": JSON.stringify({ message: "hello world", style: "bold" }),
        },
        {
          "text/plain": "foo bar",
          "text/html": "<em>foo bar</em>",
          "wsu-hookdemo-type": JSON.stringify({ message: "foo bar", style: "italic" }),
        },
      ];
    },
  });

  return (
    <div
      role="textbox"
      tabIndex={0}
      className="wsu-hookDemo__box"
      style={{ flexDirection: "column", gap: 4 }}
      aria-label="Copyable rich text"
      {...clipboardProps}
    >
      <div>
        <strong>hello world</strong>
      </div>
      <div>
        <em>foo bar</em>
      </div>
      <kbd>Mod+C</kbd>
    </div>
  );
}

function Pasteable() {
  const [pasted, setPasted] = useState<Pasted[] | null>(null);
  const { clipboardProps } = useClipboard({
    async onPaste(items) {
      const results = await Promise.all(
        items
          .filter(
            (item): item is TextDropItem =>
              item.kind === "text" &&
              (item.types.has("wsu-hookdemo-type") || item.types.has("text/plain")),
          )
          .map(async (item) =>
            item.types.has("wsu-hookdemo-type")
              ? (JSON.parse(await item.getText("wsu-hookdemo-type")) as Pasted)
              : { message: await item.getText("text/plain") },
          ),
      );
      setPasted(results);
    },
  });

  return (
    <div
      role="textbox"
      tabIndex={0}
      className="wsu-hookDemo__box"
      style={{ flexDirection: "column", gap: 4 }}
      aria-label="Paste target"
      {...clipboardProps}
    >
      {pasted ? (
        pasted.map((p, i) => (
          <div key={i}>
            {p.style === "bold" && <strong>{p.message}</strong>}
            {p.style === "italic" && <em>{p.message}</em>}
            {!p.style && p.message}
          </div>
        ))
      ) : (
        <span>Paste here</span>
      )}
      <kbd>Mod+V</kbd>
    </div>
  );
}

export const RichDataCopyPaste: Story = {
  name: "Multi-format copy and paste",
  render: () => (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Focus the left box and press <kbd>Mod</kbd>+<kbd>C</kbd>, then focus the right box and
        press <kbd>Mod</kbd>+<kbd>V</kbd>. Paste into an external rich-text app instead and the{" "}
        <code>text/html</code> fallback is used; paste into a plain-text editor and{" "}
        <code>text/plain</code> is used.
      </p>
      <div className="wsu-hookDemo__row">
        <Copyable />
        <Pasteable />
      </div>
    </div>
  ),
};
