import { Sidebar } from "@your-job-search-genius/odyssey-ui";
import type { SidebarItemData } from "@your-job-search-genius/odyssey-ui";
import {
  Briefcase01Icon,
  File01Icon,
  FlashIcon,
  Home03Icon,
  LegalDocument01Icon,
  Linkedin01Icon,
  Mail01Icon,
  UserQuestion01Icon,
} from "@your-job-search-genius/icons";

const items: SidebarItemData[] = [
  { id: "dashboard", label: "Dashboard", href: "#", icon: <Home03Icon /> },
  { id: "job-board", label: "Job Board", href: "#", icon: <Briefcase01Icon /> },
  { id: "resume", label: "Resume", href: "#", icon: <File01Icon /> },
  { id: "cover-letter", label: "Cover Letter", href: "#", icon: <Mail01Icon /> },
  { id: "linkedin", label: "LinkedIn Analyzer", href: "#", icon: <Linkedin01Icon /> },
  {
    id: "interview",
    label: "Interview",
    icon: <UserQuestion01Icon />,
    children: [
      { id: "mock", label: "Mock Interview", href: "#" },
      { id: "prep", label: "Job Preparation", href: "#" },
      { id: "questions", label: "Question Bank", href: "#" },
    ],
  },
  { id: "auto-apply", label: "Auto Apply", href: "#", icon: <FlashIcon /> },
  { id: "offer", label: "Offer Negotiation", href: "#", icon: <LegalDocument01Icon /> },
];

export default function SidebarBasic() {
  return (
    <div style={{ width: "14rem" }}>
      <Sidebar aria-label="Main" items={items} activeId="resume" />
    </div>
  );
}
