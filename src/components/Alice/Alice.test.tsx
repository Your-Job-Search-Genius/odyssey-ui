import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { AliceIcon } from "./AliceIcon";
import { ChatBubble } from "./ChatBubble";
import { AliceQuestionCard } from "./AliceQuestionCard";
import { AliceRewriteCard } from "./AliceRewriteCard";
import { AliceSuggestion } from "./AliceSuggestion";
import { AliceContributionRef } from "./AliceContributionRef";

describe("AliceIcon", () => {
  it("is hidden from assistive tech unless labeled", () => {
    const { container, rerender } = render(<AliceIcon />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    rerender(<AliceIcon label="Alice" />);
    expect(screen.getByRole("img", { name: "Alice" })).toBeInTheDocument();
  });

  it("exposes the loading state as a live status when labeled", () => {
    render(<AliceIcon state="loading" label="Alice is thinking" />);
    expect(screen.getByRole("status", { name: "Alice is thinking" })).toBeInTheDocument();
  });
});

describe("ChatBubble", () => {
  it("renders the quoted source alongside the message", () => {
    render(
      <ChatBubble from="user" quote="Led a complete design overhaul.">
        Rewrite this
      </ChatBubble>,
    );
    expect(screen.getByText("Led a complete design overhaul.")).toBeInTheDocument();
    expect(screen.getByText("Rewrite this")).toBeInTheDocument();
  });

  it("has no axe violations across all three variants", async () => {
    const { container } = render(
      <>
        <ChatBubble from="user">Re-analyse Resume</ChatBubble>
        <ChatBubble from="user" quote="Quoted line.">
          Rewrite this
        </ChatBubble>
        <ChatBubble from="alice">Please answer the questions above first.</ChatBubble>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("AliceQuestionCard", () => {
  it("keeps Done disabled until an answer is typed", async () => {
    const user = userEvent.setup();
    const onDone = vi.fn();
    render(<AliceQuestionCard current={1} total={3} question="What is your background?" onDone={onDone} />);

    const done = screen.getByRole("button", { name: "Done" });
    expect(done).toBeDisabled();

    await user.type(screen.getByRole("textbox"), "UI engineering");
    expect(done).toBeEnabled();
    await user.click(done);
    expect(onDone).toHaveBeenCalled();
  });

  it("supports a controlled answer value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <AliceQuestionCard current={1} total={3} question="Q" value="" onValueChange={onValueChange} />,
    );
    await user.type(screen.getByRole("textbox"), "a");
    expect(onValueChange).toHaveBeenCalledWith("a");
  });

  it("disables Prev on the first question and Next on the last", () => {
    const { rerender } = render(<AliceQuestionCard current={1} total={3} question="Q" />);
    expect(screen.getByRole("button", { name: "Prev" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();

    rerender(<AliceQuestionCard current={3} total={3} question="Q" />);
    expect(screen.getByRole("button", { name: "Prev" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("collapses to the answered state without the answer field", () => {
    render(<AliceQuestionCard answered current={3} total={3} question="Q" />);
    expect(screen.getByRole("button", { name: /Answered/ })).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <AliceQuestionCard current={1} total={3} question="What is your background?" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("AliceRewriteCard", () => {
  it("pairs Accept with Improve by default and Dismiss when asked", () => {
    const { rerender } = render(<AliceRewriteCard>Text</AliceRewriteCard>);
    expect(screen.getByRole("button", { name: "Improve" })).toBeInTheDocument();

    rerender(<AliceRewriteCard secondaryAction="dismiss">Text</AliceRewriteCard>);
    expect(screen.getByRole("button", { name: /Dismiss/ })).toBeInTheDocument();
  });

  it("renders the stepper and accept-all footer for a run of rewrites", async () => {
    const user = userEvent.setup();
    const onAcceptAll = vi.fn();
    render(
      <AliceRewriteCard
        title="Contributions Rewrite"
        count={{ current: 1, total: 8 }}
        secondaryAction="dismiss"
        nextPreview="Next one"
        onAcceptAll={onAcceptAll}
      >
        Text
      </AliceRewriteCard>,
    );
    expect(screen.getByText("1/8")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous rewrite" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: /Accept all changes/ }));
    expect(onAcceptAll).toHaveBeenCalled();
  });

  it("marks up the diff with del/ins rather than color alone", () => {
    const { container } = render(
      <AliceRewriteCard>
        Result-driven engineer with <del>proven</del> <ins>senior</ins> expertise.
      </AliceRewriteCard>,
    );
    expect(container.querySelector("del")).toHaveTextContent("proven");
    expect(container.querySelector("ins")).toHaveTextContent("senior");
  });

  it("has no axe violations in both shapes", async () => {
    const { container } = render(
      <>
        <AliceRewriteCard>Single</AliceRewriteCard>
        <AliceRewriteCard
          title="Contributions Rewrite"
          count={{ current: 2, total: 8 }}
          secondaryAction="dismiss"
          nextPreview="Next"
          onAcceptAll={() => {}}
        >
          Multiple
        </AliceRewriteCard>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("AliceSuggestion / AliceContributionRef", () => {
  it("renders their content and passes axe", async () => {
    const { container } = render(
      <>
        <AliceSuggestion>Use strong action verbs.</AliceSuggestion>
        <AliceContributionRef>Led the design of core tools.</AliceContributionRef>
      </>,
    );
    expect(screen.getByText("Use strong action verbs.")).toBeInTheDocument();
    expect(screen.getByText("Led the design of core tools.")).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
