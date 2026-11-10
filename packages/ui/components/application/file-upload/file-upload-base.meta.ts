/**
 * Registry override for FileUpload (file-upload-base.tsx: FileUpload.Root / DropZone / List / ListItemProgressBar /
 * ListItemProgressFill). Docgen picked up a helper function as the primary component, so the public name is set here.
 */
export const componentMeta = {
    importName: "FileUpload",
    description:
        'File picker with drag and drop. FileUpload.Root > FileUpload.DropZone (+ FileUpload.List for uploaded files). DropZone is a dashed 2px, 20px-radius row: an icon (32px, default UploadCloud02), a title that is also the button opening the file picker (default "Click to upload" followed by "or drag and drop"), an optional hint, and an optional status pill. Props: title (ReactNode; replaces the default text and its "or drag and drop"), icon (component, e.g. a Hugeicon), badge (ReactNode pill after the title, e.g. "1/5 Uploaded"), hint, accept, maxSize, allowsMultiple, isDisabled, onDropFiles, onDropUnacceptedFiles. The title button\'s hit area covers the whole zone.',
    a11y: 'The title button is described by the "or drag and drop" text and the hint, so a custom title still tells screen readers that files can be dropped (the text becomes screen-reader-only). Rejected files remount the hint as role="alert". Give the zone a specific title when several are on one page.',
    doNot: [
        "Do not hide the hint when files are restricted -- it announces rejection reasons.",
        "Do not build a drop zone from a div and a hidden input -- use FileUpload.DropZone.",
    ],
    examples: [
        {
            title: "Custom title, icon and badge",
            code: '<FileUpload.DropZone icon={ImageAdd01Icon} title="Upload Photos" badge="1/5 Uploaded" hint="PNG or JPG, up to 10MB" accept="image/png,image/jpeg" allowsMultiple onDropFiles={add} />',
        },
    ],
};
