import { useState } from "react";
import { useKeyboard } from "react-aria";
import { EventLog } from "../../lib/EventLog";

export default function UseKeyboardBasic() {
  const [events, setEvents] = useState<string[]>([]);
  const add = (message: string) => setEvents((e) => [message, ...e]);

  const { keyboardProps: parentProps } = useKeyboard({
    onKeyDown: () => add("parent onKeyDown"),
  });

  const { keyboardProps: childProps } = useKeyboard({
    shortcuts: {
      "Mod+s": () => add("child shortcut: Mod+S (prevents save dialog)"),
      ArrowLeft: () => add("child shortcut: ArrowLeft (stops propagation)"),
      ArrowRight: () => {
        add("child shortcut: ArrowRight (continues propagation)");
        return false;
      },
    },
    onKeyDown: () => add("child onKeyDown"),
  });

  return (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Focus the field, then press Mod+S, ←, or →.
      </p>
      <div className="wsu-hookDemo__container" {...parentProps}>
        <label className="wsu-hookDemo__field">
          Text field
          <input className="wsu-hookDemo__input" {...childProps} />
        </label>
      </div>
      <EventLog events={events} />
    </div>
  );
}
