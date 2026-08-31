import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@your-job-search-genius/odyssey-ui";
import {
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  TextStrikethroughIcon,
} from "@your-job-search-genius/icons";

export default function ToggleButtonGroupDemo() {
  const [formats, setFormats] = useState<Set<string | number>>(new Set(["bold"]));
  return (
    <ToggleButtonGroup
      aria-label="Text formatting"
      selectionMode="multiple"
      selectedKeys={formats}
      onSelectionChange={setFormats}
    >
      <ToggleButton id="bold" aria-label="Bold">
        <TextBoldIcon aria-hidden />
      </ToggleButton>
      <ToggleButton id="italic" aria-label="Italic">
        <TextItalicIcon aria-hidden />
      </ToggleButton>
      <ToggleButton id="underline" aria-label="Underline">
        <TextUnderlineIcon aria-hidden />
      </ToggleButton>
      <ToggleButton id="strikethrough" aria-label="Strikethrough">
        <TextStrikethroughIcon aria-hidden />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
