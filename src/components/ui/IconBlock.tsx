import { Icon, type IconName } from "./Icon";
import { cx } from "./shared";
import { TextButtonText } from "./TextButton";

type IconBlockProps = {
  icon: IconName;
  /** The label (Figma "heading"); `lines` breaks it in two on desktop, as the product page's icon row does. */
  label: string;
  lines?: [string, string];
  /** Figma "showBody": a line of text under the label. */
  body?: string;
  /**
   * "stacked": Type=Default (MD desktop, SM mobile), icon above the text, centred.
   * "row-on-mobile": Type=Default MD from 1024px, and Type=Row XS below it (32px icon on the left, left-aligned
   * 14/18 title and 10/14 body), as the landing pages' guarantee section.
   */
  layout?: "stacked" | "row-on-mobile";
  /** Render the label as a heading (h3) when the block sits under a section heading. */
  asHeading?: boolean;
  /** Icon colour when it differs from the text, e.g. text-primary-hazel on the landing guarantee row. */
  iconClassName?: string;
  className?: string;
};

/** Figma "Icon Block" (Design System 2760:23823). */
export function IconBlock({ icon, label, lines, body, layout = "stacked", asHeading = false, iconClassName, className }: IconBlockProps) {
  const Label = asHeading ? "h3" : "p";
  const row = layout === "row-on-mobile";
  return (
    <div
      className={cx(
        "flex flex-1 text-primary-leather",
        // Stacked: Figma's Type=Default puts 4px between icon and text at Size=SM (mobile), 8px at MD (desktop).
        row ? "flex-row items-start gap-space-1 ui-desktop:flex-col ui-desktop:items-center ui-desktop:gap-space-2 ui-desktop:text-center" : "flex-col items-center gap-space-1 text-center ui-desktop:gap-space-2",
        className,
      )}
    >
      {row ? (
        <>
          <Icon name={icon} size={32} className={cx("ui-desktop:hidden", iconClassName)} />
          <Icon name={icon} size={48} className={cx("hidden ui-desktop:block", iconClassName)} />
        </>
      ) : (
        <Icon name={icon} size={48} className={iconClassName} />
      )}
      <div className={cx("flex flex-col", row ? "flex-1 gap-space-1 px-space-2 ui-desktop:gap-space-2" : "gap-space-2", body && !row && "px-space-2")}>
        <Label className={row ? "type-ui-sm-medium ui-desktop:type-ui-xs-medium" : "type-ui-2xs-medium ui-desktop:type-ui-xs-medium"}>
          {lines ? (
            <>
              <span className="ui-desktop:block">{lines[0]}</span> <span className="ui-desktop:block">{lines[1]}</span>
            </>
          ) : (
            label
          )}
        </Label>
        {body ? <p className={row ? "type-ui-2xs-regular ui-desktop:type-ui-xs-regular" : "type-ui-xs-regular"}>{body}</p> : null}
      </div>
    </div>
  );
}

/**
 * Figma "Icon Block", Type=Card (Sky Guarantee 3565:101916 / 3587:129907): a skin card with a gold 1px border and 8px
 * corners, the 48px icon, the title and one line, centred. MD from 1024px (24 / 16 padding, 8 gap, ui-sm title, ui-xs
 * body); SM below it (16 / 12 padding, 4 gap, ui-xs title, ui-2xs body). `action` is a Text Button with nothing to
 * connect to yet: drawn, but inert (Held for review).
 */
export function IconCard({
  icon,
  title,
  body,
  action,
  headingLevel = 3,
  iconTone = "leather",
}: {
  icon: IconName;
  title: string;
  body: string;
  action?: string;
  headingLevel?: 3 | 4;
  /** The support frames stroke most of these icons in primary/hazel (Task 30, sup-1440-5). */
  iconTone?: "leather" | "hazel";
}) {
  const Heading = `h${headingLevel}` as "h3" | "h4";
  return (
    <div className="flex h-full flex-col items-center gap-space-1 rounded-8 border border-secondary-gold bg-secondary-skin px-space-3 py-space-4 text-center text-primary-leather ui-desktop:gap-space-2 ui-desktop:px-space-4 ui-desktop:py-space-6">
      <Icon name={icon} size={48} className={iconTone === "hazel" ? "text-primary-hazel" : undefined} />
      <Heading className="type-ui-xs-medium ui-desktop:type-ui-sm-medium">{title}</Heading>
      <p className="type-ui-2xs-regular break-words ui-desktop:type-ui-xs-regular">{body}</p>
      {action ? (
        // Desktop draws a Chevron Right after the label; mobile none. Pinned to the card's foot, so the links of a row line
        // up when one card's text is shorter (3587:129907; Task 30, sup-390-8).
        <span className="mt-auto inline-flex items-center gap-space-1 pt-space-1 text-primary-leather ui-desktop:pt-space-2">
          <TextButtonText size="sm" variant="caps">
            {action}
          </TextButtonText>
          <Icon name="chevron-right" size={16} className="hidden ui-desktop:block" />
        </span>
      ) : null}
    </div>
  );
}
