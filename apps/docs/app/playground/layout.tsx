/**
 * Gates every page under /playground (landing, session, iframe preview)
 * behind the PLAYGROUND_ENABLED kill switch -- see
 * lib/playground/feature-flag.ts. The two server pages additionally
 * check the flag themselves before their own DB work, since a layout's
 * notFound() does not stop a page's server component from rendering
 * concurrently.
 */
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isPlaygroundEnabled } from "~/lib/playground/feature-flag";

export default function PlaygroundLayout({ children }: { children: ReactNode }) {
    if (!isPlaygroundEnabled()) notFound();
    return children;
}
