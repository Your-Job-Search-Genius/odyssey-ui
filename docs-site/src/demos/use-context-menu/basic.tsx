import { useState } from "react";
import { useContextMenu } from "react-aria";
import { EventLog } from "../../lib/EventLog";

export default function UseContextMenuBasic() {
  const [events, setEvents] = useState<string[]>([]);
  const { contextMenuProps } = useContextMenu({
    onContextMenu: (e) =>
      setEvents((ev) => [`context menu at (${Math.round(e.x)}, ${Math.round(e.y)})`, ...ev]),
  });

  return (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Right-click, long-press, or press Shift+F10 while focused.
      </p>
      <div role="button" tabIndex={0} className="wsu-hookDemo__box" {...contextMenuProps}>
        Right click here
      </div>
      <EventLog events={events} />
    </div>
  );
}
