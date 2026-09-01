import { FileInput } from "@your-job-search-genius/odyssey-ui";

export default function FileInputAcceptPdfOnly() {
  return (
    <div style={{ width: "24rem" }}>
      <FileInput
        label="Upload your resume"
        helperText="PDF, DOC, or DOCX — up to 10MB"
        accept={["application/pdf"]}
        onFilesSelected={() => {}}
      />
    </div>
  );
}
