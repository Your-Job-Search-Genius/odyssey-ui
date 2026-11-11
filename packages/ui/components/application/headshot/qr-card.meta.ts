export const componentMeta = {
    description:
        'Dark 230px card with a white-on-black QR code for continuing on a phone. Props: value (URL or text to encode, required), caption (ReactNode above the code, required), onClose (shows the corner close button; inside a Dialog/Popover the button also closes it), closeLabel (accessible name of the close button, default "Close"), codeSize (drawn size of the code inside its 180px slot, default 158 as in Figma; up to 180), className.',
    variants: {},
    a11y: "The close button is a CloseButton with an accessible name (set closeLabel when localising). The caption is plain text above the code; the QR graphic itself is not announced, so make the caption say what to do and offer the link another way if it matters.",
    doNot: [
        "Do not omit caption; it is the only text alternative for the code.",
        "Do not use it on a light surface; the code is drawn in white on a dark card.",
    ],
    examples: [
        {
            title: "Basic",
            code: '<QRCard value="https://bttr.sh/x7" caption="Use your phone to take the picture for a better quality" onClose={close} />',
        },
    ],
};
