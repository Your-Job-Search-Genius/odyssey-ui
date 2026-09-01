import { useState } from "react";
import { Button, Form, Input } from "@your-job-search-genius/odyssey-ui";

export default function FormServerValidationErrors() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div style={{ width: "20rem" }}>
      <Form
        aria-label="Choose a username"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <Input
          label="Username"
          name="username"
          defaultValue="admin"
          errorMessage={submitted ? "This username is not available." : undefined}
          placeholder="Choose a username"
        />
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}
