"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { cx, withBasePath } from "@/components/ui/shared";
import type { HeaderContent } from "@/content/site";
import { MobileBar } from "./HeaderParts";
import { MenuBlogBlock, MenuGroupBlock, ShopAllRow } from "./MegaMenu";
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
    // Focus trap: inert screens are skipped, so this only cycles through the visible screen.
    const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (element) => !element.closest("[inert]"),
    );
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
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
          <form
            role="search"
            aria-label={`${content.search.label}${labelSuffix}`}
            action={withBasePath("/search/")}
            method="get"
            onSubmit={onSearch}
            className="shrink-0 border-b border-primary-leather"
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
              placeholder={content.searchPanel.mobilePlaceholder}
              className="type-ui-sm-regular min-h-space-12 w-full bg-transparent px-space-5 text-primary-leather placeholder:text-black-alpha-60 focus-visible:-outline-offset-2 [&::-webkit-search-cancel-button]:appearance-none"
            />
          </form>

          <nav aria-label={`Main${labelSuffix}`} className="flex-1 border-b border-primary-leather p-space-5">
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

          <nav aria-label={`More${labelSuffix}`} className="shrink-0 p-space-5">
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
                {/* Figma shows Shop All both at the end of the list and as the fixed bar below. */}
                <ShopAllRow link={category.menu.shopAll} size="sm" />
              </div>
              <ShopAllRow link={category.menu.shopAll} className="shrink-0" />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
