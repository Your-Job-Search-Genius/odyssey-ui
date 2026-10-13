# UI issues log (every agent using the MCP)

Every agent that builds UI with the Writesea Odyssey MCP (`yjsg-mcp` / `writesea-ds-mcp`) **must** report each UI issue it hits and **ask the user for permission** before recording them in the consuming project's `docs/ui-issues.md`. This is how library gaps and bugs get back to the design-system team instead of being silently worked around in app code.

The MCP carries this rule in the server instructions, `get_rules` (composition rules), the `plan_ui_task` workflow, and the post-build steps.

## Rules

1. **Collect** every issue while building. Do not hide workarounds: if you bent a rule (closest token, closest component, a prop that does not exist), it is an issue.
2. **Ask first.** At the end of the task, list the issues for the user and ask: "Log these in `docs/ui-issues.md`?" Never create or edit the file without a yes.
3. **Yes:** write them to `docs/ui-issues.md` at the root of the consuming project, creating it (with the template below) if it does not exist.
4. **No:** do not write the file. The issues stay in your reply only.
5. **Append only.** Never delete or rewrite another agent's entry. To close one, change its `Status` and add a note.
6. **One entry per issue.** If the same issue already exists, add `Seen again: <date> <file>` to it instead of duplicating.
7. **Completion record:** state `UI issues: none`, `UI issues: logged`, or `UI issues: not logged (user declined)`.

## What counts as a UI issue

| Category            | Example                                                                                |
| :------------------ | :------------------------------------------------------------------------------------- |
| `missing-component` | Design needs a stepper; no library component exists, used the closest alternative.     |
| `missing-prop`      | `Select` has no way to set the popover width.                                          |
| `component-bug`     | `DatePicker` popover clips at 320px width.                                             |
| `a11y`              | NVDA does not announce the toast; focus lost after modal close.                        |
| `token-gap`         | Design color/spacing has no token; used the closest one.                               |
| `icon-missing`      | No icon matches "LinkedIn"; used `Link01`.                                             |
| `rule-conflict`     | Two MCP rules contradict, or a rule blocks a legitimate need.                          |
| `mcp-mismatch`      | `get_component` lists a prop that the installed package does not have (or vice versa). |
| `setup`             | Install, styles, alias, or bundler config problem with the package.                    |
| `validate-jsx`      | `validate_jsx` rejects valid code or accepts code the rules forbid.                    |

## File template

```markdown
# UI issues

Logged by agents while implementing UI with @your-job-search-genius/odyssey-ui. Append only.

<!-- New entries go below this line, newest last. -->
```

## Entry format

```markdown
## UI-001: DatePicker popover clips on narrow screens

- **Date:** 2026-10-13
- **Agent / task:** Claude Code -- "build job application form"
- **Category:** component-bug
- **Severity:** high | medium | low
- **Package version:** @your-job-search-genius/odyssey-ui 2.3.2
- **Component / rule:** DatePicker (`application/date-picker/date-picker`)
- **Where:** src/pages/apply.tsx:42
- **What happened:** Popover overflows the viewport at 320px; right half is cut off.
- **Expected:** Popover stays inside the viewport.
- **Workaround used:** None / describe it exactly.
- **Status:** open | reported | fixed in <version> | won't fix
```

Severity guide: **high** -- blocks the feature or breaks accessibility; **medium** -- needed a workaround or rule bend; **low** -- cosmetic or docs-only.

IDs are sequential per project (`UI-001`, `UI-002`, ...): read the last entry and add one.
