import { useState } from "react";
import { Button, CommandPalette } from "@your-job-search-genius/odyssey-ui";
import {
  Delete02Icon,
  FileStarIcon,
  FileUploadIcon,
  PencilIcon,
  RepeatIcon,
  SearchList01Icon,
} from "@your-job-search-genius/icons";

const commands = [
  { id: "default", label: "Make Default Resume", icon: <FileStarIcon /> },
  { id: "review", label: "Review against a job", icon: <SearchList01Icon /> },
  { id: "upload", label: "Upload Existing Resume", icon: <FileUploadIcon /> },
  { id: "edit", label: "Edit", icon: <PencilIcon /> },
  { id: "reanalyze", label: "Re-Analyze", icon: <RepeatIcon /> },
  { id: "delete", label: "Delete", icon: <Delete02Icon /> },
];

export default function CommandPaletteBasic() {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Open command palette
        <kbd style={{ marginInlineStart: "0.5rem", fontFamily: "inherit" }}>⌘J</kbd>
      </Button>
      <CommandPalette isOpen={isOpen} onOpenChange={setOpen} items={commands} />
    </>
  );
}
