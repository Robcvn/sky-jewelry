"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { cx, withBasePath } from "@/components/ui/shared";
import { searchContent } from "@/content/search";
import type { HeaderContent } from "@/content/site";
import { MobileBar } from "./HeaderParts";
import { MenuBlogBlock, MenuGroupBlock, ShopAllRow } from "./MegaMenu";
import { MenuLinkItem } from "./MenuLinkItem";
import { NavItem } from "./NavItem";
import { useSearchSubmit } from "./SearchPanel";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Slides between the main screen and a category sub-screen. Reduced motion turns the slide off globally. */
const SCREEN = "absolute inset-0 flex flex-col bg-secondary-ivory transition-transform duration-300 ease-out";

type MobileMenuProps = {
  content: HeaderContent;
  bagLabel: string;
  /** Distance from the top of the viewport, so the announcement bar stays visible when the page is at the top. */
  top?: number;
  onClose: () => void;
  /** Style guide only: render in the flow, without scroll lock, focus trap or autofocus. */
  inline?: boolean;
  /** Style guide only: start on a category sub-screen. */
  initialCategory?: string;
  /** Appended to landmark labels so style guide previews stay unique. */
  labelSuffix?: string;
};

/** Figma "Nav / Main" and the category sub-screens: the full-screen mobile navigation. */
export function MobileMenu({ content, bagLabel, top = 0, onClose, inline = false, initialCategory, labelSuffix = "" }: MobileMenuProps) {
  const [active, setActive] = useState<string | null>(initialCategory ?? null);
  // The last category stays rendered while its screen slides away.
  const [shown, setShown] = useState<string | null>(initialCategory ?? null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const categoryRefs = useRef(new Map<string, HTMLButtonElement>());
  const focusAfterMove = useRef<"back" | string | null>(null);
  const searchId = useId();
  const onSearch = useSearchSubmit(onClose);
  // "Nav / Search" (4979:47688): with the search field in use, the menu's links give way to Popular searches. It stays
  // until focus leaves the search area with the field empty (so a tap on a term isn't lost).
  const [searching, setSearching] = useState(false);
  // Keyboard only: Tab from the last popular search (field empty) closes the search screen and goes on to the first
  // category, so forward Tab reaches every item. Focused once the main nav shows again.
  const focusFirstCategory = useRef(false);
  const category = content.primary.find((link) => link._key === shown);

  // Scroll lock and first focus for the real (fixed) menu.
  useEffect(() => {
    if (inline) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      root.style.overflow = previous;
    };
  }, [inline]);

  useEffect(() => {
    if (searching || !focusFirstCategory.current) return;
    focusFirstCategory.current = false;
    categoryRefs.current.get(content.primary[0]?._key)?.focus();
  }, [searching, content.primary]);

  // After drilling in, focus the back button; after going back, focus the category it came from.
  useEffect(() => {
    const target = focusAfterMove.current;
    focusAfterMove.current = null;
    if (target === "back") backRef.current?.focus();
    else if (target) categoryRefs.current.get(target)?.focus();
  }, [active]);

  const openCategory = (key: string) => {
    focusAfterMove.current = "back";
    setShown(key);
    setActive(key);
  };

  const back = () => {
    focusAfterMove.current = active;
    setActive(null);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (inline) return;
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;
    // Focus trap: only what is showing counts. Inert screens (the one slid away) and hidden parts (the main and More
    // navs while the search screen shows, since Task 21) are skipped, so Tab and Shift+Tab cycle through the visible
    // screen. Focus that isn't on one of those (it shouldn't be) is brought back in.
    const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (element) => !element.closest("[inert], [hidden]") && element.getClientRects().length > 0,
    );
    if (!items.length) return;
    const index = items.indexOf(document.activeElement as HTMLElement);
    // Forward Tab past the search screen: from its last item (the last popular search) with the field empty, close it and
    // move on to the first category (the main nav comes back). With text in the field, Tab keeps cycling as below.
    const field = dialogRef.current.querySelector<HTMLInputElement>("form[role=search] input");
    if (searching && !event.shiftKey && index === items.length - 1 && !field?.value) {
      event.preventDefault();
      focusFirstCategory.current = true;
      setSearching(false);
      return;
    }
    if (event.shiftKey && index <= 0) {
      event.preventDefault();
      items[items.length - 1].focus();
    } else if (!event.shiftKey && (index === -1 || index === items.length - 1)) {
      event.preventDefault();
      items[0].focus();
    }
  };

  // Following any link closes the menu.
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!inline && (event.target as Element).closest("a[href]")) onClose();
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal={inline ? undefined : true}
      aria-label={`${content.mobileMenu.label}${labelSuffix}`}
      onKeyDown={onKeyDown}
      onClick={onClick}
      style={inline ? undefined : { top }}
      className={cx(
        "flex flex-col bg-secondary-ivory text-primary-leather",
        inline
          ? "h-[50.875rem]"
          : "fixed inset-x-0 bottom-0 z-50 transition-opacity duration-200 ease-out starting:opacity-0 ui-desktop:hidden",
      )}
    >
      <MobileBar content={content} bagLabel={bagLabel} menuOpen onMenuClick={onClose} menuButtonRef={closeRef} />

      <div className="relative flex-1 overflow-hidden">
        {/* Main screen */}
        <div inert={active !== null} className={cx(SCREEN, "overflow-y-auto", active !== null && "-translate-x-full")}>
          <div
            className="contents"
            onFocus={() => setSearching(true)}
            onBlur={(event) => {
              const next = event.relatedTarget as Node | null;
              const field = event.currentTarget.querySelector("input");
              if (!(next && event.currentTarget.contains(next)) && !field?.value) setSearching(false);
            }}
          >
          <form
            role="search"
            data-search-area
            aria-label={`${content.search.label}${labelSuffix}`}
            action={withBasePath("/search/")}
            method="get"
            onSubmit={onSearch}
            className="flex shrink-0 items-center border-b border-primary-leather"
          >
            <label htmlFor={searchId} className="sr-only">
              {content.search.label}
            </label>
            <input
              id={searchId}
              name="q"
              type="search"
              autoComplete="off"
              enterKeyHint="search"
              // In use (Nav / Search 4979:47688) the field is Figma's 56px band: "Jewelry, news, Blog etc." in gold
              // heading-caps-sm, and the query in the same caps style. At rest (Nav / Main) it keeps the small "Search".
              placeholder={searching ? content.searchPanel.placeholder : content.searchPanel.mobilePlaceholder}
              className={cx(
                "w-full min-w-0 flex-1 bg-transparent px-space-5 text-primary-leather focus-visible:-outline-offset-2 [&::-webkit-search-cancel-button]:appearance-none",
                searching ? "type-heading-caps-sm min-h-space-12 placeholder:text-secondary-gold" : "type-ui-sm-regular min-h-space-12 placeholder:text-black-alpha-60",
              )}
            />
            {/* The search screen draws an Arrow Right at the field's end (submit). */}
            {searching ? (
              <button type="submit" aria-label={content.searchPanel.submitLabel} className="ui-transition-fast mr-space-4 flex shrink-0 cursor-pointer text-primary-leather hover:text-black-alpha-60">
                <Icon name="arrow-right" size={24} />
              </button>
            ) : null}
          </form>

          {searching ? (
            // Figma: "Popular searches" (overline-xs) and five Nav Item - Child rows (MD, 34 tall), 20 in, 16 apart.
            <nav data-search-area aria-label={`${searchContent.empty.popularHeading}${labelSuffix}`} className="flex flex-col gap-space-4 p-space-5">
              <p className="type-overline-xs-medium text-black-alpha-50">{searchContent.empty.popularHeading}</p>
              <ul className="flex flex-col">
                {searchContent.empty.popular.map((term) => (
                  <li key={term}>
                    <MenuLinkItem link={{ _key: term, label: term, href: `/search/?q=${encodeURIComponent(term)}` }} />
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          </div>

          <nav aria-label={`Main${labelSuffix}`} hidden={searching} className="flex-1 border-b border-primary-leather p-space-5">
            <ul className="flex flex-col gap-space-3">
              {content.primary.map((link) => (
                <li key={link._key}>
                  <button
                    ref={(element) => {
                      if (element) categoryRefs.current.set(link._key, element);
                      else categoryRefs.current.delete(link._key);
                    }}
                    type="button"
                    onClick={() => openCategory(link._key)}
                    className="ui-transition-fast type-heading-md flex min-h-space-11 w-full cursor-pointer items-center gap-space-2 py-space-2 text-left text-primary-leather hover:text-black-alpha-60"
                  >
                    <span className="flex-1">{link.label}</span>
                    <Icon name="chevron-right" size={16} className="text-secondary-gold" />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={`More${labelSuffix}`} hidden={searching} className="shrink-0 p-space-5">
            <ul className="flex flex-col items-start gap-space-2">
              {content.mobileMenu.utility.map((link) => (
                <li key={link._key} className="flex">
                  <NavItem href={link.href}>{link.label}</NavItem>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Category sub-screen */}
        <div inert={active === null} className={cx(SCREEN, active === null && "translate-x-full")}>
          {category ? (
            <>
              <div className="relative flex min-h-space-12 shrink-0 items-center justify-center border-b border-primary-leather px-space-12">
                <button
                  ref={backRef}
                  type="button"
                  onClick={back}
                  aria-label={content.mobileMenu.backLabel}
                  className="ui-transition-fast absolute inset-0 flex cursor-pointer items-center px-space-4 text-primary-leather hover:text-black-alpha-60 focus-visible:-outline-offset-2"
                >
                  <Icon name="chevron-left" size={24} />
                </button>
                <h2 className="type-ui-sm-medium pointer-events-none relative text-center">{category.label}</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                {[
                  ...category.menu.groups.map((group) => (
                    <MenuGroupBlock key={group._key} group={group} headingLevel={3} />
                  )),
                  ...(category.menu.blog ? [<MenuBlogBlock key="blog" blog={category.menu.blog} headingLevel={3} />] : []),
                ].map((block) => (
                  <div key={block.key} className="border-b border-primary-leather p-space-5 last:border-b-0">
                    {block}
                  </div>
                ))}
              </div>
              {/* One Shop All: the fixed bar Figma's frames show (e.g. 3587:124914). Figma also ends the list with a second
                  Shop All row, dropped (Corrected design oversights). The bar sits below the scrolling list, so the list's
                  last block scrolls fully clear of it, and its top border is the only rule between them (the last block
                  has none). */}
              <ShopAllRow link={category.menu.shopAll} className="shrink-0" />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
