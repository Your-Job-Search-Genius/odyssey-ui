import { useState } from "react";
import { usePress } from "react-aria";
import { EventLog } from "../../lib/EventLog";

export default function UsePressBasic() {
  const [events, setEvents] = useState<string[]>([]);
  const { pressProps, isPressed } = usePress({
    onPressStart: (e) => setEvents((ev) => [...ev, `press start with ${e.pointerType}`]),
    onPressEnd: (e) => setEvents((ev) => [...ev, `press end with ${e.pointerType}`]),
    onPress: (e) => setEvents((ev) => [...ev, `press with ${e.pointerType}`]),
  });

  return (
    <div className="wsu-hookDemo">
      <div
        role="button"
        tabIndex={0}
        className="wsu-hookDemo__box"
        data-active={isPressed}
        {...pressProps}
      >
        Press me
      </div>
      <EventLog events={events} />
    </div>
  );
}
