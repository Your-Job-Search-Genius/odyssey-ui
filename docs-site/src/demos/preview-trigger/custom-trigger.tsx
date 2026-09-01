import { PreviewTrigger } from "@your-job-search-genius/odyssey-ui";
import { Focusable } from "react-aria-components";

export default function PreviewTriggerCustomTrigger() {
  return (
    <PreviewTrigger
      trigger={
        <Focusable>
          <span role="link" tabIndex={0} className="wsu-Link">
            Custom trigger
          </span>
        </Focusable>
      }
    >
      <p style={{ margin: 0, maxWidth: "16rem" }}>
        This preview was triggered by a plain element wrapped in Focusable, not the library&apos;s Link.
      </p>
    </PreviewTrigger>
  );
}
