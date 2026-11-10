export const componentMeta = {
    description:
        'Violet "use your phone" promo that is one button. Props: title, description (both ReactNode, required), className, plus any React Aria Button prop (onPress, isDisabled, aria-label...). Fixed 124px high, max 362px wide, content bottom-aligned with an arrow icon so the top can be tucked behind a camera dialog with a negative margin.',
    variants: {},
    a11y: "Renders a real button (React Aria) named by its title and description text; the arrow icon is aria-hidden. Visible focus outline on :focus-visible. Black text on brand-200.",
    doNot: [
        "Do not use it as a static banner without an action; it is a button. Use Alert or DashboardBanner instead.",
        "Do not pass children; content comes from title and description.",
    ],
    examples: [
        {
            title: "Basic",
            code: '<PhoneQualityBanner title="Get Better Quality with your Phone" description="Scan a code to capture or upload with a better camera." onPress={openQr} />',
        },
    ],
};
