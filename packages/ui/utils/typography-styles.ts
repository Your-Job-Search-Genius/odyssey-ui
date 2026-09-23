/**
 * Semantic text-color classes shared by every typography component. Each value is already a
 * valid Tailwind utility (from `packages/ui/styles/theme.css`), so consumers can merge it
 * directly via `cx()` without a lookup table.
 */
export type TypographyColor =
    | "text-primary"
    | "text-secondary"
    | "text-tertiary"
    | "text-quaternary"
    | "text-white"
    | "text-brand-primary"
    | "text-error-primary"
    | "text-warning-primary"
    | "text-success-primary";

/**
 * Visual scale for `Heading`, keyed by level 1-6. Levels 1-4 mirror the `.prose` heading sizes in
 * `packages/ui/styles/typography.css`; levels 5-6 extrapolate the same step-down pattern.
 */
export const headingSizes: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
    1: "text-display-sm font-semibold",
    2: "text-display-xs font-semibold",
    3: "text-xl font-semibold",
    4: "text-lg font-semibold",
    5: "text-md font-semibold",
    6: "text-sm font-semibold",
};
