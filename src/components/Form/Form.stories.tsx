import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { Form } from "./Form";
import { Input } from "../Input";
import { Button } from "../Button";

const meta: Meta<typeof Form> = {
  title: "Figma Components/Primitives/Form",
  component: Form,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Built on `react-aria-components`' `Form` — a real `<form>` element that adds `validationErrors` (server-side field errors, threaded to RAC-based fields via context) and `onInvalid`/`validationBehavior` on top of native form semantics. **Use when:** grouping inputs for submission as a unit. Not in source Figma — pure layout/behavior scaffolding; each field renders its own label/error UI, same as everywhere else in this library.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Form>;

export const Playground: Story = {
  render: () => {
    function Demo() {
      const [greeting, setGreeting] = useState("");
      return (
        <div style={{ width: "20rem" }}>
          <Form
            aria-label="Contact"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              setGreeting(`Hello, ${data.get("name")}!`);
            }}
            onReset={() => setGreeting("")}
          >
            <Input label="Name" name="name" isRequired placeholder="Enter your full name" />
            <Input label="Email" name="email" type="email" isRequired placeholder="Enter your email" />
            <div style={{ display: "flex", gap: 8 }}>
              <Button type="submit">Submit</Button>
              <Button type="reset" variant="secondary">
                Reset
              </Button>
            </div>
            {greeting ? <p role="status">{greeting}</p> : null}
          </Form>
        </div>
      );
    }
    return <Demo />;
  },
};

export const NativeValidation: Story = {
  name: "Native validation (required fields)",
  render: () => (
    <div style={{ width: "20rem" }}>
      <Form aria-label="Sign up">
        <Input label="First name" name="firstName" isRequired placeholder="Enter your first name" />
        <Input label="Last name" name="lastName" isRequired placeholder="Enter your last name" />
        <div style={{ display: "flex", gap: 8 }}>
          <Button type="submit">Submit</Button>
          <Button type="reset" variant="secondary">
            Reset
          </Button>
        </div>
      </Form>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Leaving the first required field empty and submitting blocks submission
    // natively and moves focus to it, rather than navigating away.
    await userEvent.click(canvas.getByRole("button", { name: "Submit" }));
    await expect(canvas.getByRole("textbox", { name: "First name" })).toHaveFocus();
  },
};

export const ServerValidationErrors: Story = {
  name: "Server validation errors",
  render: () => {
    function Demo() {
      const [submitted, setSubmitted] = useState(false);
      return (
        <div style={{ width: "20rem" }}>
          <Form
            aria-label="Choose a username"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <Input
              label="Username"
              name="username"
              defaultValue="admin"
              errorMessage={submitted ? "This username is not available." : undefined}
              placeholder="Choose a username"
            />
            <Button type="submit">Submit</Button>
          </Form>
        </div>
      );
    }
    return <Demo />;
  },
};

export const FocusManagement: Story = {
  name: "Custom invalid-submit focus management",
  render: () => {
    function Demo() {
      const [isInvalid, setInvalid] = useState(false);
      return (
        <div style={{ width: "22rem" }}>
          <Form
            aria-label="Sign up"
            onInvalid={(event) => {
              event.preventDefault();
              setInvalid(true);
            }}
            onSubmit={(event) => {
              event.preventDefault();
              setInvalid(false);
            }}
            onReset={() => setInvalid(false)}
          >
            {isInvalid ? (
              <div
                role="alert"
                tabIndex={-1}
                ref={(el) => el?.focus()}
                style={{
                  border: "2px solid var(--wsu-color-border-danger)",
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <strong>Unable to submit</strong>
                <p style={{ margin: 0 }}>Please fix the validation errors below, and re-submit the form.</p>
              </div>
            ) : null}
            <Input label="First name" name="firstName" isRequired placeholder="Enter your first name" />
            <Input label="Last name" name="lastName" isRequired placeholder="Enter your last name" />
            <div style={{ display: "flex", gap: 8 }}>
              <Button type="submit">Submit</Button>
              <Button type="reset" variant="secondary">
                Reset
              </Button>
            </div>
          </Form>
        </div>
      );
    }
    return <Demo />;
  },
};
