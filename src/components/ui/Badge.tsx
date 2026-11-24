import type { HTMLAttributes } from "react";
import { Icon, type IconName } from "./Icon";
import { cx } from "./shared";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  size?: "md" | "sm" | "xs";
  /** Overlay badges support primary and secondary only. */
  variant?: "primary" | "secondary" | "error" | "success" | "transparent";
  overlay?: boolean;
  icon?: IconName;
};

const COLORS = {
  primary: "border-black-alpha-20 bg-secondary-skin text-primary-leather",
  secondary: "border-black-alpha-10 bg-secondary-ivory text-primary-leather",
  error: "border-state-error text-state-error",
  success: "border-transparent bg-state-success text-base-white",
  transparent: "border-white-alpha-20 bg-white-alpha-10 text-primary-leather backdrop-blur-md",
};

const OVERLAY_COLORS = {
  primary: "border-white-alpha-20 bg-white-alpha-10 text-base-white backdrop-blur-md",
  secondary: "border-secondary-gold bg-white-alpha-10 text-base-white backdrop-blur-md",
};

export function Badge({
  size = "md",
  variant = "primary",
  overlay = false,
  icon,
  className,
  children,
  ...rest
}: BadgeProps) {
  const color = overlay ? OVERLAY_COLORS[variant === "secondary" ? "secondary" : "primary"] : COLORS[variant];
  const compactPadding = overlay ? "px-space-2" : "px-1.5";

  return (
    <span
      className={cx(
        "inline-flex items-center gap-0.5 rounded-full border",
        // MD keeps Figma's 32px minimum. SM and XS hug their content (Figma: 4px padding, so 24px with the 16px icon and
        // 22px without); the padding is 1px less beside the 1px border, as Figma's stroke is inside. Badge - Overlay SM
        // and XS keep Figma's 24px minimum height, so the 14px upper-case SM label is 24 tall too.
        size === "md" ? "min-h-space-8 px-space-3" : cx("py-[3px]", compactPadding, overlay && "min-h-space-6"),
        size === "xs" ? "type-ui-xs-medium" : "type-overline-xs-medium",
        color,
        className,
      )}
      {...rest}
    >
      {icon && !overlay ? (
        <Icon name={icon} size={16} className={variant === "success" ? "text-secondary-skin" : undefined} />
      ) : null}
      <span className="px-space-1">{children}</span>
    </span>
  );
}
