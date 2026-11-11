/**
 * Registry override for the Modal family (DialogTrigger, ModalOverlay, Modal, Dialog,
 * ModalHeader, ModalBody, ModalFooter). See packages/registry/src/schema.ts.
 */
export const componentMeta = {
    description:
        "Overlay dialog. Compose DialogTrigger > (trigger Button) + ModalOverlay > Modal > Dialog > {({ close }) => ModalHeader + ModalBody + ModalFooter}. Sizes (max width on sm+): sm 400, md 456 (default), lg 600, xl 720, 2xl 960, full. On phones the panel always spans the screen. For long previews or side content prefer Drawer. Modal variant: default (white), dark (#444 photo-flow shell), dark-inset (dark frame around a white ModalBody card; use ModalOptionList/ModalOption for icon rows), light-inset (the light #F6F6F6 counterpart with an outlined white card), translucent (crop); dark, dark-inset and translucent draw focus rings in white. Modal clip={false} drops the overflow clip and shadow so content can overflow the panel (e.g. a banner tucked under the camera shell with -z-10). ModalOverlay backdrop: light (default), dark, splash, lightbox. ModalOverlay mobileLayout: sheet (default; phones dock the dialog at the bottom, inset 16px), bottom (edge to edge, flush with the bottom, square bottom corners, at most 17px from the top; sm+ centred), fullscreen (below md the panel fills the screen and the Dialog fills the panel, so an absolute bottom-0 footer reaches the screen edge). ModalHeader actions puts a CTA on the title row; closeLabel names its close button (default 'Close'; localize it).",
    variants: {
        size: ["sm", "md", "lg", "xl", "2xl", "full"],
        variant: ["default", "dark", "dark-inset", "light-inset", "translucent"],
        mobileLayout: ["sheet", "bottom", "fullscreen"],
        backdrop: ["light", "dark", "splash", "lightbox"],
    },
    a11y: 'Focus moves into the dialog on open, Tab is trapped inside, Escape closes it and focus returns to the trigger. ModalHeader\'s title labels the dialog. Use Dialog role="alertdialog" for confirmations, keep Cancel as the first focusable button, and set ModalOverlay isDismissable={false} while a destructive action is running.',
    doNot: [
        "Do not hand-build a fixed inset-0 overlay -- use ModalOverlay + Modal (focus trap, scroll lock and focus return come with it).",
        "Do not label the dialog with aria-label when a visible ModalHeader title exists.",
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
        {
            title: "Light selection dialog, docked to the bottom on phones",
            code: '<ModalOverlay mobileLayout="bottom" backdrop="dark">\n  <Modal variant="light-inset" className="sm:max-w-93">\n    <Dialog>\n      <ModalHeader title="What are you taking this shot for?" showCloseButton={false} />\n      <ModalBody>{radioGroup}</ModalBody>\n      <ModalFooter>{cancelAndContinue}</ModalFooter>\n    </Dialog>\n  </Modal>\n</ModalOverlay>',
        },
    ],
};
