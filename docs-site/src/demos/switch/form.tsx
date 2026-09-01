import { Button, Form, Switch } from "@your-job-search-genius/odyssey-ui";

export default function SwitchForm() {
  return (
    <div style={{ width: "20rem" }}>
      <Form>
        <Switch
          name="two-factor"
          label="Two-factor authentication"
          required
          description="Your organization requires two-factor authentication."
        />
        <Button type="submit" style={{ marginTop: 8 }}>
          Submit
        </Button>
      </Form>
    </div>
  );
}
