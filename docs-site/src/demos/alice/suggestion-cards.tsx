import { AliceContributionRef, AliceSuggestion } from "@your-job-search-genius/odyssey-ui";

export default function AliceSuggestionCards() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "22rem" }}>
      <AliceSuggestion>
        Use strong action verbs to emphasize your role. Replace passive phrases
        like "was involved" with direct actions such as "Planned" or
        "Coordinated" to convey leadership and initiative clearly.
      </AliceSuggestion>
      <AliceContributionRef>
        Led the design of core merchant-facing tools....
      </AliceContributionRef>
    </div>
  );
}
