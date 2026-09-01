import { DropZone, Text } from "@your-job-search-genius/odyssey-ui";

export default function DropZoneDisabled() {
  return (
    <DropZone isDisabled>
      <Text slot="label">Drop or paste text or images here</Text>
    </DropZone>
  );
}
