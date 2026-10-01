/**
 * Registry override for Tabs (Tabs, Tabs.List / TabList, Tabs.Item / Tab, Tabs.Panel / TabPanel).
 */
export const componentMeta = {
    description:
        "Tabbed views. Tabs (selectedKey/onSelectionChange or defaultSelectedKey) > Tabs.List (type, size, items) + one Tabs.Panel per tab id. List types: button-brand (default), button-gray, button-border, button-minimal, underline, line.",
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
