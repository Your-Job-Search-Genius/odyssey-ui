import { Button, Form, Radio, RadioGroup } from "@your-job-search-genius/odyssey-ui";

export default function RadioForm() {
  return (
    <div style={{ width: "20rem" }}>
      <Form>
        <RadioGroup label="Favorite pet" name="pet" required>
          <Radio value="dog">Dog</Radio>
          <Radio value="cat">Cat</Radio>
          <Radio value="dragon">Dragon</Radio>
        </RadioGroup>
        <Button type="submit" style={{ marginTop: 8 }}>
          Submit
        </Button>
      </Form>
    </div>
  );
}
