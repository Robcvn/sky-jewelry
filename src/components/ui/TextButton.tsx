import type { ButtonHTMLAttributes } from "react";
import { Icon, type IconName } from "./Icon";
import { cx, type PreviewState } from "./shared";

type TextButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "md" | "sm";
  variant?: "default" | "caps";
  overlay?: boolean;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  previewState?: PreviewState;
};

const TYPE = {
  default: { md: "type-ui-xs-medium", sm: "type-ui-2xs-medium" },
  caps: { md: "type-overline-sm-medium", sm: "type-overline-xs-medium" },
};

export function TextButton({
  size = "md",
  variant = "default",
  overlay = false,
  leadingIcon,
  trailingIcon,
  previewState,
  className,
  children,
  type = "button",
  ...rest
}: TextButtonProps) {
  return (
    <button
      type={type}
      data-state={previewState}
      className={cx(
        "ui-transition-fast relative inline-flex cursor-pointer items-center gap-space-1 rounded-8 disabled:cursor-not-allowed",
        "after:absolute after:-inset-y-1 after:inset-x-0",
        TYPE[variant][size],
        overlay
          ? "ui-focus:outline-base-white text-base-white ui-hover:text-secondary-peach ui-pressed:text-white-alpha-60 disabled:text-white-alpha-50"
          : "text-primary-leather ui-hover:text-black-alpha-50 ui-pressed:text-black-alpha-40 disabled:text-black-alpha-50",
        className,
      )}
      {...rest}
    >
      {leadingIcon ? <Icon name={leadingIcon} size={16} /> : null}
      <span className={variant === "caps" && size === "md" ? "pt-px" : undefined}>{children}</span>
      {trailingIcon ? <Icon name={trailingIcon} size={16} /> : null}
    </button>
  );
}
