import { Input } from "@your-job-search-genius/odyssey-ui";

export default function InputPassword() {
  return (
    <div style={{ width: "20rem" }}>
      <Input label="Password" type="password" defaultValue="hunter2" />
    </div>
  );
}
