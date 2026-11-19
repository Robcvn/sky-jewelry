import type { InputHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { cx } from "./shared";

type OptionTileProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "children"> & {
  /** "checkbox" for multi-select groups (Metal, Diamond Type), "radio" for one choice (Category). */
  type?: "checkbox" | "radio";
  /**
   * "square": the 80 x 80 Filters sheet tile with an icon or image. "text": the 48px-tall text-only tile that
   * fills its row. "compact": the 48 x 48 text tile of the quick view's Carat Weight row. "fill": an 80px-tall
   * tile that fills its grid column (the PDP Metal tiles, 94.8 x 80 in Figma).
   */
  shape?: "square" | "text" | "compact" | "fill";
  /** Label size: "xs" 12px regular (default for text tiles) or "2xs" 10px medium (the PDP carat tiles). */
  labelSize?: "xs" | "2xs";
  icon?: IconName;
  /** An image instead of an icon, e.g. a metal badge. */
  media?: ReactNode;
  children: ReactNode;
};

/**
 * Figma "Radio Button" SM tile as used in the Filters sheet and dropdowns: skin fill, black-alpha-20 border,
 * leather border when selected, ivory when pressed. The native input stays in the page for keyboard and
 * screen readers (Space toggles; arrow keys move within a radio group).
 */
export function OptionTile({ type = "checkbox", shape = "square", labelSize, icon, media, className, children, ...rest }: OptionTileProps) {
  return (
    <label
      className={cx(
        "ui-transition relative flex cursor-pointer flex-col items-center justify-center gap-space-1 rounded-4 border border-black-alpha-20 bg-secondary-skin p-space-2 text-center text-primary-leather",
        "has-checked:border-primary-leather active:not-has-checked:bg-secondary-ivory hover:not-has-checked:border-black-alpha-50",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary-leather",
        // Fixed-size tiles keep their size in a scrolling row; text tiles share (and shrink with) their row.
        { square: "size-space-15 shrink-0", compact: "size-space-12 shrink-0", fill: "h-space-15 w-full", text: "min-h-space-12 min-w-0 flex-1" }[shape],
        className,
      )}
    >
      <input type={type} className="sr-only" {...rest} />
      {media ?? (icon ? <Icon name={icon} size={32} /> : null)}
      <span className={(labelSize ?? (shape === "square" || shape === "fill" ? "2xs" : "xs")) === "2xs" ? "type-ui-2xs-medium" : "type-ui-xs-regular"}>
        {children}
      </span>
    </label>
  );
}
