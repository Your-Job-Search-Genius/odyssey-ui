import type { Audience, AudienceId, ComponentEntry } from "./types";

export const audiences: Audience[] = [
  {
    id: "generic",
    label: "Generic",
    description:
      "Works the same for every team — the default when a component isn't tagged.",
  },
  {
    id: "client",
    label: "Client",
    description: "Bespoke to the client-facing product surface.",
  },
  {
    id: "admin",
    label: "Admin",
    description:
      "Bespoke to internal admin tooling. No components have an admin design yet.",
  },
];

export const audienceLabel = (id: string): string =>
  audiences.find((a) => a.id === id)?.label ?? id;

/** A component with no `audiences` tag is implicitly generic-only. */
export function effectiveAudiences(
  entry: Pick<ComponentEntry, "audiences">,
): AudienceId[] {
  return entry.audiences && entry.audiences.length > 0
    ? entry.audiences
    : ["generic"];
}

export function matchesAudience(
  entry: Pick<ComponentEntry, "audiences">,
  audience: AudienceId,
): boolean {
  return effectiveAudiences(entry).includes(audience);
}
