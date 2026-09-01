import { I18nProvider } from "react-aria-components";
import { NumberField } from "@your-job-search-genius/odyssey-ui";

export default function NumberFieldNumberingSystem() {
  return (
    <I18nProvider locale="ar-AE-u-nu-arab">
      <NumberField label="Value" defaultValue={1024} style={{ minWidth: "16rem" }} />
    </I18nProvider>
  );
}
