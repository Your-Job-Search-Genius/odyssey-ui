/**
 * Registry override for Table / TableCard. See packages/registry/src/schema.ts.
 */
export const componentMeta = {
    description:
        "Data table on React Aria's grid: TableCard.Root > TableCard.Header (title, description, contentTrailing actions, filters row) + Table > Table.Header (Table.Head columns) + Table.Body (Table.Row > Table.Cell). Supports sorting (allowsSorting + sortDescriptor), selection (selectionMode), row actions (onRowAction) and expandable detail rows (Table.Row isDetail with one Table.Cell colSpan).",
    variants: { size: ["sm", "md"] },
    a11y: "Mark one column isRowHeader. Sorting announces aria-sort; rows with onRowAction are keyboard-activatable with Enter. Give every Table an aria-label (or aria-labelledby the card title). Expand/collapse buttons set aria-expanded.",
    doNot: [
        "Do not use a raw <table>, or <tr onClick> rows -- use Table (keyboard access and semantics come with it).",
        "Do not read state other than the row's item inside dynamic Table.Body rows without listing it in Table.Body dependencies={[...]} -- rows are cached by item identity and will show stale values.",
        "Do not put search fields or filter selects in TableCard.Header contentTrailing; use the filters slot so the description keeps its width.",
        "Do not build separate desktop table and mobile card markup; hide non-essential columns by breakpoint instead.",
    ],
    examples: [
        {
            title: "Card with actions and filters",
            code: '<TableCard.Root>\n  <TableCard.Header title="Contacts" description="Last 90 days" contentTrailing={<Button size="sm">Add contact</Button>} filters={<Input aria-label="Search contacts" placeholder="Search" size="sm" />} />\n  <Table aria-label="Contacts">\n    <Table.Header>\n      <Table.Head id="name" label="Name" isRowHeader />\n      <Table.Head id="email" label="Email" />\n    </Table.Header>\n    <Table.Body items={contacts}>\n      {(contact) => (\n        <Table.Row id={contact.id}>\n          <Table.Cell>{contact.name}</Table.Cell>\n          <Table.Cell>{contact.email}</Table.Cell>\n        </Table.Row>\n      )}\n    </Table.Body>\n  </Table>\n</TableCard.Root>',
        },
        {
            title: "Rows that read other state",
            code: "<Table.Body items={templates} dependencies={[pendingIds, providerStatus]}>\n  {(template) => <Table.Row id={template.id}>...</Table.Row>}\n</Table.Body>",
        },
        {
            title: "Expandable detail row",
            code: '{logs.flatMap((log) => [\n  <Table.Row key={log.id} id={log.id}>...<Table.Cell><Button color="link-gray" aria-expanded={open.has(log.id)} onClick={() => toggle(log.id)}>Details</Button></Table.Cell></Table.Row>,\n  ...(open.has(log.id) ? [<Table.Row key={`${log.id}-detail`} id={`${log.id}-detail`} isDetail><Table.Cell colSpan={4}><CodeBlock code={log.json} /></Table.Cell></Table.Row>] : []),\n])}',
        },
    ],
};
