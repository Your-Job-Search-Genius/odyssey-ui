import { useState } from "react";
import { mergeProps, useLongPress, usePress } from "react-aria";
import { EventLog } from "../../lib/EventLog";

export default function UseLongPressBasic() {
  const [events, setEvents] = useState<string[]>([]);
  const [mode, setMode] = useState("Normal speed");

  const { longPressProps } = useLongPress({
    accessibilityDescription: "Long press to activate hyper speed",
    onLongPressStart: (e) =>
      setEvents((ev) => [`long press start with ${e.pointerType}`, ...ev]),
    onLongPressEnd: (e) =>
      setEvents((ev) => [`long press end with ${e.pointerType}`, ...ev]),
    onLongPress: (e) => {
      setMode("Hyper speed");
      setEvents((ev) => [`long press with ${e.pointerType}`, ...ev]);
    },
  });

  const { pressProps } = usePress({
    onPress: (e) => {
      setMode("Normal speed");
      setEvents((ev) => [`press with ${e.pointerType}`, ...ev]);
    },
  });

  return (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        A short press sets normal speed. Hold for 500ms to activate hyper speed.
      </p>
      <button
        type="button"
        className="wsu-hookDemo__button"
        {...mergeProps(pressProps, longPressProps)}
      >
        {mode}
      </button>
      <EventLog events={events} />
    </div>
  );
}
