"use client";

import { usePathname } from "next/navigation";
import { BagPanel } from "@/components/bag/BagPanel";
import { bagLinkClick, closeBagPanel, useBagCount } from "@/lib/bag";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type RefObject,
} from "react";
import { Icon } from "@/components/ui/Icon";
import { cx } from "@/components/ui/shared";
import { useIsDesktop } from "@/components/ui/useIsDesktop";
import { contactDropdownFor, siteHeader, withMenuPosts, type BlogTeaser, type FooterContent, type HeaderContent } from "@/content/site";
import { ContactDropdown } from "./ContactDropdown";
import { headerIconButtonClasses, IconLink, MobileBar } from "./HeaderParts";
import { Logo } from "./Logo";
import { MegaMenuPanel } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { NavItem, navItemButtonClasses } from "./NavItem";
import { SearchPanel } from "./SearchPanel";

const SEARCH = "search";
/** The utility link that opens the contact dropdown. */
const CONTACT = siteHeader.contactDropdown.trigger;
/** Hover intent: a short wait before opening, so sweeping the pointer across the nav does not flash panels. */
const OPEN_DELAY = 120;
/** Grace period after the pointer leaves the header and panel. */
const CLOSE_DELAY = 250;

/** Ties a control in one desktop bar to the same control in the other, so focus can follow when the bars swap. */
const KEY = "data-header-key";

type DesktopBarProps = {
  content: HeaderContent;
  layout: "two-row" | "one-row";
  labelSuffix: string;
  pathname: string;
  bagCount: number;
  bagLabel: string;
  /**
   * The page header has two desktop bars: "page" (in the flow, scrolls away) and "fixed" (the one-row bar fixed to
   * the top of the viewport once the page has scrolled past the first). Style guide previews have neither.
   */
  bar?: "page" | "fixed";
  /** False while the other bar is the one in use: this one closes what it had open and goes inert. */
  active?: boolean;
  /** False until the fixed bar is first shown, so its copy of the mega menus stays out of the static HTML. */
  panels?: boolean;
  barRef: RefObject<HTMLDivElement | null>;
};

