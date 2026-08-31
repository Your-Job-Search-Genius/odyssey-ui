import { Link } from "@your-job-search-genius/odyssey-ui";

export default function LinkBasic() {
  return (
    <p style={{ margin: 0 }}>
      Built on{" "}
      <Link href="https://react-spectrum.adobe.com/react-aria/" target="_blank">
        React Aria
      </Link>
      . This one is disabled:{" "}
      <Link href="https://example.com" isDisabled>
        unavailable
      </Link>
      .
    </p>
  );
}
