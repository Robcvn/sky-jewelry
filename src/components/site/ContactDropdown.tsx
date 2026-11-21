import Link from "next/link";
import { useId } from "react";
import { Icon } from "@/components/ui/Icon";
import { TextButtonLink, TextButtonText } from "@/components/ui/TextButton";
import { cx } from "@/components/ui/shared";
import type { ContactDropdownContent } from "@/content/site";

/** The frame's border is drawn inside it: content insets are Figma's less the 1px border. */
const INSET = "calc(var(--spacing-space-6) - 1px)";

type ContactDropdownProps = {
  id?: string;
  content: ContactDropdownContent;
  open: boolean;
  className?: string;
};

/**
 * Figma "contact drop down" (Desktop - Approved 6725:45688, 296 x 416), opened by the header's Support link. Ivory with a
 * leather border and 4px corners: "We're here to help." (heading-sm), then three Nav Item - Child rows (a 24px hazel icon;
 * the title in ui-sm medium, a line in ui-xs and a Text Button, SM, Caps), 24px in, 16 under the heading and 10 apart;
 * then the Shop All row, "more contact options", 64 tall. The phone and email are the site's sample details.
 */
export function ContactDropdown({ id, content, open, className }: ContactDropdownProps) {
  const headingId = useId();
  return (
    <div
      id={id}
      role="region"
      aria-labelledby={headingId}
      hidden={!open}
      className={cx("w-[18.5rem] overflow-hidden rounded-4 border border-primary-leather bg-secondary-ivory text-primary-leather", className)}
    >
      <div className="flex flex-col gap-space-4 pb-space-12" style={{ paddingTop: INSET, paddingInline: INSET }}>
        <h2 id={headingId} className="type-heading-sm">
          {content.heading}
        </h2>
        <ul className="flex flex-col gap-[0.625rem]">
          {content.items.map((item) => (
            <li key={item._key} className="flex items-start gap-space-2 py-space-2">
              <Icon name={item.icon} size={24} className="shrink-0 text-primary-hazel" />
              <div className="flex min-w-0 flex-col gap-[0.125rem]">
                <p className="type-ui-sm-medium">{item.title}</p>
                <div className="flex flex-col items-start">
                  <p className="type-ui-xs-regular min-h-[1.125rem]">{item.body}</p>
                  {item.cta.href ? (
                    <TextButtonLink href={item.cta.href} variant="caps" size="sm" trailingIcon="chevron-right">
                      {item.cta.label}
                    </TextButtonLink>
                  ) : (
                    // No destination yet (no chat or text service): drawn, not a link. Held for review.
                    <TextButtonText variant="caps" size="sm" trailingIcon="chevron-right">
                      {item.cta.label}
                    </TextButtonText>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Figma's Shop All row, as under the mega menus: its top border, the panel's border below it. */}
      <Link
        href={content.footerLink.href}
        className="ui-transition-fast type-overline-xs-medium flex items-center gap-space-1 border-t border-primary-leather text-primary-leather ui-hover:text-black-alpha-50 focus-visible:-outline-offset-2"
        style={{ padding: INSET }}
      >
        {content.footerLink.label}
        <Icon name="chevron-right" size={16} />
      </Link>
    </div>
  );
}
