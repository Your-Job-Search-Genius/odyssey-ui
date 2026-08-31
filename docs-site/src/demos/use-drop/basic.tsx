import { useRef, useState } from "react";
import { DragPreview, useDrag, useDrop } from "react-aria";
import type { TextDropItem } from "react-aria";

/** Pair with useDrag — drop targets need something to drop. */
export default function UseDropBasic() {
  const preview = useRef(null);
  const [dropped, setDropped] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const { dragProps, isDragging } = useDrag({
    preview,
    getItems() {
      return [{ "text/plain": "dropped item" }];
    },
  });

  const { dropProps, isDropTarget } = useDrop({
    ref: dropRef,
    async onDrop(e) {
      const items = await Promise.all(
        e.items
          .filter(
            (item): item is TextDropItem =>
              item.kind === "text" && item.types.has("text/plain"),
          )
          .map((item) => item.getText("text/plain")),
      );
      setDropped(items.join("\n"));
    },
  });

  return (
    <div className="wsu-hookDemo">
      <div className="wsu-hookDemo__row">
        <div
          {...dragProps}
          role="button"
          tabIndex={0}
          className="wsu-hookDemo__draggable"
          data-dragging={isDragging}
        >
          Drag me
        </div>
        <DragPreview ref={preview}>
          {(items) => (
            <div className="wsu-hookDemo__draggable">{items[0]?.["text/plain"]}</div>
          )}
        </DragPreview>
        <div
          {...dropProps}
          role="button"
          tabIndex={0}
          ref={dropRef}
          className="wsu-hookDemo__droppable"
          data-drop-target={isDropTarget}
        >
          {dropped ?? "Drop here"}
        </div>
      </div>
    </div>
  );
}
