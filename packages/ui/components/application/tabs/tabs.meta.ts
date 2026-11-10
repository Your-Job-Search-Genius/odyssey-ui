/**
 * Registry override for Tabs (Tabs, Tabs.List / TabList, Tabs.Item / Tab, Tabs.Panel / TabPanel).
 */
export const componentMeta = {
    description:
        'Tabbed views. Tabs (selectedKey/onSelectionChange or defaultSelectedKey) > Tabs.List (type, size, items) + one Tabs.Panel per tab id. List types: button-brand (default), button-gray, button-border, button-minimal, underline, line. underline tabs are 16px-padded, medium weight, with a brand-tertiary selected/hover label and a #E5E5E5 baseline; spread them with className="justify-between" for a full-width category bar. line is the anchor side-nav look for orientation="vertical": items with an icon get a 28px (sm) / 32px (md) icon that goes from 20% to full brand opacity with a semibold darker label when current; items without an icon keep a brand left bar.',
    a11y: 'Renders tablist/tab/tabpanel. Activation is manual: arrow keys move focus between tabs, Enter or Space selects -- this suits panels that load data when shown. Pass keyboardActivation="automatic" to select on arrow. Every Tabs.Panel id must match a tab id.',
    doNot: [
        "Do not build tab bars from Buttons -- they lack tablist semantics and arrow-key navigation.",
        "Do not cram more than ~5 tabs into a phone-width list; switch to a NativeSelect of sections below md.",
    ],
    examples: [
        {
            title: "Controlled tabs with lazy panels",
            code: '<Tabs selectedKey={tab} onSelectionChange={setTab}>\n  <Tabs.List type="underline" items={[{ id: "overview", label: "Overview" }, { id: "activity", label: "Activity" }]} />\n  <Tabs.Panel id="overview"><Overview /></Tabs.Panel>\n  <Tabs.Panel id="activity">{tab === "activity" && <Activity />}</Tabs.Panel>\n</Tabs>',
        },
    ],
};
