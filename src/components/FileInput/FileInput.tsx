import { DropZone, FileTrigger, Pressable, isFileDropItem } from "react-aria-components";
import type { DropItem } from "react-aria-components";
import { Button } from "../Button";
import { UploadGlyph } from "../Icon/glyphs";
import "./FileInput.css";

export interface FileInputProps {
  /** Visible label describing what to upload (WCAG 3.3.2 — announced as this dropzone's accessible name). */
  label: string;
  helperText?: string;
  accept?: string[];
  allowsMultiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

async function filesFromDropItems(items: DropItem[]): Promise<File[]> {
  const fileItems = items.filter(isFileDropItem);
  return Promise.all(fileItems.map((item) => item.getFile()));
}

/**
 * FileInput — not present in the source Figma file (on the "missing
 * components" list); built on `react-aria-components`' `DropZone` +
 * `FileTrigger`. Drag-and-drop is never the *only* way in: `FileTrigger`
 * wraps a real button that opens the OS file picker, since drag-and-drop
 * alone excludes keyboard and touch/screen-reader users entirely (WCAG
 * 2.1.1, 2.5.1).
 */
export function FileInput({
  label,
  helperText,
  accept,
  allowsMultiple,
  onFilesSelected,
  disabled,
  className,
  style,
}: FileInputProps) {
  return (
    <div className={className ? `wsu-FileInput ${className}` : "wsu-FileInput"} style={style}>
      <DropZone
        aria-label={label}
        isDisabled={disabled}
        className="wsu-FileInput__zone"
        onDrop={async (e) => {
          const files = await filesFromDropItems(e.items);
          if (files.length) onFilesSelected(files);
        }}
      >
        <UploadGlyph className="wsu-FileInput__icon" />
        <p className="wsu-FileInput__label">{label}</p>
        <p className="wsu-FileInput__hint">Drag and drop, or</p>
        {/* Same trigger-wiring gap already found on Tooltip and Menu: a plain
            child doesn't consume FileTrigger's press context on its own
            (verified: a "PressResponder rendered without a pressable child"
            console warning without this), so it's wrapped in Pressable. */}
        <FileTrigger
          acceptedFileTypes={accept}
          allowsMultiple={allowsMultiple}
          onSelect={(fileList) => {
            if (fileList) onFilesSelected(Array.from(fileList));
          }}
        >
          <Pressable>
            <Button variant="secondary" size="sm" disabled={disabled}>
              Browse files
            </Button>
          </Pressable>
        </FileTrigger>
        {helperText ? <p className="wsu-FileInput__helper">{helperText}</p> : null}
      </DropZone>
    </div>
  );
}
