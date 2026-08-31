import { Button, Menu, MenuHeader } from "@your-job-search-genius/odyssey-ui";
import { FileStarIcon, PencilIcon, Setting02Icon } from "@your-job-search-genius/icons";

const items = [
  { id: "resumes", label: "My resumes", icon: <FileStarIcon /> },
  { id: "profile", label: "Edit profile", icon: <PencilIcon /> },
  { id: "settings", label: "Settings", icon: <Setting02Icon /> },
];

export default function MenuUserMenu() {
  return (
    <Menu
      trigger={<Button variant="secondary">Account</Button>}
      header={<MenuHeader initials="MC" name="Moremi Chris" detail="moremi@gmail.com" />}
      items={items}
    />
  );
}
