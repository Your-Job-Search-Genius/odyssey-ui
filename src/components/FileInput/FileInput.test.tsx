import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { FileInput } from "./FileInput";

describe("FileInput", () => {
  it("renders a labeled dropzone with a keyboard-operable browse fallback", () => {
    render(<FileInput label="Upload your resume" onFilesSelected={vi.fn()} />);
    expect(screen.getByText("Upload your resume")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Browse files" })).toBeInTheDocument();
  });

  it("reports selected files from the browse button's file input", async () => {
    const user = userEvent.setup();
    const onFilesSelected = vi.fn();
    const { container } = render(<FileInput label="Upload your resume" onFilesSelected={onFilesSelected} />);
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();
    const file = new File(["resume content"], "resume.pdf", { type: "application/pdf" });
    await user.upload(fileInput, file);
    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it("restricts accepted file types on the underlying input", () => {
    const { container } = render(<FileInput label="Upload your resume" onFilesSelected={vi.fn()} accept={["application/pdf"]} />);
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toHaveAttribute("accept", "application/pdf");
  });

  it("shows helper text", () => {
    render(<FileInput label="Upload your resume" onFilesSelected={vi.fn()} helperText="PDF, up to 10MB" />);
    expect(screen.getByText("PDF, up to 10MB")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<FileInput label="Upload your resume" onFilesSelected={vi.fn()} helperText="PDF, up to 10MB" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
