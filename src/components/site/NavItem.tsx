"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cx, type PreviewState } from "@/components/ui/shared";

export function useIsCurrent(href: string) {
  const pathname = usePathname() ?? "/";
  return href !== "/" && pathname.startsWith(href);
}

type NavItemProps = {
  href: string;
  children: ReactNode;
  /** Figma "Nav Item - Overlay", used on the announcement bar. */
  overlay?: boolean;
  /** Style guide only: force Hover or Active. */
  previewState?: PreviewState | "current";
  className?: string;
};

const NAV_ITEM = "ui-transition type-overline-xs-medium relative inline-flex items-center whitespace-nowrap";
const NAV_ITEM_DEFAULT =
  "py-space-1 text-primary-leather ui-hover:text-black-alpha-60 aria-[current=page]:text-primary-hazel aria-[current=page]:shadow-[inset_0_-1px_0_var(--color-primary-hazel)]";

/**
 * Figma "Nav Item" as a disclosure button for the mega menus. Open shows the Active style
 * (Figma's open-menu frames), and so does being inside that section of the site.
 */
export const navItemButtonClasses = cx(
  NAV_ITEM,
  "cursor-pointer py-space-1 text-primary-leather ui-hover:text-black-alpha-60 aria-expanded:text-primary-hazel aria-expanded:shadow-[inset_0_-1px_0_var(--color-primary-hazel)] data-current:text-primary-hazel data-current:shadow-[inset_0_-1px_0_var(--color-primary-hazel)]",
);

/** Figma "Nav Item": a top-level link with Default, Hover and Active states. */
export function NavItem({ href, children, overlay = false, previewState, className }: NavItemProps) {
  const isCurrent = useIsCurrent(href);
  const current = previewState === "current" || (previewState === undefined && isCurrent);

  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      data-state={previewState === "current" ? undefined : previewState}
      className={cx(
        NAV_ITEM,
        overlay
          ? "ui-focus:outline-base-white py-space-2 text-secondary-ivory ui-hover:text-base-white aria-[current=page]:text-base-white aria-[current=page]:shadow-[inset_0_-1px_0_var(--color-secondary-gold)]"
          : NAV_ITEM_DEFAULT,
        className,
      )}
    >
      {children}
    </Link>
  );
}
