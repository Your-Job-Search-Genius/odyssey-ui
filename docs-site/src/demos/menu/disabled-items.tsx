import { Button, Menu } from "@your-job-search-genius/odyssey-ui";
import {
  Delete02Icon,
  FileStarIcon,
  PencilIcon,
  RepeatIcon,
  SearchList01Icon,
} from "@your-job-search-genius/icons";

const items = [
  { id: "default", label: "Make Default Resume", icon: <FileStarIcon />, disabled: true },
  { id: "review", label: "Review against a job", icon: <SearchList01Icon />, disabled: true },
  { id: "edit", label: "Edit", icon: <PencilIcon /> },
  { id: "reanalyze", label: "Re-Analyze", icon: <RepeatIcon />, disabled: true },
  { id: "delete", label: "Delete", icon: <Delete02Icon />, danger: true, disabled: true },
];

export default function MenuDisabledItems() {
  return <Menu trigger={<Button variant="secondary">Resume actions</Button>} items={items} />;
}
