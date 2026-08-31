import { useState } from "react";
import { useMove } from "react-aria";
import { EventLog } from "../../lib/EventLog";

const CONTAINER_SIZE = 200;
const BALL_SIZE = 30;

export default function UseMoveBasic() {
  const [events, setEvents] = useState<string[]>([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const clamp = (pos: number) => Math.min(Math.max(pos, 0), CONTAINER_SIZE - BALL_SIZE);

  const { moveProps } = useMove({
    onMove(e) {
      setPosition(({ x, y }) => {
        let nx = x;
        let ny = y;
        if (e.pointerType === "keyboard") {
          nx = clamp(nx);
          ny = clamp(ny);
        }
        nx += e.deltaX;
        ny += e.deltaY;
        return { x: nx, y: ny };
      });
      setEvents((ev) => [
        `move ${e.pointerType} Δx=${e.deltaX} Δy=${e.deltaY}`,
        ...ev,
      ]);
    },
    onMoveEnd() {
      setPosition(({ x, y }) => ({ x: clamp(x), y: clamp(y) }));
    },
  });

  return (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Drag the ball, or Tab to it and use the arrow keys.
      </p>
      <div className="wsu-hookDemo__moveArea">
        <div
          className="wsu-hookDemo__ball"
          role="button"
          tabIndex={0}
          aria-label="Draggable ball"
          style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
          {...moveProps}
        />
      </div>
      <EventLog events={events} />
    </div>
  );
}
