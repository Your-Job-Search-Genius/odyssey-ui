import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FileInput } from "./FileInput";

const meta: Meta<typeof FileInput> = {
  title: "Custom Components/FileInput",
  component: FileInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Designed from the WAI-ARIA APG pattern plus this system's own visual language (radius, spacing, colour and focus tokens), and re-checked against the corrected tokens after the Figma audit. Not present in the source Figma file — built on `react-aria-components`' DropZone + FileTrigger. Drag-and-drop is never the only way in: the \"Browse files\" button opens the OS file picker, since drag-and-drop alone excludes keyboard, touch, and screen-reader users (WCAG 2.1.1, 2.5.1). **Use when:** uploading one or more files (e.g. a resume).",
      },
    },
  },
  args: { label: "Upload your resume", helperText: "PDF, DOC, or DOCX — up to 10MB" },
};

export default meta;
type Story = StoryObj<typeof FileInput>;

export const Playground: Story = {
  render: (args) => {
    function Demo() {
      const [files, setFiles] = useState<File[]>([]);
      return (
        <div style={{ width: "24rem" }}>
          <FileInput {...args} onFilesSelected={setFiles} />
          {files.length ? (
            <ul style={{ marginTop: "0.75rem", font: "var(--wsu-font-body-sm)" }}>
              {files.map((f) => (
                <li key={f.name}>{f.name}</li>
              ))}
            </ul>
          ) : null}
        </div>
      );
    }
    return <Demo />;
  },
};

export const AcceptPdfOnly: Story = {
  args: { accept: ["application/pdf"] },
  render: (args) => (
    <div style={{ width: "24rem" }}>
      <FileInput {...args} onFilesSelected={() => {}} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div style={{ width: "24rem" }}>
      <FileInput {...args} onFilesSelected={() => {}} />
    </div>
  ),
};
