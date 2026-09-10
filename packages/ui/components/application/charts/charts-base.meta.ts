/**
 * charts-base.tsx has no single top-level "main" component -- it's a
 * grab-bag of chart sub-parts (ChartLegendContent, ChartTooltipContent,
 * ChartActiveDot) plus a non-component utility function
 * (selectEvenlySpacedItems), which is what docgen's displayName
 * heuristic latched onto instead (declared first in the file).
 *
 * Known imperfect fix, not a real curation decision: pointed at
 * ChartTooltipContent only so this entry imports *something real*
 * instead of a bare utility function. Whether this file should be a
 * registry entry at all -- or split into separate entries per real
 * sub-component -- is a follow-up content decision, not resolved here.
 */
export const componentMeta = {
    importName: "ChartTooltipContent",
};
