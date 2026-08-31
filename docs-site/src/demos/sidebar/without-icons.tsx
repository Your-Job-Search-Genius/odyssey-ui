import { Sidebar } from "@your-job-search-genius/odyssey-ui";

export default function SidebarWithoutIcons() {
  return (
    <div style={{ width: "14rem" }}>
      <Sidebar
        aria-label="Main"
        activeId="resumes"
        items={[
          { id: "home", label: "Home", href: "#" },
          { id: "resumes", label: "Resumes", href: "#" },
          {
            id: "interview",
            label: "Interview",
            children: [
              { id: "mock", label: "Mock Interview", href: "#" },
              { id: "questions", label: "Question Bank", href: "#" },
            ],
          },
        ]}
      />
    </div>
  );
}
