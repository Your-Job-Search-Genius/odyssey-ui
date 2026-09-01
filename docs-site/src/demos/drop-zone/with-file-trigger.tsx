import { useState } from "react";
import { Button, DropZone, Text } from "@your-job-search-genius/odyssey-ui";
import { FileTrigger, Pressable, isFileDropItem } from "react-aria-components";
import type { DropItem } from "react-aria-components";

async function filesFromDropItems(items: DropItem[]): Promise<File[]> {
  const fileItems = items.filter(isFileDropItem);
  return Promise.all(fileItems.map((item) => item.getFile()));
}

export default function DropZoneWithFileTrigger() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div style={{ width: "24rem" }}>
      <DropZone
        onDrop={async (e) => {
          const dropped = await filesFromDropItems(e.items);
          if (dropped.length) setFiles(dropped);
        }}
      >
        <Text slot="label">
          {files.length ? files.map((f) => f.name).join(", ") : "Drag and drop, or"}
        </Text>
        {/* A plain child doesn't consume FileTrigger's press context on its
            own, so it's wrapped in Pressable. */}
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
}