/** The desktop header (1024px and up) with its mega menus and search panel. Each bar keeps its own open state. */
function DesktopBar({ content, layout, labelSuffix, pathname, bagCount, bagLabel, bar, active = true, panels = true, barRef }: DesktopBarProps) {
  const baseId = useId();
  const panelId = (key: string) => `${baseId}-panel-${key}`;
  const triggerId = (key: string) => `${baseId}-trigger-${key}`;
  const fixed = bar === "fixed";

  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const openedBy = useRef<"hover" | "click">("click");
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const focusOnOpen = useRef<"first-link" | "search" | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close everything on navigation, and when the other bar takes over.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpenPanel(null);
  }
  if (!active && openPanel) setOpenPanel(null);

  const clearTimers = () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  };

  // A hover that was still waiting to open must not open a panel in the bar that just went away.
  useEffect(() => {
    if (!active) clearTimers();
  }, [active]);

  const open = (key: string, by: "hover" | "click") => {
    clearTimers();
    openedBy.current = by;
    setOpenPanel(key);
  };

  const close = (returnFocusTo?: string) => {
    clearTimers();
    setOpenPanel(null);
    if (returnFocusTo) document.getElementById(triggerId(returnFocusTo))?.focus();
  };

  // Move focus into a panel once it is visible.
  useEffect(() => {
    const target = focusOnOpen.current;
    focusOnOpen.current = null;
    if (!openPanel || !target) return;
    if (target === "search") searchInputRef.current?.focus();
    else document.getElementById(panelId(openPanel))?.querySelector<HTMLElement>("a[href]")?.focus();
    // panelId only depends on baseId, which never changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openPanel]);

  // A press anywhere outside the bar closes the open panel.
  useEffect(() => {
    if (!openPanel) return;
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!barRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  });

  useEffect(() => clearTimers, []);

  const onTriggerClick = (key: string) => {
    if (openPanel === key) {
      // A click on a panel that hover just opened keeps it open rather than closing it.
      if (openedBy.current === "hover") openedBy.current = "click";
      else close();
      return;
    }
    if (key === SEARCH) focusOnOpen.current = "search";
    open(key, "click");
  };

  const onTriggerPointerEnter = (event: PointerEvent, key: string) => {
    if (event.pointerType !== "mouse") return;
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    if (openPanel === key) return;
    if (openPanel && openPanel !== SEARCH) open(key, "hover");
    else openTimer.current = window.setTimeout(() => open(key, "hover"), OPEN_DELAY);
  };

  const onTriggerKeyDown = (event: KeyboardEvent, key: string) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusOnOpen.current = "first-link";
      if (openPanel === key) document.getElementById(panelId(key))?.querySelector<HTMLElement>("a[href]")?.focus();
      else open(key, "click");
    }
  };

  // Escape closes the open panel and returns focus to its trigger, wherever focus is: Safari leaves it on the page after
  // a click on a button, and a panel opened by hover never had it. Listened for on the document while a panel is open.
  useEffect(() => {
    if (!openPanel) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      close(openPanel);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  // Keyboard users: close when focus leaves the open trigger and its panel.
  const onBarFocus = (event: FocusEvent) => {
    if (!openPanel) return;
    const trigger = document.getElementById(triggerId(openPanel));
    const panel = document.getElementById(panelId(openPanel));
    const target = event.target as Node;
    if (!trigger?.contains(target) && !panel?.contains(target)) close();
  };

  const onBarBlur = (event: FocusEvent) => {
    if (openPanel && event.relatedTarget && !barRef.current?.contains(event.relatedTarget as Node)) close();
  };

  const onBarPointerLeave = (event: PointerEvent) => {
    // The contact dropdown opens on click and closes on a click outside, as the prototype's overlay does.
    if (event.pointerType !== "mouse" || !openPanel || openPanel === CONTACT) {
      window.clearTimeout(openTimer.current);
      return;
    }
    window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => close(), CLOSE_DELAY);
  };

  // Following a link inside a panel closes it, including links to the page already showing.
  const onPanelClick = (event: MouseEvent) => {
    if ((event.target as Element).closest("a[href]")) close();
  };

  const search = (
    <div data-header-key={SEARCH} className="contents">
      <button
        id={triggerId(SEARCH)}
        type="button"
        aria-label={content.search.label}
        aria-expanded={openPanel === SEARCH}
        aria-controls={panels ? panelId(SEARCH) : undefined}
        onClick={() => onTriggerClick(SEARCH)}
        className={headerIconButtonClasses("md")}
      >
        <Icon name="search" size={24} />
      </button>
      {panels ? (
        <div onClick={onPanelClick} className="contents">
          <SearchPanel
            id={panelId(SEARCH)}
            content={content.searchPanel}
            open={openPanel === SEARCH}
            inputRef={searchInputRef}
            onSubmitted={() => close()}
          />
        </div>
      ) : null}
    </div>
  );

  // Figma's prototype: Support opens the "contact drop down" (6725:45688) over the page, dimmed to 25% black, and a click
  // outside closes it. It opens under the utility row, left-aligned with Support (the prototype's offset is not usable):
  // Support is centred in the 64px row (63 inside its bottom border), so the row's bottom edge is 32.5px below its centre.
  const utilityNav = (
    <nav aria-label={`Utility${labelSuffix}`}>
      <ul className="flex items-center gap-space-10">
        {content.utility.map((link) =>
          link._key === CONTACT ? (
            <li key={link._key} data-header-key={link._key} className="relative">
              <button
                id={triggerId(CONTACT)}
                type="button"
                aria-expanded={openPanel === CONTACT}
                aria-controls={panels ? panelId(CONTACT) : undefined}
                onClick={() => onTriggerClick(CONTACT)}
                onKeyDown={(event) => onTriggerKeyDown(event, CONTACT)}
                className={navItemButtonClasses}
              >
                {link.label}
              </button>
              {panels ? (
                <div onClick={onPanelClick} className="contents">
                  {openPanel === CONTACT ? <div aria-hidden="true" data-contact-scrim="" onPointerDown={() => close()} className="fixed inset-0 z-10 bg-black-alpha-25" /> : null}
                  <ContactDropdown id={panelId(CONTACT)} content={content.contactDropdown} open={openPanel === CONTACT} className="absolute top-[calc(50%+32.5px)] left-0 z-20" />
                </div>
              ) : null}
            </li>
          ) : (
            <li key={link._key}>
              <NavItem href={link.href}>{link.label}</NavItem>
            </li>
          ),
        )}
      </ul>
    </nav>
  );

  const logo = (
    <div data-header-key="logo" className="contents">
      <Logo width={160} />
    </div>
  );

  const mainNav = (
    <nav aria-label={`Main${labelSuffix}`}>
      <ul className="flex items-center gap-space-10">
        {content.primary.map((link) => (
          <li key={link._key} data-header-key={link._key}>
            <button
              id={triggerId(link._key)}
              type="button"
              aria-expanded={openPanel === link._key}
              aria-controls={panels ? panelId(link._key) : undefined}
              data-current={pathname.startsWith(link.href) ? "" : undefined}
              onClick={() => onTriggerClick(link._key)}
              onPointerEnter={(event) => onTriggerPointerEnter(event, link._key)}
              onPointerLeave={() => window.clearTimeout(openTimer.current)}
              onKeyDown={(event) => onTriggerKeyDown(event, link._key)}
              className={navItemButtonClasses}
            >
              {link.label}
            </button>
            {/* In the DOM right after its trigger, so Tab moves from the trigger into the panel. */}
            {panels ? (
              <div onClick={onPanelClick} className="contents">
                <MegaMenuPanel
                  id={panelId(link._key)}
                  menu={link.menu}
                  label={link.label}
                  open={openPanel === link._key}
                  // Under the fixed bar the page cannot scroll a tall panel into view, so the panel scrolls instead.
                  className={fixed ? "max-h-[calc(100dvh-var(--sticky-header-height))] overflow-y-auto overscroll-contain" : undefined}
                />
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    // Panels position against the header (page bar) or against the fixed bar, under the bottom border.
    <div
      ref={barRef}
      data-header-bar={bar}
      inert={!active}
      onFocus={onBarFocus}
      onBlur={onBarBlur}
      onPointerEnter={() => window.clearTimeout(closeTimer.current)}
      onPointerLeave={onBarPointerLeave}
      className={cx(
        "hidden ui-desktop:block",
        // Figma's "Move In", from the top: 300ms ease-out (instant under reduced motion).
        fixed && "fixed inset-x-0 top-0 bg-secondary-ivory duration-300 ease-out motion-reduce:transition-none",
        // Hiding: visibility waits for the slide out to finish. Showing: visible at once, so focus can move in.
        fixed && (active ? "transition-[translate]" : "invisible -translate-y-full transition-[translate,visibility]"),
      )}
    >
      {layout === "two-row" ? (
        <>
          <div className="grid min-h-space-13 grid-cols-[1fr_auto_1fr] items-center border-b border-primary-leather px-space-6 py-space-2">
            {utilityNav}
            {logo}
            <div className="flex items-center justify-end gap-space-6">
              {search}
              <nav aria-label={`Account${labelSuffix}`}>
                <ul className="flex items-center gap-space-10">
                  <li data-header-key="account">
                    <NavItem href={content.account.href}>{content.account.label}</NavItem>
                  </li>
                  <li data-header-key="bag">
                    <NavItem href={content.bag.href} onClick={bagLinkClick}>
                      <span aria-hidden="true">
                        {content.bag.label} ({bagCount})
                      </span>
                      <span className="sr-only">{bagLabel}</span>
                    </NavItem>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div className="flex min-h-space-10 items-center justify-center border-b border-primary-leather px-space-6">
            {mainNav}
          </div>
        </>
      ) : (
        // Figma's bar is 66px with its bottom border inside: 13px above the 40px controls, 12px and the border below.
        <div className="grid min-h-(--sticky-header-height) grid-cols-[1fr_auto_1fr] items-center border-b border-primary-leather px-space-6 pt-[0.8125rem] pb-[calc(0.8125rem-1px)]">
          {logo}
          {mainNav}
          <div className="flex items-center justify-end gap-space-2">
            {search}
            <div data-header-key="account" className="contents">
              <IconLink link={content.account} icon="account" size="sm" label={content.account.label} />
            </div>
            <div data-header-key="bag" className="contents">
              <IconLink link={content.bag} icon="bag" size="sm" label={bagLabel} onClick={bagLinkClick} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type HeaderProps = {
  content?: HeaderContent;
  /**
   * Figma has a two-row header (the default, used on the Home frame) and a one-row version. The page header uses
   * both: the two-row header in the flow, and the one-row version as the bar fixed to the top once the page has
   * scrolled past it (the owner's decision; Figma does not draw a scrolled state).
   */
  layout?: "two-row" | "one-row";
  breakpoint?: "desktop" | "mobile";
  /** Style guide only: show the mobile menu open, in the flow instead of full screen. */
  defaultMenuOpen?: boolean;
  /** Style guide only: the category sub-screen to show with defaultMenuOpen. */
  defaultMenuCategory?: string;
  /** Appended to landmark labels so style guide previews stay unique. */
  labelSuffix?: string;
  /** The contact details for the contact dropdown: the site settings' (src/lib/content.ts). Without them, the module's. */
  contact?: FooterContent["contact"];
  /** The Education menu's blog posts: the Blog's posts as the build read them (src/lib/content.ts). Without them, the module's. */
  menuPosts?: BlogTeaser[];
};

/**
 * The site header. As the page's own header it stays reachable while the page scrolls:
 * - Desktop: the two-row header scrolls away with the Top Bar, then the one-row bar slides in, fixed to the top.
 *   It is out of the flow, so nothing moves. Only one of the two is in use at a time: the other is inert
 *   (out of the tab order and the accessibility tree), so there is one set of header controls and landmarks.
 * - Mobile: the header (the 56px row) is sticky, so it stops at the top while the Top Bar scrolls away.
 * Style guide previews (breakpoint, defaultMenuOpen or labelSuffix set) get neither.
 */
export function Header({
  content: baseContent = siteHeader,
  contact,
  menuPosts,
  layout = "two-row",
  breakpoint,
  defaultMenuOpen = false,
  defaultMenuCategory,
  labelSuffix = "",
}: HeaderProps) {
  const withPosts = menuPosts ? withMenuPosts(baseContent, menuPosts) : baseContent;
  const content = contact ? { ...withPosts, contactDropdown: contactDropdownFor(contact) } : withPosts;
  const bagCount = useBagCount();
  const bagLabel = `${content.bag.label}, ${bagCount} ${bagCount === 1 ? "item" : "items"}`;
  const baseId = useId();
  const mobilePanelId = `${baseId}-panel-mobile`;
  const pathname = usePathname() ?? "/";
  const isDesktop = useIsDesktop();
  const isPageHeader = !breakpoint && !defaultMenuOpen && !labelSuffix;
  // Following a link closes the bag panel.
  useEffect(() => {
    if (isPageHeader) closeBagPanel();
  }, [pathname, isPageHeader]);

  /* ---------- Desktop: the fixed bar ---------- */
  const headerRef = useRef<HTMLElement>(null);
  const pageBarRef = useRef<HTMLDivElement>(null);
  const fixedBarRef = useRef<HTMLDivElement>(null);
  /** True once the whole header has scrolled off the top. On mobile the header is sticky, so it never does. */
  const [scrolledPast, setScrolledPast] = useState(false);
  const [fixedBarShown, setFixedBarShown] = useState(false);
  if (scrolledPast && !fixedBarShown) setFixedBarShown(true);
  /** The control that had focus in the bar that is going away, or "" for one with no twin; null if focus was elsewhere. */
  const focusHandOff = useRef<string | null>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!isPageHeader || !header) return;
    let current = false;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1];
      const next = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
      if (next === current) return;
      current = next;
      const leaving = next ? pageBarRef.current : fixedBarRef.current;
      const focused = document.activeElement;
      focusHandOff.current = leaving?.contains(focused) ? (focused?.closest(`[${KEY}]`)?.getAttribute(KEY) ?? "") : null;
      setScrolledPast(next);
    });
    observer.observe(header);
    return () => observer.disconnect();
  }, [isPageHeader]);

  // Keyboard focus follows the swap: to the same control in the bar now in use, or to its first control.
  useEffect(() => {
    const key = focusHandOff.current;
    focusHandOff.current = null;
    if (key === null) return;
    const arriving = scrolledPast ? fixedBarRef.current : pageBarRef.current;
    const twin = key ? arriving?.querySelector<HTMLElement>(`[${KEY}="${key}"]`) : null;
    const target = twin?.querySelector<HTMLElement>("a[href], button") ?? arriving?.querySelector<HTMLElement>("a[href], button");
    if (!target) return;
    // Under reduced motion the global 0.01ms transition leaves the bar's controls hidden until the next frame,
    // and a hidden control cannot take focus: try again then.
    let frame = 0;
    const focus = (triesLeft: number) => {
      target.focus({ preventScroll: true });
      if (document.activeElement !== target && triesLeft > 0) frame = requestAnimationFrame(() => focus(triesLeft - 1));
    };
    focus(3);
    return () => cancelAnimationFrame(frame);
  }, [scrolledPast]);

  /* ---------- Mobile menu ---------- */
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileBarRef = useRef<HTMLDivElement>(null);

  // Close the mobile menu on navigation, and when the window grows to desktop.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }
  if (menuOpen && isDesktop && !breakpoint) setMenuOpen(false);

  // The top of the header row: 0 once it has stuck, the Top Bar's height or less before that.
  const mobileBarTop = () => Math.max(0, mobileBarRef.current?.getBoundingClientRect().top ?? 0);

  const openMenu = () => {
    // Start the full-screen menu at the header row, so the announcement bar stays visible at the top of the page.
    setMenuTop(mobileBarTop());
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    requestAnimationFrame(() => menuButtonRef.current?.focus({ preventScroll: true }));
  };

  const desktopBar = { content, labelSuffix, pathname, bagCount, bagLabel };

  return (
    <header
      ref={headerRef}
      data-breakpoint={breakpoint}
      className={cx(
        // Above everything in the page (cards and dropdowns go up to z-30); dialogs are in the top layer, above it.
        "z-40 bg-secondary-ivory text-primary-leather",
        isPageHeader ? "sticky top-0 ui-desktop:relative" : "relative",
      )}
    >
      {/* Desktop, 1024px and up. */}
      <DesktopBar {...desktopBar} layout={layout} bar={isPageHeader ? "page" : undefined} active={!scrolledPast} barRef={pageBarRef} />

      {/* Mobile, below 1024px */}
      {defaultMenuOpen ? (
        // Style guide preview: the menu draws its own header row, so the bar is not repeated.
        <div className="ui-desktop:hidden">
          <MobileMenu
            content={content}
            bagLabel={bagLabel}
            onClose={() => undefined}
            inline
            initialCategory={defaultMenuCategory}
            labelSuffix={labelSuffix}
          />
        </div>
      ) : (
        <>
          <div ref={mobileBarRef} className="ui-desktop:hidden">
            <MobileBar
              content={content}
              bagLabel={bagLabel}
              menuOpen={menuOpen}
              onMenuClick={menuOpen ? closeMenu : openMenu}
              menuButtonRef={menuButtonRef}
              controls={mobilePanelId}
            />
          </div>
          <div id={mobilePanelId} hidden={!menuOpen} className="ui-desktop:hidden">
            {menuOpen ? <MobileMenu content={content} bagLabel={bagLabel} top={menuTop} onClose={closeMenu} /> : null}
          </div>
        </>
      )}
      {/* Desktop: the one-row bar, fixed to the top once the page has scrolled past the header. */}
      {isPageHeader ? (
        <DesktopBar {...desktopBar} layout="one-row" bar="fixed" active={scrolledPast} panels={fixedBarShown} barRef={fixedBarRef} />
      ) : null}
      {/* The bag panel belongs to the page's own header only, not to the style guide's header previews. */}
      {isPageHeader ? <BagPanel content={content} bagLabel={bagLabel} getTop={mobileBarTop} /> : null}
    </header>
  );
}
