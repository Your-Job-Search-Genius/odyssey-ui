import { Input } from "@your-job-search-genius/odyssey-ui";
import { Search02Icon } from "@your-job-search-genius/icons";

export default function InputLeadingIcon() {
  return (
    <div style={{ width: "20rem" }}>
      <Input label="Search" placeholder="Search templates" leadingIcon={<Search02Icon />} />
    </div>
  );
}
