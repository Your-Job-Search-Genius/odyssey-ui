import { useState } from "react";
import { useHover } from "react-aria";
import { EventLog } from "../../lib/EventLog";

export default function UseHoverBasic() {
  const [events, setEvents] = useState<string[]>([]);
  const { hoverProps, isHovered } = useHover({
    onHoverStart: (e) => setEvents((ev) => [...ev, `hover start with ${e.pointerType}`]),
    onHoverEnd: (e) => setEvents((ev) => [...ev, `hover end with ${e.pointerType}`]),
  });

  return (
    <div className="wsu-hookDemo">
      <div
        role="button"
        tabIndex={0}
        className="wsu-hookDemo__box"
        data-active={isHovered}
        {...hoverProps}
      >
        Hover me
      </div>
      <EventLog events={events} />
    </div>
  );
}
