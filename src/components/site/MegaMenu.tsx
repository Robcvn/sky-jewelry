import Link from "next/link";
import { useId } from "react";
import { Icon } from "@/components/ui/Icon";
import { TextButtonLink } from "@/components/ui/TextButton";
import { cx } from "@/components/ui/shared";
import type { MegaMenu, MenuGroup, NavLink } from "@/content/site";
import { MenuLinkItem } from "./MenuLinkItem";
import { PostCard } from "./PostCard";

/** One labelled group of menu links, shared by the desktop panel and the mobile sub-screens. */
export function MenuGroupBlock({
  group,
  compact,
  headingLevel = 2,
}: {
  group: MenuGroup;
  compact?: boolean;
  headingLevel?: 2 | 3;
}) {
  const headingId = useId();
  const Heading = `h${headingLevel}` as const;

  return (
    <div className="flex flex-col gap-space-4">
      <Heading id={headingId} className="type-overline-xs-medium text-primary-leather">
        {group.title}
      </Heading>
      <ul aria-labelledby={headingId} className={group.columns === 2 ? "grid grid-cols-2" : "flex flex-col"}>
        {group.links.map((link) => (
          <li key={link._key} className="flex min-w-0">
            <MenuLinkItem link={link} compact={compact} />
          </li>
        ))}
      </ul>
      {group.footerLink ? <GroupFooterLink link={group.footerLink} /> : null}
    </div>
  );
}

function GroupFooterLink({ link }: { link: NavLink }) {
  return (
    <div className="flex pt-space-2">
      <TextButtonLink href={link.href} variant="caps" size="sm" trailingIcon="chevron-right">
        {link.label}
      </TextButtonLink>
    </div>
  );
}

/** Education's "Explore Our Blog" column. */
export function MenuBlogBlock({ blog, headingLevel = 2 }: { blog: NonNullable<MegaMenu["blog"]>; headingLevel?: 2 | 3 }) {
  const headingId = useId();
  const Heading = `h${headingLevel}` as const;

  return (
    <div className="flex flex-col gap-space-4">
      <Heading id={headingId} className="type-overline-xs-medium text-primary-leather">
        {blog.title}
      </Heading>
      <ul aria-labelledby={headingId} className="flex flex-col gap-space-4">
        {blog.posts.map((post) => (
          <li key={post._key}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
      <GroupFooterLink link={blog.footerLink} />
    </div>
  );
}

/**
 * Figma "Shop All": the full-width link under each panel and the fixed bar on mobile sub-screens (64px),
 * and the row at the end of each mobile sub-screen's list ("sm", 56px). Figma draws the borders inside.
 */
export function ShopAllRow({ link, size = "md", className }: { link: NavLink; size?: "md" | "sm"; className?: string }) {
  return (
    <Link
      href={link.href}
      className={cx(
        "ui-transition-fast type-overline-xs-medium flex items-center gap-space-1 border-y border-primary-leather bg-secondary-ivory text-primary-leather ui-hover:text-black-alpha-50 focus-visible:-outline-offset-2",
        size === "md" ? "px-space-6 py-[calc(var(--spacing-space-6)-1px)]" : "px-space-5 py-[calc(var(--spacing-space-5)-1px)]",
        className,
      )}
    >
      {link.label}
      <Icon name="chevron-right" size={16} />
    </Link>
  );
}

type MegaMenuPanelProps = {
  menu: MegaMenu;
  id?: string;
  /** Accessible name, such as "Fine Jewelry". */
  label: string;
  open?: boolean;
  /** Style guide only: render in the flow instead of overlaying the page. */
  inline?: boolean;
};

/** Figma "Mega Menu" dropdown: equal columns with leather dividers, then the Shop All row. */
export function MegaMenuPanel({ menu, id, label, open = true, inline = false }: MegaMenuPanelProps) {
  const compact = menu.density === "compact";
  const columns = [
    ...menu.groups.map((group) => <MenuGroupBlock key={group._key} group={group} compact={compact} />),
    ...(menu.blog ? [<MenuBlogBlock key="blog" blog={menu.blog} />] : []),
  ];

  return (
    <div
      id={id}
      role="region"
      aria-label={`${label} menu`}
      hidden={!open}
      className={cx(
        "bg-secondary-ivory text-primary-leather",
        !inline &&
          "absolute inset-x-0 top-full z-30 transition-opacity duration-200 ease-out starting:opacity-0",
      )}
    >
      <div className="flex">
        {columns.map((column, index) => (
          <div
            key={column.key}
            className={cx("min-w-0 flex-1 p-space-6", index < columns.length - 1 && "border-r border-primary-leather")}
          >
            {column}
          </div>
        ))}
      </div>
      <ShopAllRow link={menu.shopAll} />
    </div>
  );
}
