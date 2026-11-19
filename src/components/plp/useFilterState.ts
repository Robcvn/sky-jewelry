"use client";

import { useCallback, useSyncExternalStore } from "react";
import { EMPTY_FILTERS, parseFilters, serializeFilters, type FilterState } from "./filters";

const EVENT = "plp:querychange";

function subscribe(listener: () => void) {
  window.addEventListener("popstate", listener);
  window.addEventListener(EVENT, listener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener(EVENT, listener);
  };
}

/**
 * Filter and sort state, kept in the URL query string so it survives a reload and can be shared.
 * Read from window.location (not useSearchParams) so the static HTML still renders the full, unfiltered
 * list for search engines and no-JS visitors; the filters apply as soon as the page hydrates.
 * Changes replace the history entry, so Back leaves the page instead of undoing each filter.
 */
export function useFilterState() {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );
  const state = search ? parseFilters(new URLSearchParams(search)) : EMPTY_FILTERS;

  const setState = useCallback((next: FilterState) => {
    const query = serializeFilters(next);
    const url = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState(window.history.state, "", url);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return [state, setState] as const;
}
