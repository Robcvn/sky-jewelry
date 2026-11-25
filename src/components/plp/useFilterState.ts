"use client";

import { useCallback, useSyncExternalStore } from "react";
import { createQueryStore } from "@/lib/queryStore";
import { EMPTY_FILTERS, parseFilters, serializeFilters, type FilterState } from "./filters";

const store = createQueryStore("plp:querychange");

/**
 * Filter and sort state, kept in the URL query string so it survives a reload and can be shared.
 * Read from window.location (not useSearchParams) so the static HTML still renders the full, unfiltered
 * list for search engines and no-JS visitors; the filters apply as soon as the page hydrates.
 * Changes replace the history entry, so Back leaves the page instead of undoing each filter. They apply at once; the
 * URL follows within 300ms and on release (src/lib/queryStore.ts), so a dragged Price or Carat slider doesn't hit
 * the browser's cap on history writes.
 */
export function useFilterState() {
  const search = useSyncExternalStore(store.subscribe, store.getSnapshot, () => "");
  const state = search ? parseFilters(new URLSearchParams(search)) : EMPTY_FILTERS;
  const setState = useCallback((next: FilterState) => store.set(serializeFilters(next)), []);
  return [state, setState] as const;
}
