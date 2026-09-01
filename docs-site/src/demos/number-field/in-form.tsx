import { Button, Form, NumberField } from "@your-job-search-genius/odyssey-ui";

export default function NumberFieldInForm() {
  return (
    <div style={{ width: "16rem" }}>
      <Form>
        <NumberField label="Width" name="width" required />
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}
