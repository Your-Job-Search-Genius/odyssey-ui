import { useSearchParams } from "react-router-dom";
import type { AudienceId } from "../registry/types";

const PARAM = "audience";
const VALID: readonly AudienceId[] = ["generic", "client", "admin"];

/**
 * The active Generic/Client/Admin tab, backed by a `?audience=` URL search
 * param so selections are shareable/bookmarkable and stay in sync across
 * every consumer (sidebar, catalog grid) without introducing a new Context.
 * Omitting the param (or an invalid value) means "generic" — the default.
 */
export function useAudienceFilter(): [AudienceId, (next: AudienceId) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get(PARAM);
  const audience: AudienceId = VALID.includes(raw as AudienceId)
    ? (raw as AudienceId)
    : "generic";

  function setAudience(next: AudienceId) {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (next === "generic") params.delete(PARAM);
        else params.set(PARAM, next);
        return params;
      },
      { replace: true },
    );
  }

  return [audience, setAudience];
}
