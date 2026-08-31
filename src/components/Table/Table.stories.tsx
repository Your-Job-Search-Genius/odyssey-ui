import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import type { SortDescriptor } from "react-aria-components";
import { Table } from "./Table";
import type { TableColumn } from "./Table";
import { Badge } from "../Badge";

interface Applicant {
  id: string;
  name: string;
  role: string;
  score: number;
}

const rows: Applicant[] = [
  { id: "1", name: "Alex Chen", role: "Frontend Engineer", score: 92 },
  { id: "2", name: "Jordan Lee", role: "Product Designer", score: 87 },
  { id: "3", name: "Sam Patel", role: "Backend Engineer", score: 74 },
];

const columns: TableColumn<Applicant>[] = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  {
    key: "score",
    label: "Match score",
    sortable: true,
    render: (row) => <Badge severity={row.score >= 90 ? "excellent" : row.score >= 80 ? "good" : "fair"}>{row.score}</Badge>,
  },
];

const meta: Meta<typeof Table> = {
  title: "Custom Components/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Designed from the WAI-ARIA APG pattern plus this system's own visual language (radius, spacing, colour and focus tokens), and re-checked against the corrected tokens after the Figma audit. Built on `react-aria-components`' Table — renders as an ARIA `grid` (not a static `table` role) since it supports keyboard cell navigation and column sorting, which is the correct richer role for an interactive data table. Not present in the source Figma file at all. Wide tables scroll inside their own container rather than breaking page reflow at 320px (WCAG 1.4.10).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Playground: Story = {
  render: () => <Table aria-label="Applicants" columns={columns} rows={rows} />,
};

export const Sortable: Story = {
  render: () => {
    function Demo() {
      const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({ column: "score", direction: "descending" });
      const sorted = [...rows].sort((a, b) => {
        const dir = sortDescriptor.direction === "ascending" ? 1 : -1;
        return a.score > b.score ? dir : a.score < b.score ? -dir : 0;
      });
      return <Table aria-label="Applicants" columns={columns} rows={sorted} sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor} />;
    }
    return <Demo />;
  },
};

export const KeyboardInteraction: Story = {
  render: () => <Table aria-label="Applicants" columns={columns} rows={rows} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvas.getByRole("columnheader", { name: /Match score/ });
    await userEvent.click(header);
    await expect(header).toHaveAttribute("aria-sort");
  },
};
