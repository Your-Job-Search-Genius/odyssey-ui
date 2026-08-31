import { useState } from "react";
import { useClipboard } from "react-aria";
import type { TextDropItem } from "react-aria";

export default function UseClipboardBasic() {
  const [pasted, setPasted] = useState<string | null>(null);

  const { clipboardProps: copyProps } = useClipboard({
    getItems() {
      return [{ "text/plain": "hello from Odyssey hook demo" }];
    },
  });

  const { clipboardProps: pasteProps } = useClipboard({
    async onPaste(items) {
      const texts = await Promise.all(
        items
          .filter(
            (item): item is TextDropItem =>
              item.kind === "text" && item.types.has("text/plain"),
          )
          .map((item) => item.getText("text/plain")),
      );
      setPasted(texts.join("\n") || null);
    },
  });

  return (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Focus the left box and press Mod+C, then focus the right box and press Mod+V.
      </p>
      <div className="wsu-hookDemo__row">
        <div
          role="textbox"
          tabIndex={0}
          className="wsu-hookDemo__box"
          aria-label="Copyable text"
          {...copyProps}
        >
          Copy me
          <kbd>Mod+C</kbd>
        </div>
        <div
          role="textbox"
          tabIndex={0}
          className="wsu-hookDemo__box"
          aria-label="Paste target"
          {...pasteProps}
        >
          {pasted ?? "Paste here"}
          <kbd>Mod+V</kbd>
        </div>
      </div>
    </div>
  );
}
