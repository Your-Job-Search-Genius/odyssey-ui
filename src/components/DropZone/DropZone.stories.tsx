import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import type { ReactNode } from "react";
import { FileTrigger, Pressable, isFileDropItem } from "react-aria-components";
import type { DropItem } from "react-aria-components";
import { Button } from "../Button";
import { DropZone, Text } from "./DropZone";

const meta: Meta<typeof DropZone> = {
  title: "Custom Components/DropZone",
  component: DropZone,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Thin wrapper around `react-aria-components`' `DropZone` — an area that accepts drag-and-drop content (text, images, files). This is the raw primitive; `FileInput` builds a file-upload-specific experience on top of it. Drag-and-drop should never be the only way in, so pair it with a `FileTrigger`/`Button` (see `WithFileTrigger` below) or a paste handler — `DropZone` already listens for paste as a keyboard-accessible equivalent to dropping.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DropZone>;

export const Playground: Story = {
  render: function Render() {
    const [content, setContent] = useState<ReactNode>(null);
    return (
      <DropZone
        getDropOperation={(types) => (["text/plain", "image/jpeg", "image/png", "image/gif"].some((t) => types.has(t)) ? "copy" : "cancel")}
        onDrop={async (e) => {
          const item = e.items.find((item) => (item.kind === "text" && item.types.has("text/plain")) || (item.kind === "file" && item.type.startsWith("image/")));
          if (item?.kind === "text") {
            setContent(await item.getText("text/plain"));
          } else if (item?.kind === "file") {
            const file = await item.getFile();
            const url = URL.createObjectURL(file);
            setContent(<img src={url} alt={item.name} style={{ maxHeight: 100, maxWidth: "100%" }} />);
          }
        }}
      >
        <Text slot="label">{content ?? "Drop or paste text or images here"}</Text>
      </DropZone>
    );
  },
};

export const WithFileTrigger: Story = {
  name: "With FileTrigger (keyboard/touch fallback)",
  render: function Render() {
    const [files, setFiles] = useState<File[]>([]);

    async function filesFromDropItems(items: DropItem[]): Promise<File[]> {
      const fileItems = items.filter(isFileDropItem);
      return Promise.all(fileItems.map((item) => item.getFile()));
    }

    return (
      <div style={{ width: "24rem" }}>
        <DropZone
          onDrop={async (e) => {
            const dropped = await filesFromDropItems(e.items);
            if (dropped.length) setFiles(dropped);
          }}
        >
          <Text slot="label">{files.length ? files.map((f) => f.name).join(", ") : "Drag and drop, or"}</Text>
          {/* Same trigger-wiring note as FileInput: a plain child doesn't
              consume FileTrigger's press context on its own, so it's
              wrapped in Pressable. */}
          <FileTrigger onSelect={(fileList) => fileList && setFiles(Array.from(fileList))}>
            <Pressable>
              <Button variant="secondary" size="sm">
                Browse files
              </Button>
            </Pressable>
          </FileTrigger>
        </DropZone>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <DropZone isDisabled>
      <Text slot="label">Drop or paste text or images here</Text>
    </DropZone>
  ),
};
