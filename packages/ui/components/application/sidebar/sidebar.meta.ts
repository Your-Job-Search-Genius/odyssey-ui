/**
 * Registry override for SidebarLayout -- the library's single application shell / sidebar
 * navigation. See packages/registry/src/schema.ts's ComponentMetaOverrideSchema for the shape.
 */
export const componentMeta = {
    description:
        "The application shell and the ONLY sidebar navigation component: a collapsible sidebar (brand, nav items with expandable groups, language switcher, footer rows, account menu) beside a scrollable rounded main content card on desktop (md, >=768px); a bottom tab bar (first 4 destinations + a More bottom sheet) on mobile. Wrap each page's content in it as children. Navigation is data-driven via `items`; highlight the current page by passing the router's current URL as `activeUrl`.",
    allowedChildren: "any",
    a11y: 'Renders a \'Skip to main content\' link, an <aside> with a <nav aria-label="Main"> landmark, and <main id="main-content">. Links set aria-current="page"; the collapse toggle exposes aria-expanded. Collapsed icon-only items show tooltips and keep their label as screen-reader text. Groups are React Aria disclosures (Enter/Space toggles). Wrap the app in React Aria\'s RouterProvider so links use client-side routing.',
    doNot: [
        "Do not build a sidebar, app shell, hamburger drawer or bottom tab bar by hand from <aside>/<nav>/div primitives -- use SidebarLayout.",
        "Do not nest SidebarLayout, or render more than one per page; it owns the page's <main> landmark.",
        "Do not pass more than ~8 top-level items; group related destinations with `items` sub-items instead.",
        "Do not compute active state yourself -- pass `activeUrl` (path + query) and let SidebarLayout pick the best match.",
        "Do not use it for top-bar navigation; use HeaderNavigationBase (application/header-navigation/header-navigation) instead.",
    ],
    examples: [
        {
            title: "Basic",
            code: `<SidebarLayout
  brand={{ name: "Writesea" }}
  activeUrl={pathname}
  items={[
    { label: "Dashboard", href: "/dashboard", icon: Home02 },
    { label: "Resume", href: "/resumes", icon: File06 },
    { label: "Contacts", href: "/contact", icon: Users01 },
  ]}
>
  <h1 className="text-display-xs font-semibold text-primary">Dashboard</h1>
</SidebarLayout>`,
        },
        {
            title: "With groups, footer and account",
            code: `<SidebarLayout
  brand={{ name: "Writesea" }}
  activeUrl={pathname}
  items={[
    { label: "Dashboard", href: "/dashboard", icon: Home02 },
    {
      label: "Jobs",
      icon: Briefcase01,
      items: [
        { label: "Feed", href: "/job-board" },
        { label: "Tracker", href: "/job-board?activeTab=tracker" },
      ],
    },
  ]}
  footerItems={[
    {
      label: "Help and Shortcuts",
      icon: HelpCircle,
      menu: [
        { id: "help", label: "Help", icon: BookOpen01 },
        { id: "shortcuts", label: "Accessibility Shortcuts", icon: Keyboard01 },
      ],
    },
  ]}
  account={{
    name: "Olivia Rhye",
    email: "olivia@example.com",
    menuItems: [{ id: "logout", label: "Log out", icon: LogOut01, onAction: signOut }],
  }}
>
  {page}
</SidebarLayout>`,
        },
        {
            title: "Collapsed by default, full-bleed content",
            code: `<SidebarLayout brand={{ name: "Writesea" }} items={items} activeUrl={pathname} defaultCollapsed contentClassName="p-0">
  {editor}
</SidebarLayout>`,
        },
    ],
};
