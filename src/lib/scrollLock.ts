/**
 * One page scroll lock, counted, for every dialog, sheet and full-screen panel (DialogShell, the mobile menu, the
 * mobile bag screen). Each opener takes a lock and gets back its own release; the page scrolls again only when the
 * last lock is released. A release runs once, so an unmount after a close (or a second cleanup) can't release
 * another dialog's lock. Stacked dialogs (the bag panel or the credit modal over a quick view) close in any order.
 */
let held = 0;

export function lockScroll(): () => void {
  held += 1;
  if (held === 1) document.documentElement.style.overflow = "hidden";
  let released = false;
  return () => {
    if (released) return;
    released = true;
    held = Math.max(0, held - 1);
    if (held === 0) document.documentElement.style.overflow = "";
  };
}
