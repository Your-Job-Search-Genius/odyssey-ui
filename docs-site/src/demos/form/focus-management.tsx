import { useState } from "react";
import { Button, Form, Input } from "@your-job-search-genius/odyssey-ui";

export default function FormFocusManagement() {
  const [isInvalid, setInvalid] = useState(false);
  return (
    <div style={{ width: "22rem" }}>
      <Form
        aria-label="Sign up"
        onInvalid={(event) => {
          event.preventDefault();
          setInvalid(true);
        }}
        onSubmit={(event) => {
          event.preventDefault();
          setInvalid(false);
        }}
        onReset={() => setInvalid(false)}
      >
        {isInvalid ? (
          <div
            role="alert"
            tabIndex={-1}
            ref={(el) => el?.focus()}
            style={{
              border: "2px solid var(--wsu-color-border-danger)",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <strong>Unable to submit</strong>
            <p style={{ margin: 0 }}>Please fix the validation errors below, and re-submit the form.</p>
          </div>
        ) : null}
        <Input label="First name" name="firstName" isRequired placeholder="Enter your first name" />
        <Input label="Last name" name="lastName" isRequired placeholder="Enter your last name" />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <Button type="submit">Submit</Button>
          <Button type="reset" variant="secondary">
            Reset
          </Button>
        </div>
      </Form>
    </div>
  );
}
