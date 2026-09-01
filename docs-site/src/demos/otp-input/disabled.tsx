import { OtpInput } from "@your-job-search-genius/odyssey-ui";

export default function OtpInputDisabled() {
  return (
    <OtpInput label="Verification code" length={6} disabled defaultValue="123" />
  );
}
