/**
 * Search index endpoint. Served as a *static* payload (staticGET): the
 * full Orama index is exported once at build time and the search dialog
 * queries it client-side (see app/layout.tsx's `type: "static"`
 * options). This is what lets search keep working on the static
 * GitHub Pages deployment, where no server-side search API can run --
 * and dev/Node deployments use the exact same mechanism so there is
 * only one search path to maintain.
 */
import { createFromSource } from "fumadocs-core/search/server";
import { source } from "~/lib/source";

export const revalidate = false;

export const { staticGET: GET } = createFromSource(source);
