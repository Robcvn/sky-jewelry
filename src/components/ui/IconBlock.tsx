import { Icon, type IconName } from "./Icon";
import { cx } from "./shared";

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
  className?: string;
};

/** Figma "Icon Block" (Design System 2760:23823). */
export function IconBlock({ icon, label, lines, body, layout = "stacked", asHeading = false, className }: IconBlockProps) {
  const Label = asHeading ? "h3" : "p";
  const row = layout === "row-on-mobile";
  return (
    <div
      className={cx(
        "flex flex-1 text-primary-leather",
        row ? "flex-row items-start gap-space-1 ui-desktop:flex-col ui-desktop:items-center ui-desktop:gap-space-2 ui-desktop:text-center" : "flex-col items-center gap-space-2 text-center",
        className,
      )}
    >
      {row ? (
        <>
          <Icon name={icon} size={32} className="ui-desktop:hidden" />
          <Icon name={icon} size={48} className="hidden ui-desktop:block" />
        </>
      ) : (
        <Icon name={icon} size={48} />
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
