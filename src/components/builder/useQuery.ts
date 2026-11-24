"use client";

import { useCallback, useSyncExternalStore } from "react";

const EVENT = "builder:querychange";

function subscribe(listener: () => void) {
  window.addEventListener("popstate", listener);
  window.addEventListener(EVENT, listener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener(EVENT, listener);
  };
}

/**
 * The page's query string, as the product list and Product Detail keep theirs: read from window.location (not
 * useSearchParams) so the static HTML renders the default state, and the URL's state applies as the page hydrates.
 * setQuery replaces the history entry, so Back leaves the page instead of undoing each choice.
 */
export function useQuery() {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );
  const setQuery = useCallback((params: URLSearchParams | string) => {
    const query = params.toString();
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return [search, setQuery] as const;
}

/**
 * The query string as it is now, for effects that redirect. After a client-side navigation the new page's first
 * render can still see the previous page's query (Next.js updates the URL as it commits), so an effect that trusted
 * that render would send the shopper back where they came from.
 */
export const liveQuery = () => new URLSearchParams(window.location.search);

const noop = () => () => {};
/** True after hydration, for values that only exist in the browser (ship dates, the URL's ring). */
export const useIsClient = () => useSyncExternalStore(noop, () => true, () => false);

/**
 * Moves to a new query on the same page as a new history entry (so Back returns to the previous one), and tells
 * every useQuery on the page. The search results use it for a new search typed on /search/.
 */
export function pushQuery(params: URLSearchParams | string) {
  const query = params.toString();
  window.history.pushState(window.history.state, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Sends the shopper on from a page that can't show the URL's ring (a missing or unknown piece), replacing the history
 * entry. On the document the browser first loaded, still at its address, the redirect runs as the page hydrates, before
 * Next.js has hydrated the page's metadata (rendered in a Suspense boundary and hoisted into <head>). A client-side
 * navigation then leaves that page's title, description, robots and canonical tags in <head> beside the next page's
 * (Task 29). So there it loads the next page in full, which gives it a clean <head>; after a client-side navigation it
 * uses the router as before.
 */
export function redirectTo(router: { replace: (href: string) => void }, href: string) {
  const entry = performance.getEntriesByType("navigation")[0];
  const firstDocument = !entry || new URL(entry.name).pathname === window.location.pathname;
  if (firstDocument) window.location.replace(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${href}`);
  else router.replace(href);
}
