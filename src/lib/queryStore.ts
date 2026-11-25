/**
 * A page's query string as filter state (Task 31). The page reads the store, not the URL: a change applies at once
 * (the list keeps updating while a slider is dragged), and the URL follows with history.replaceState:
 * - a change made when the URL hasn't been written for 300ms is written at once (a click, a key press);
 * - changes coming faster than that (a drag, a held arrow key) are written 300ms after the last one;
 * - any pending change is written on release (pointer up or cancel, a key let go) and on a click, before and after
 *   it acts, and when the page is left.
 * Browsers cap replaceState (Chrome ignores calls past about 200 in 10 seconds, Safari throws past 100), and a drag
 * wrote it on every move, so the handle froze once the cap was reached. Now a drag costs one to three writes.
 * A pending change belongs to the address it was made on: if the URL changes under it (Back, Forward, a link with its
 * own query), it is dropped and the store shows the new address.
 */
const WAIT = 300;

export type QueryStore = {
  subscribe: (listener: () => void) => () => void;
  /** "?a=b", or "" with no query. */
  getSnapshot: () => string;
  /** Replaces the query (no new history entry). */
  set: (query: string) => void;
  /** Moves to a new query as a new history entry, dropping any pending change. */
  push: (query: string) => void;
};

const stores = new Set<{ flush: () => void; notify: () => void }>();
let listening = false;

function listen() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  const flushAll = () => stores.forEach((store) => store.flush());
  // A history change made elsewhere (Next.js's router following a link to this page with another query) fires no event
  // the pages listen to, so every store is told after any push or replace; a store whose value hasn't changed doesn't
  // re-render anything.
  for (const method of ["pushState", "replaceState"] as const) {
    const original = window.history[method];
    window.history[method] = function (this: History, ...args: Parameters<History["pushState"]>) {
      const result = original.apply(this, args);
      queueMicrotask(() => stores.forEach((store) => store.notify()));
      return result;
    };
  }
  // Before the event acts (a click on a link leaves with the URL written), and again once it has been handled (the
  // change a click or a release makes is written at once too).
  const release = () => {
    flushAll();
    window.setTimeout(flushAll, 0);
  };
  window.addEventListener("pointerup", release, true);
  window.addEventListener("pointercancel", release, true);
  window.addEventListener("click", release, true);
  // A key's release: one key press (an arrow on a slider handle, Home, End) reaches the URL at once, as before; a held
  // key repeats without a release, so its changes wait for it like a drag's.
  window.addEventListener("keyup", release, true);
  window.addEventListener("pagehide", flushAll);
}

export function createQueryStore(event: string): QueryStore {
  let pending: string | null = null;
  let base = ""; // pathname + search when the pending change was made
  let timer: number | null = null;
  let lastWrite = 0;
  const here = () => window.location.pathname + window.location.search;

  const cancel = () => {
    if (timer !== null) window.clearTimeout(timer);
    timer = null;
  };
  const drop = () => {
    cancel();
    pending = null;
  };

  const flush = () => {
    cancel();
    if (pending === null) return;
    if (here() !== base) return drop(); // the address changed under the pending change
    const search = pending;
    if (search !== window.location.search) {
      try {
        window.history.replaceState(window.history.state, "", `${window.location.pathname}${search}${window.location.hash}`);
      } catch {
        timer = window.setTimeout(flush, WAIT * 4); // over the browser's cap: keep it and try again later
        return;
      }
    }
    lastWrite = Date.now();
    pending = null;
  };

  const notify = () => window.dispatchEvent(new Event(event));
  const store = { flush, notify };

  return {
    subscribe(listener) {
      listen();
      stores.add(store);
      window.addEventListener("popstate", listener);
      window.addEventListener(event, listener);
      return () => {
        window.removeEventListener("popstate", listener);
        window.removeEventListener(event, listener);
      };
    },
    getSnapshot() {
      if (pending !== null && here() !== base) drop();
      return pending ?? window.location.search;
    },
    set(query) {
      if (pending === null) base = here();
      pending = query ? `?${query}` : "";
      if (timer === null && Date.now() - lastWrite >= WAIT) flush();
      else {
        cancel();
        timer = window.setTimeout(flush, WAIT);
      }
      notify();
    },
    push(query) {
      drop();
      window.history.pushState(window.history.state, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
      notify();
    },
  };
}
