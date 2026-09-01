import { useState } from "react";
import { AliceQuestionCard } from "@your-job-search-genius/odyssey-ui";

const questions = [
  "What is your primary professional background or current role/industry?",
  "Which achievement are you most proud of in that role?",
  "What kind of role are you targeting next?",
];

export default function AliceQuestionFlow() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div style={{ width: "22.125rem" }}>
        <AliceQuestionCard
          answered
          current={questions.length}
          total={questions.length}
          question=""
          onToggle={() => setDone(false)}
        />
      </div>
    );
  }

  return (
    <div style={{ width: "22.0625rem" }}>
      <AliceQuestionCard
        current={index + 1}
        total={questions.length}
        question={questions[index]}
        value={answers[index]}
        onValueChange={(next) =>
          setAnswers((prev) => prev.map((a, i) => (i === index ? next : a)))
        }
        onPrev={() => setIndex((i) => Math.max(0, i - 1))}
        onNext={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
        onDone={() =>
          index === questions.length - 1 ? setDone(true) : setIndex((i) => i + 1)
        }
      />
    </div>
  );
}
