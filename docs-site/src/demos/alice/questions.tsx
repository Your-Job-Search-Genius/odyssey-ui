import { AliceQuestionCard } from "@your-job-search-genius/odyssey-ui";

export default function AliceQuestions() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "22rem" }}>
      <AliceQuestionCard
        current={1}
        total={3}
        question="What is your primary professional background or current role/industry?"
      />
      <AliceQuestionCard answered current={3} total={3} question="" />
    </div>
  );
}
