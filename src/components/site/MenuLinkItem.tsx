import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Swatch } from "@/components/ui/Swatch";
import { cx } from "@/components/ui/shared";
import type { MenuLink } from "@/content/site";

type MenuLinkItemProps = {
  link: MenuLink;
  /** Figma rows are 40px with an icon or swatch, and 34px for text only and for the compact Fine Jewelry panel. */
  compact?: boolean;
  className?: string;
};

/**
 * Figma "Nav Item - Child": a menu link with an optional 24px icon or swatch. Default and Hover states.
 * Icons are primary/hazel (#746345) against the leather label, as the mega menu and mobile menu frames draw them.
 */
export function MenuLinkItem({ link, compact = false, className }: MenuLinkItemProps) {
  const short = compact || !link.media;
  const classes = cx("type-ui-sm-medium flex w-full items-center gap-space-1 py-space-1 text-primary-leather", short ? "min-h-[2.125rem]" : "min-h-space-10", className);
  const content = (
    <>
      {link.media ? (
        <span className="flex size-space-6 shrink-0 items-center justify-center">
          {link.media._type === "menuIcon" ? <Icon name={link.media.icon} size={24} className="text-primary-hazel" /> : <Swatch color={link.media.color} />}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">{link.label}</span>
    </>
  );

  // No page matches the item yet: drawn as designed, but not a link (no pointer, no hover). Held for review.
  if (!link.href) return <span className={classes}>{content}</span>;

  return (
    <Link href={link.href} className={cx("ui-transition-fast ui-hover:text-black-alpha-60", classes)}>
      {content}
    </Link>
  );
}
