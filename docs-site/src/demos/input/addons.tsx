import { Button, Input } from "@your-job-search-genius/odyssey-ui";
import { ArrowDown01SharpIcon, Search02Icon } from "@your-job-search-genius/icons";

export default function InputAddons() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "27rem" }}>
      <Input
        label="Phone number"
        prefix={
          <>
            US
            <ArrowDown01SharpIcon size="1rem" />
          </>
        }
        placeholder="555 0100"
        helperText="Country code is a prefix slot, not a separate field."
      />
      <Input
        label="Website"
        prefix="https://"
        placeholder="example.com"
        action={
          <Button variant="accent" size="sm">
            Paste
          </Button>
        }
      />
      <Input label="Search" trailingIcon={<Search02Icon />} placeholder="Search templates" />
    </div>
  );
}
