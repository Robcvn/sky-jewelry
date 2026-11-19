"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cx } from "@/components/ui/shared";
import { siteHeader, type HeaderContent, type NavLink } from "@/content/site";
import { Logo } from "./Logo";
import { NavItem } from "./NavItem";

const BAG_COUNT = 0;

function IconLink({ link, icon, size, label }: { link: NavLink; icon: IconName; size: "md" | "sm"; label: string }) {
  return (
    <Link
      href={link.href}
      aria-label={label}
      className={cx(
        "ui-transition inline-flex shrink-0 items-center justify-center rounded-full border border-transparent text-primary-leather hover:bg-black-alpha-5 active:border-black-alpha-10 active:bg-black-alpha-5",
        size === "md" ? "size-space-10" : "size-space-8",
      )}
    >
      <Icon name={icon} size={24} />
    </Link>
  );
}

function NavList({ label, links, className }: { label: string; links: NavLink[]; className?: string }) {
  return (
    <nav aria-label={label}>
      <ul className={cx("flex items-center gap-space-10", className)}>
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
  /** The mobile navigation panel, built in the next task. It renders below the header when the menu is open. */
  mobilePanel?: ReactNode;
  defaultMenuOpen?: boolean;
  /** Appended to landmark labels so style guide previews stay unique. */
  labelSuffix?: string;
};

export function Header({
  content = siteHeader,
  layout = "two-row",
  breakpoint,
  mobilePanel,
  defaultMenuOpen = false,
  labelSuffix = "",
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(defaultMenuOpen);
  const panelId = useId();
  const bagLabel = `${content.bag.label}, ${BAG_COUNT} items`;

  return (
    <header data-breakpoint={breakpoint} className="relative z-20 bg-secondary-ivory text-primary-leather">
      {/* Desktop, 1024px and up */}
      <div className="hidden ui-desktop:block">
        {layout === "two-row" ? (
          <>
            <div className="grid min-h-space-13 grid-cols-[1fr_auto_1fr] items-center border-b border-primary-leather px-space-6 py-space-2">
              <NavList label={`Utility${labelSuffix}`} links={content.utility} />
              <Logo width={160} />
              <div className="flex items-center justify-end gap-space-6">
                <IconLink link={content.search} icon="search" size="md" label={content.search.label} />
                <nav aria-label={`Account${labelSuffix}`}>
                  <ul className="flex items-center gap-space-10">
                    <li>
                      <NavItem href={content.account.href}>{content.account.label}</NavItem>
                    </li>
                    <li>
                      <NavItem href={content.bag.href}>
                        <span aria-hidden="true">
                          {content.bag.label} ({BAG_COUNT})
                        </span>
                        <span className="sr-only">{bagLabel}</span>
                      </NavItem>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <div className="flex min-h-space-10 items-center justify-center border-b border-primary-leather px-space-6">
              <NavList label={`Main${labelSuffix}`} links={content.primary} />
            </div>
          </>
        ) : (
          <div className="grid min-h-[4.125rem] grid-cols-[1fr_auto_1fr] items-center border-b border-primary-leather px-space-6 py-[0.8125rem]">
            <Logo width={160} />
            <NavList label={`Main${labelSuffix}`} links={content.primary} />
            <div className="flex items-center justify-end gap-space-2">
              <IconLink link={content.search} icon="search" size="md" label={content.search.label} />
              <IconLink link={content.account} icon="account" size="sm" label={content.account.label} />
              <IconLink link={content.bag} icon="bag" size="sm" label={bagLabel} />
            </div>
          </div>
        )}
      </div>

      {/* Mobile, below 1024px */}
      <div className="relative flex min-h-space-12 items-center justify-between border-b border-primary-leather px-space-3 ui-desktop:hidden">
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls={panelId}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
          className="ui-transition inline-flex size-space-8 cursor-pointer items-center justify-center rounded-full border border-transparent text-primary-leather hover:bg-black-alpha-5 active:border-black-alpha-10 active:bg-black-alpha-5"
        >
          <Icon name={menuOpen ? "close" : "menu"} size={24} />
        </button>
        <Logo width={140} className="absolute left-1/2 -translate-x-1/2" />
        <div className="flex items-center gap-space-2">
          <IconLink link={content.account} icon="account" size="sm" label={content.account.label} />
          <IconLink link={content.bag} icon="bag" size="sm" label={bagLabel} />
        </div>
      </div>
      <div id={panelId} hidden={!menuOpen} className="ui-desktop:hidden">
        {mobilePanel}
      </div>
    </header>
  );
}
