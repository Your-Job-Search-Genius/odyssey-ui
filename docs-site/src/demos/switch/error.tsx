import { Switch } from "@your-job-search-genius/odyssey-ui";

export default function SwitchError() {
  return (
    <Switch label="Accept usage terms" required errorMessage="You must accept the terms to continue." />
  );
}
