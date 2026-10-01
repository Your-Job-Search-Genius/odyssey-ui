/**
 * Registry override for the Modal family (DialogTrigger, ModalOverlay, Modal, Dialog,
 * ModalHeader, ModalBody, ModalFooter). See packages/registry/src/schema.ts.
 */
export const componentMeta = {
    description:
        "Overlay dialog. Compose DialogTrigger > (trigger Button) + ModalOverlay > Modal > Dialog > {({ close }) => ModalHeader + ModalBody + ModalFooter}. Sizes (max width on sm+): sm 400, md 480 (default), lg 600, xl 720, 2xl 960, full. On phones the panel always spans the screen. For long previews or side content prefer Drawer.",
    variants: { size: ["sm", "md", "lg", "xl", "2xl", "full"] },
    a11y: 'Focus moves into the dialog on open, Tab is trapped inside, Escape closes it and focus returns to the trigger. ModalHeader\'s title labels the dialog. Use Dialog role="alertdialog" for confirmations, keep Cancel as the first focusable button, and set ModalOverlay isDismissable={false} while a destructive action is running.',
    doNot: [
        "Do not hand-build a fixed inset-0 overlay -- use ModalOverlay + Modal (focus trap, scroll lock and focus return come with it).",
        "Do not label the dialog with aria-label when a visible ModalHeader title exists.",
        "Do not autofocus a ComboBox inside a modal: it opens its menu on focus and covers the form. Let the dialog focus its first text input or close button.",
        "Do not use a Modal wider than xl for reading content; 2xl/full are for previews and comparisons.",
    ],
    examples: [
        {
            title: "Basic",
            code: '<DialogTrigger>\n  <Button>Edit profile</Button>\n  <ModalOverlay>\n    <Modal>\n      <Dialog>\n        {({ close }) => (\n          <>\n            <ModalHeader title="Edit profile" description="Update your details." onClose={close} />\n            <ModalBody>{form}</ModalBody>\n            <ModalFooter>\n              <Button color="secondary" onPress={close}>Cancel</Button>\n              <Button onPress={save}>Save</Button>\n            </ModalFooter>\n          </>\n        )}\n      </Dialog>\n    </Modal>\n  </ModalOverlay>\n</DialogTrigger>',
        },
        {
            title: "Destructive confirmation",
            code: '<ModalOverlay isOpen={isOpen} onOpenChange={setIsOpen} isDismissable={!isDeleting}>\n  <Modal size="sm">\n    <Dialog role="alertdialog">\n      {({ close }) => (\n        <>\n          <ModalHeader icon={AlertTriangle} iconColor="error" title="Delete campaign" description="This cannot be undone." onClose={close} />\n          <ModalFooter>\n            <Button color="secondary" onPress={close}>Cancel</Button>\n            <Button color="primary-destructive" isLoading={isDeleting} onPress={remove}>Delete</Button>\n          </ModalFooter>\n        </>\n      )}\n    </Dialog>\n  </Modal>\n</ModalOverlay>',
        },
        { title: "Wide preview", code: '<Modal size="2xl">...</Modal>' },
    ],
};
