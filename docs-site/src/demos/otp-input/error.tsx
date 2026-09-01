import { OtpInput } from "@your-job-search-genius/odyssey-ui";

export default function OtpInputError() {
  return (
    <OtpInput
      label="Verification code"
      length={6}
      errorMessage="That code didn't work. Try again."
    />
  );
}
