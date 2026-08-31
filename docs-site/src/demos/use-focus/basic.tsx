import { useState } from "react";
import { useFocus } from "react-aria";
import { EventLog } from "../../lib/EventLog";

export default function UseFocusBasic() {
  const [events, setEvents] = useState<string[]>([]);
  const { focusProps } = useFocus({
    onFocus: () => setEvents((e) => [...e, "focus"]),
    onBlur: () => setEvents((e) => [...e, "blur"]),
    onFocusChange: (isFocused) => setEvents((e) => [...e, `focus change: ${isFocused}`]),
  });

  return (
    <div className="wsu-hookDemo">
      <label className="wsu-hookDemo__field">
        Example input
        <input className="wsu-hookDemo__input" {...focusProps} />
      </label>
      <EventLog events={events} />
    </div>
  );
}
