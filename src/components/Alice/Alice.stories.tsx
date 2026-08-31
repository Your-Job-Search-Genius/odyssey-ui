import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AliceIcon } from "./AliceIcon";
import { ChatBubble } from "./ChatBubble";
import { AliceQuestionCard } from "./AliceQuestionCard";
import { AliceRewriteCard } from "./AliceRewriteCard";
import { AliceSuggestion } from "./AliceSuggestion";
import { AliceContributionRef } from "./AliceContributionRef";

/**
 * Every string below is the literal copy from Figma's Alice page
 * (node 461:52), so each story can be diffed against the frame directly.
 */
const REWRITE_TEXT = (
  <>
    Result-driven UI Engineer with <del>proven</del> <ins>senior</ins> expertise in React.js and modern
    front-end development.
  </>
);

const meta: Meta = {
  title: "Figma Components/Composites/Alice",
  parameters: {
    docs: {
      description: {
        component:
          "Alice is the AI assistant coach that guides a user through the product. This family covers Figma's Alice page (node 461:52): the assistant mark, the chat bubbles, and the six resume-interaction surfaces. **Icon caveat:** the sparkle and orb are hand-authored — the file fills them with a paint style whose stops aren't exposed as variables, and its vector assets sit on a host this environment's egress policy blocks. Geometry matches the file; the curve and gradient details are approximations.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/* --- Alice Icon (Figma 462:599) ------------------------------------------ */

export const Icon: Story = {
  name: "Alice Icon — all states",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
      {(["idle", "action", "loading"] as const).map((state) => (
        <div key={state} style={{ display: "grid", justifyItems: "center", gap: "0.5rem" }}>
          <AliceIcon state={state} />
          <code style={{ font: "var(--wsu-font-body-sm)", color: "var(--wsu-color-text-body)" }}>{state}</code>
        </div>
      ))}
    </div>
  ),
};

/* --- Chat Bubble (Figma 464:81) ------------------------------------------ */

export const Chat: Story = {
  name: "Chat Bubble — all variants",
  render: () => (
    <div style={{ display: "flex", gap: "2.75rem", alignItems: "flex-start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", alignItems: "flex-start" }}>
        <ChatBubble from="user">Re-analyse Resume</ChatBubble>
        <ChatBubble from="user" quote="Led a complete design overhaul of Moni's core ecosystem, including the mobile app, marketing website, and a bold brand refresh, positioning the product for scale across African markets.">
          Rewrite this
        </ChatBubble>
      </div>
      <ChatBubble from="alice">
        Please answer Alice&rsquo;s questions above first or you can start a new chat if you want
      </ChatBubble>
    </div>
  ),
};

/* --- Resume Interactions (Figma 464:99) ---------------------------------- */

export const Questions: Story = {
  name: "Resume Interactions — Questions",
  render: () => (
    <div style={{ width: "22.0625rem" /* 353px */ }}>
      <AliceQuestionCard
        current={1}
        total={3}
        question="What is your primary professional background or current role/industry?"
      />
    </div>
  ),
};

export const QuestionsAnswered: Story = {
  name: "Resume Interactions — Questions Answered",
  render: () => (
    <div style={{ width: "22.125rem" /* 354px */ }}>
      <AliceQuestionCard answered current={3} total={3} question="" />
    </div>
  ),
};

export const Rewrite: Story = {
  name: "Resume Interactions — Rewrite",
  render: () => (
    <div style={{ width: "22.1875rem" /* 355px */ }}>
      <AliceRewriteCard>{REWRITE_TEXT}</AliceRewriteCard>
    </div>
  ),
};

export const MultipleRewrite: Story = {
  name: "Resume Interactions — Multiple Rewrite",
  render: () => (
    <div style={{ width: "22.0625rem" /* 353px */ }}>
      <AliceRewriteCard
        title="Contributions Rewrite"
        count={{ current: 1, total: 8 }}
        secondaryAction="dismiss"
        nextPreview={REWRITE_TEXT}
        onAcceptAll={() => {}}
      >
        {REWRITE_TEXT}
      </AliceRewriteCard>
    </div>
  ),
};

export const SuggestedImprovement: Story = {
  name: "Resume Interactions — Suggested Improvement",
  render: () => (
    <div style={{ width: "22.1875rem" /* 355px */ }}>
      <AliceSuggestion>
        Use strong action verbs to emphasize your role. Replace passive phrases like &ldquo;was
        involved&rdquo; with direct actions such as &ldquo;Planned&rdquo; or &ldquo;Coordinated&rdquo; to
        convey leadership and initiative clearly.
      </AliceSuggestion>
    </div>
  ),
};

export const ContributionRef: Story = {
  name: "Resume Interactions — Contribution Ref",
  render: () => (
    <div style={{ width: "22.0625rem" /* 353px */ }}>
      <AliceContributionRef>Led the design of core merchant-facing tools....</AliceContributionRef>
    </div>
  ),
};

/* --- Frame parity --------------------------------------------------------- */

export const FigmaFrameParity: Story = {
  name: "Figma frame parity (Alice page)",
  parameters: {
    docs: {
      description: {
        story:
          "All twelve variants laid out the way Figma's Alice page groups them, for direct visual diffing against node 461:52.",
      },
    },
  },
  render: () => {
    const heading = {
      font: "var(--wsu-font-heading-sm)",
      color: "var(--wsu-color-text-heading)",
      margin: "0 0 1.25rem",
    } as const;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "2.625rem" }}>
        <section>
          <h3 style={heading}>Alice Icon</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <AliceIcon state="idle" />
            <AliceIcon state="action" />
            <AliceIcon state="loading" />
          </div>
        </section>

        <section>
          <h3 style={heading}>Chat Bubble</h3>
          <div style={{ display: "flex", gap: "2.75rem", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", alignItems: "flex-start" }}>
              <ChatBubble from="user">Re-analyse Resume</ChatBubble>
              <ChatBubble from="user" quote="Led a complete design overhaul of Moni's core ecosystem, including the mobile app, marketing website, and a bold brand refresh, positioning the product for scale across African markets.">
                Rewrite this
              </ChatBubble>
            </div>
            <ChatBubble from="alice">
              Please answer Alice&rsquo;s questions above first or you can start a new chat if you want
            </ChatBubble>
          </div>
        </section>

        <section>
          <h3 style={heading}>Resume Interactions</h3>
          <div style={{ display: "flex", gap: "4.1875rem", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.1875rem", width: "22.125rem" }}>
              <AliceQuestionCard answered current={3} total={3} question="" />
              <AliceQuestionCard
                current={1}
                total={3}
                question="What is your primary professional background or current role/industry?"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.625rem", width: "22.1875rem" }}>
              <AliceRewriteCard>{REWRITE_TEXT}</AliceRewriteCard>
              <AliceRewriteCard
                title="Contributions Rewrite"
                count={{ current: 1, total: 8 }}
                secondaryAction="dismiss"
                nextPreview={REWRITE_TEXT}
                onAcceptAll={() => {}}
              >
                {REWRITE_TEXT}
              </AliceRewriteCard>
            </div>

            <div style={{ width: "22.1875rem" }}>
              <AliceSuggestion>
                Use strong action verbs to emphasize your role. Replace passive phrases like &ldquo;was
                involved&rdquo; with direct actions such as &ldquo;Planned&rdquo; or
                &ldquo;Coordinated&rdquo; to convey leadership and initiative clearly.
              </AliceSuggestion>
            </div>

            <div style={{ width: "22.0625rem" }}>
              <AliceContributionRef>Led the design of core merchant-facing tools....</AliceContributionRef>
            </div>
          </div>
        </section>
      </div>
    );
  },
};

/* --- Interactive ---------------------------------------------------------- */

export const InteractiveQuestionFlow: Story = {
  name: "Interactive question flow",
  render: () => {
    function Demo() {
      const questions = [
        "What is your primary professional background or current role/industry?",
        "Which achievement are you most proud of in that role?",
        "What kind of role are you targeting next?",
      ];
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
            onDone={() => (index === questions.length - 1 ? setDone(true) : setIndex((i) => i + 1))}
          />
        </div>
      );
    }
    return <Demo />;
  },
};
