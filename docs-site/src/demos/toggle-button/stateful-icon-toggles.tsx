import { useState } from "react";
import { ToggleButton } from "@your-job-search-genius/odyssey-ui";
import { Sun01Icon, MoonIcon, VolumeHighIcon, VolumeOff02Icon } from "@your-job-search-genius/icons";

export default function ToggleButtonStatefulIconToggles() {
  const [dark, setDark] = useState(false);
  const [muted, setMuted] = useState(false);
  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <ToggleButton aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} selected={dark} onChange={setDark}>
        {dark ? <MoonIcon aria-hidden /> : <Sun01Icon aria-hidden />}
      </ToggleButton>
      <ToggleButton aria-label={muted ? "Unmute" : "Mute"} selected={muted} onChange={setMuted}>
        {muted ? <VolumeOff02Icon aria-hidden /> : <VolumeHighIcon aria-hidden />}
      </ToggleButton>
    </div>
  );
}
