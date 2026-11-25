import Link from "next/link";
import type { MouseEvent, Ref } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cx } from "@/components/ui/shared";
import type { HeaderContent, NavLink } from "@/content/site";
import { bagLinkClick } from "@/lib/bag";
import { Logo } from "./Logo";

const ICON_BUTTON =
  "ui-transition inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-transparent text-primary-leather hover:bg-black-alpha-5 active:border-black-alpha-10 active:bg-black-alpha-5";

/** Figma "Icon Button" in the header. Expanded (search open) shows the Active style. */
export const headerIconButtonClasses = (size: "md" | "sm") =>
  cx(
    ICON_BUTTON,
    "aria-expanded:border-black-alpha-10 aria-expanded:bg-black-alpha-5",
    size === "md" ? "size-space-10" : "size-space-8",
  );

export function IconLink({
  link,
  icon,
  size,
  label,
  onClick,
  dot = false,
}: {
  link: NavLink;
  icon: IconName;
  size: "md" | "sm";
  label: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /**
   * The bag's dot (Rob's request, Nov 24; Figma draws none): an 8px primary/leather circle at the icon's top right while
   * the bag has an item. Decorative: the label gives the count. Absolutely placed, so the button keeps its size; its
   * corner meets the icon box's (inset by the button's 1px border).
   */
  dot?: boolean;
}) {
  return (
    <Link href={link.href} aria-label={label} onClick={onClick} className={cx("relative", headerIconButtonClasses(size))}>
      <Icon name={icon} size={24} />
      {dot ? (
        <span
          aria-hidden="true"
          data-bag-dot=""
          className={cx("pointer-events-none absolute size-2 rounded-full bg-primary-leather", size === "md" ? "top-1.75 right-1.75" : "top-0.75 right-0.75")}
        />
      ) : null}
    </Link>
  );
}

type MobileBarProps = {
  content: HeaderContent;
  bagLabel: string;
  /** The bag has an item: the bag icon shows its dot. */
  bagDot?: boolean;
  menuOpen: boolean;
  onMenuClick: () => void;
  menuButtonRef?: Ref<HTMLButtonElement>;
  /** The id the menu button controls. Only the header's own bar sets it. */
  controls?: string;
  className?: string;
};

/** The 56px mobile header row: menu or close button, centred logo, account and bag. */
export function MobileBar({ content, bagLabel, bagDot = false, menuOpen, onMenuClick, menuButtonRef, controls, className }: MobileBarProps) {
  return (
    <div
      // Hook for the sticky header's scroll rule in components.css.
      data-header-row=""
      className={cx(
        "relative flex min-h-space-12 shrink-0 items-center justify-between border-b border-primary-leather bg-secondary-ivory px-space-3",
        className,
      )}
    >
      <button
        ref={menuButtonRef}
        type="button"
        aria-expanded={controls ? menuOpen : undefined}
        aria-controls={controls}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={onMenuClick}
        className={headerIconButtonClasses("sm")}
      >
        <Icon name={menuOpen ? "close" : "menu"} size={24} />
      </button>
      <Logo width={140} className="absolute left-1/2 -translate-x-1/2" />
      <div className="flex items-center gap-space-2">
        <IconLink link={content.account} icon="account" size="sm" label={content.account.label} />
        <IconLink link={content.bag} icon="bag" size="sm" label={bagLabel} onClick={bagLinkClick} dot={bagDot} />
      </div>
    </div>
  );
}
