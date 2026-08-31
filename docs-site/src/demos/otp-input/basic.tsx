import { OtpInput } from "@your-job-search-genius/odyssey-ui";

export default function OtpInputBasic() {
  return (
    <OtpInput
      label="Verification code"
      length={6}
      helperText="We sent a code to your email."
    />
  );
}
