import { useState, type ReactNode } from "react";
import { DropZone, Text } from "@your-job-search-genius/odyssey-ui";

export default function DropZoneBasic() {
  const [content, setContent] = useState<ReactNode>(null);
  return (
    <DropZone
      getDropOperation={(types) =>
        ["text/plain", "image/jpeg", "image/png", "image/gif"].some((t) =>
          types.has(t),
        )
          ? "copy"
          : "cancel"
      }
      onDrop={async (e) => {
        const item = e.items.find(
          (it) =>
            (it.kind === "text" && it.types.has("text/plain")) ||
            (it.kind === "file" && it.type.startsWith("image/")),
        );
        if (item?.kind === "text") {
          setContent(await item.getText("text/plain"));
        } else if (item?.kind === "file") {
          const file = await item.getFile();
          const url = URL.createObjectURL(file);
          setContent(
            <img
              src={url}
              alt={item.name}
              style={{ maxHeight: 100, maxWidth: "100%" }}
            />,
          );
        }
      }}
    >
      <Text slot="label">{content ?? "Drop or paste text or images here"}</Text>
    </DropZone>
  );
}
