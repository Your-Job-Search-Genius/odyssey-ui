import { useState } from "react";
import { useFocusWithin } from "react-aria";
import { EventLog } from "../../lib/EventLog";

export default function UseFocusWithinBasic() {
  const [events, setEvents] = useState<string[]>([]);
  const [isFocusWithin, setFocusWithin] = useState(false);
  const { focusWithinProps } = useFocusWithin({
    onFocusWithin: () => setEvents((e) => [...e, "focus within"]),
    onBlurWithin: () => setEvents((e) => [...e, "blur within"]),
    onFocusWithinChange: setFocusWithin,
  });

  return (
    <div className="wsu-hookDemo">
      <div className="wsu-hookDemo__container" data-active={isFocusWithin} {...focusWithinProps}>
        <label className="wsu-hookDemo__field">
          First name
          <input className="wsu-hookDemo__input" />
        </label>
        <label className="wsu-hookDemo__field">
          Last name
          <input className="wsu-hookDemo__input" />
        </label>
      </div>
      <EventLog events={events} />
    </div>
  );
}
