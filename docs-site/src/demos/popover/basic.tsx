import { useState } from "react";
import { Button, Checkbox, Popover } from "@your-job-search-genius/odyssey-ui";
import { Setting02Icon } from "@your-job-search-genius/icons";

export default function PopoverBasic() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  return (
    <Popover trigger={<Button leadingIcon={<Setting02Icon />} aria-label="Notification settings" variant="secondary" />}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", minWidth: "14rem" }}>
        <Checkbox label="Email alerts" checked={emailAlerts} onChange={setEmailAlerts} />
        <Checkbox label="Weekly digest" checked={weeklyDigest} onChange={setWeeklyDigest} />
      </div>
    </Popover>
  );
}
