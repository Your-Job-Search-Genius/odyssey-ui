import { useState } from "react";
import { Button, Form, Input } from "@your-job-search-genius/odyssey-ui";

export default function FormValidation() {
  const [greeting, setGreeting] = useState("");
  return (
    <div style={{ width: "20rem" }}>
      <Form
        aria-label="Contact"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setGreeting(`Hello, ${data.get("name")}!`);
        }}
        onReset={() => setGreeting("")}
      >
        <Input label="Name" name="name" isRequired placeholder="Enter your full name" />
        <Input label="Email" name="email" type="email" isRequired placeholder="Enter your email" />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <Button type="submit">Submit</Button>
          <Button type="reset" variant="secondary">
            Reset
          </Button>
        </div>
        {greeting ? <p role="status">{greeting}</p> : null}
      </Form>
    </div>
  );
}
