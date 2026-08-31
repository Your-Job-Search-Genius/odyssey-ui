import { useState } from "react";
import { FileInput } from "@your-job-search-genius/odyssey-ui";

export default function FileInputBasic() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div style={{ width: "24rem" }}>
      <FileInput
        label="Upload your resume"
        helperText="PDF, DOC, or DOCX — up to 10MB"
        onFilesSelected={setFiles}
      />
      {files.length ? (
        <ul style={{ marginTop: "0.75rem" }}>
          {files.map((f) => (
            <li key={f.name}>{f.name}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
