import { useRef, useState } from "react";
import { DragPreview, useDrag, useDrop } from "react-aria";
import type { TextDropItem } from "react-aria";

function Draggable() {
  const preview = useRef(null);
  const { dragProps, isDragging } = useDrag({
    preview,
    getItems() {
      return [{ "text/plain": "hello world" }];
    },
  });

  return (
    <>
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
    </>
  );
}

function DropTarget() {
  const [dropped, setDropped] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { dropProps, isDropTarget } = useDrop({
    ref,
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
    <div
      {...dropProps}
      role="button"
      tabIndex={0}
      ref={ref}
      className="wsu-hookDemo__droppable"
      data-drop-target={isDropTarget}
    >
      {dropped ?? "Drop here"}
    </div>
  );
}

export default function UseDragBasic() {
  return (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Drag with a pointer, or Tab → Enter to start an accessible drag, Tab to
        the target, Enter to drop.
      </p>
      <div className="wsu-hookDemo__row">
        <Draggable />
        <DropTarget />
      </div>
    </div>
  );
}
