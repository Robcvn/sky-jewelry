"use client";

import { usePathname } from "next/navigation";
import { useBagCount } from "@/lib/bag";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { Icon } from "@/components/ui/Icon";
import { useIsDesktop } from "@/components/ui/useIsDesktop";
import { siteHeader, type HeaderContent, type NavLink } from "@/content/site";
import { headerIconButtonClasses, IconLink, MobileBar } from "./HeaderParts";
import { Logo } from "./Logo";
import { MegaMenuPanel } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { NavItem, navItemButtonClasses } from "./NavItem";
import { SearchPanel } from "./SearchPanel";

const SEARCH = "search";
/** Hover intent: a short wait before opening, so sweeping the pointer across the nav does not flash panels. */
const OPEN_DELAY = 120;
/** Grace period after the pointer leaves the header and panel. */
const CLOSE_DELAY = 250;

function NavList({ label, links }: { label: string; links: NavLink[] }) {
  return (
    <nav aria-label={label}>
      <ul className="flex items-center gap-space-10">
        {links.map((link) => (
          <li key={link._key}>
            <NavItem href={link.href}>{link.label}</NavItem>
          </li>
        ))}
      </ul>
    </nav>
  );
}

type HeaderProps = {
  content?: HeaderContent;
  /**
   * Figma has a two-row header (the default, used on the Home frame) and a one-row version.
   * Figma does not say when the one-row version is used, so it is a prop for now.
   */
  layout?: "two-row" | "one-row";
  breakpoint?: "desktop" | "mobile";
  /** Style guide only: show the mobile menu open, in the flow instead of full screen. */
  defaultMenuOpen?: boolean;
  /** Style guide only: the category sub-screen to show with defaultMenuOpen. */
  defaultMenuCategory?: string;
  /** Appended to landmark labels so style guide previews stay unique. */
  labelSuffix?: string;
};

export function Header({
  content = siteHeader,
  layout = "two-row",
  breakpoint,
  defaultMenuOpen = false,
  defaultMenuCategory,
  labelSuffix = "",
}: HeaderProps) {
  const bagCount = useBagCount();
  const bagLabel = `${content.bag.label}, ${bagCount} ${bagCount === 1 ? "item" : "items"}`;
  const baseId = useId();
  const panelId = (key: string) => `${baseId}-panel-${key}`;
  const triggerId = (key: string) => `${baseId}-trigger-${key}`;
  const pathname = usePathname() ?? "/";
  const isDesktop = useIsDesktop();

  /* ---------- Desktop: mega menus and search ---------- */
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const openedBy = useRef<"hover" | "click">("click");
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const focusOnOpen = useRef<"first-link" | "search" | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  /* ---------- Mobile menu ---------- */
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileBarRef = useRef<HTMLDivElement>(null);

  // Close everything on navigation, and the mobile menu when the window grows to desktop.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpenPanel(null);
    setMenuOpen(false);
  }
  if (menuOpen && isDesktop && !breakpoint) setMenuOpen(false);

  const clearTimers = () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  };

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

  // A press anywhere outside the header closes the open panel.
  useEffect(() => {
    if (!openPanel) return;
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) close();
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

  const onHeaderKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && openPanel) {
      event.preventDefault();
      close(openPanel);
    }
  };

  // Keyboard users: close when focus leaves the open trigger and its panel.
  const onHeaderFocus = (event: FocusEvent) => {
    if (!openPanel) return;
    const trigger = document.getElementById(triggerId(openPanel));
    const panel = document.getElementById(panelId(openPanel));
    const target = event.target as Node;
    if (!trigger?.contains(target) && !panel?.contains(target)) close();
  };

  const onHeaderBlur = (event: FocusEvent) => {
    if (openPanel && event.relatedTarget && !headerRef.current?.contains(event.relatedTarget as Node)) close();
  };

  const onHeaderPointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || !openPanel) {
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

  const searchButton = (
    <button
      id={triggerId(SEARCH)}
      type="button"
      aria-label={content.search.label}
      aria-expanded={openPanel === SEARCH}
      aria-controls={panelId(SEARCH)}
      onClick={() => onTriggerClick(SEARCH)}
      className={headerIconButtonClasses("md")}
    >
      <Icon name="search" size={24} />
    </button>
  );

  const searchPanel = (
    <SearchPanel
      id={panelId(SEARCH)}
      content={content.searchPanel}
      open={openPanel === SEARCH}
      inputRef={searchInputRef}
      onSubmitted={() => close()}
    />
  );

  const mainNav = (
    <nav aria-label={`Main${labelSuffix}`}>
      <ul className="flex items-center gap-space-10">
        {content.primary.map((link) => (
          <li key={link._key}>
            <button
              id={triggerId(link._key)}
              type="button"
              aria-expanded={openPanel === link._key}
              aria-controls={panelId(link._key)}
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
            <div onClick={onPanelClick} className="contents">
              <MegaMenuPanel id={panelId(link._key)} menu={link.menu} label={link.label} open={openPanel === link._key} />
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );

  /* ---------- Mobile handlers ---------- */
  const openMenu = () => {
    // Start the full-screen menu at the header row, so the announcement bar stays visible at the top of the page.
    setMenuTop(Math.max(0, mobileBarRef.current?.getBoundingClientRect().top ?? 0));
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  return (
    <header
      ref={headerRef}
      data-breakpoint={breakpoint}
      onKeyDown={onHeaderKeyDown}
      onFocus={onHeaderFocus}
      onBlur={onHeaderBlur}
      onPointerEnter={() => window.clearTimeout(closeTimer.current)}
      onPointerLeave={onHeaderPointerLeave}
      className="relative z-20 bg-secondary-ivory text-primary-leather"
    >
      {/* Desktop, 1024px and up. Panels position against the header, under its bottom border. */}
      <div className="hidden ui-desktop:block">
        {layout === "two-row" ? (
          <>
            <div className="grid min-h-space-13 grid-cols-[1fr_auto_1fr] items-center border-b border-primary-leather px-space-6 py-space-2">
              <NavList label={`Utility${labelSuffix}`} links={content.utility} />
              <Logo width={160} />
              <div className="flex items-center justify-end gap-space-6">
                {searchButton}
                <div onClick={onPanelClick} className="contents">
                  {searchPanel}
                </div>
                <nav aria-label={`Account${labelSuffix}`}>
                  <ul className="flex items-center gap-space-10">
                    <li>
                      <NavItem href={content.account.href}>{content.account.label}</NavItem>
                    </li>
                    <li>
                      <NavItem href={content.bag.href}>
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
          <div className="grid min-h-[4.125rem] grid-cols-[1fr_auto_1fr] items-center border-b border-primary-leather px-space-6 py-[0.8125rem]">
            <Logo width={160} />
            {mainNav}
            <div className="flex items-center justify-end gap-space-2">
              {searchButton}
              {searchPanel}
              <IconLink link={content.account} icon="account" size="sm" label={content.account.label} />
              <IconLink link={content.bag} icon="bag" size="sm" label={bagLabel} />
            </div>
          </div>
        )}
      </div>

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
              controls={panelId("mobile")}
            />
          </div>
          <div id={panelId("mobile")} hidden={!menuOpen} className="ui-desktop:hidden">
            {menuOpen ? <MobileMenu content={content} bagLabel={bagLabel} top={menuTop} onClose={closeMenu} /> : null}
          </div>
        </>
      )}
    </header>
  );
}
