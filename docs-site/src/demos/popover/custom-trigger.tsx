import { Popover } from "@your-job-search-genius/odyssey-ui";

export default function PopoverCustomTrigger() {
  return (
    <Popover
      trigger={
        <span role="button" tabIndex={0} className="wsu-Button wsu-Button--secondary wsu-Button--lg">
          Custom trigger
        </span>
      }
    >
      <p style={{ margin: 0, maxWidth: "16rem" }}>
        This popover was opened by a plain <code>&lt;span role=&quot;button&quot;&gt;</code>, not the library&apos;s Button.
      </p>
    </Popover>
  );
}
