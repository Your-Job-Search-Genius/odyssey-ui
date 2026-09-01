import {
  Button,
  Checkbox,
  CheckboxGroup,
  Form,
  Input,
  Radio,
  RadioGroup,
  TabList,
  TabPanel,
  Tabs,
} from "@your-job-search-genius/odyssey-ui";

export default function TabsSettingsPanels() {
  return (
    <Tabs defaultSelectedKey="general" style={{ width: "26rem" }}>
      <TabList
        aria-label="Settings"
        items={[
          { id: "general", label: "General" },
          { id: "appearance", label: "Appearance" },
          { id: "notifications", label: "Notifications" },
          { id: "profile", label: "Profile" },
        ]}
      />
      <TabPanel id="general">
        <Form aria-label="General settings">
          <Input label="Homepage" name="homepage" defaultValue="react-aria.adobe.com" />
          <Checkbox label="Show sidebar" defaultChecked />
          <Checkbox label="Show status bar" />
        </Form>
      </TabPanel>
      <TabPanel id="appearance">
        <Form aria-label="Appearance settings">
          <RadioGroup label="Theme" defaultValue="auto">
            <Radio value="auto">Auto</Radio>
            <Radio value="light">Light</Radio>
            <Radio value="dark">Dark</Radio>
          </RadioGroup>
          <RadioGroup label="Font size" defaultValue="medium">
            <Radio value="small">Small</Radio>
            <Radio value="medium">Medium</Radio>
            <Radio value="large">Large</Radio>
          </RadioGroup>
        </Form>
      </TabPanel>
      <TabPanel id="notifications">
        <CheckboxGroup label="Notification settings" defaultValue={["account", "dms"]}>
          <Checkbox value="account" label="Account activity" />
          <Checkbox value="mentions" label="Mentions" />
          <Checkbox value="dms" label="Direct messages" />
          <Checkbox value="marketing" label="Marketing emails" />
        </CheckboxGroup>
      </TabPanel>
      <TabPanel id="profile">
        <Form aria-label="Profile settings">
          <Input label="Name" name="name" defaultValue="Devon Govett" />
          <Input label="Username" name="username" defaultValue="@devongovett" />
          <div>
            <Button>Update profile</Button>
          </div>
        </Form>
      </TabPanel>
    </Tabs>
  );
}
