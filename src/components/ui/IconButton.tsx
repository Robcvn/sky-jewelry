import type { ButtonHTMLAttributes } from "react";
import { Icon, type IconName } from "./Icon";
import { cx, type PreviewState } from "./shared";

type IconButtonSize = "xs" | "sm" | "md" | "lg";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  icon: IconName;
  /** Required accessible name. */
  label: string;
  size?: IconButtonSize;
  /** Figma Type: Primary, or Secondary on the overlay set, or Ghost. XS exists only for Ghost. */
  variant?: "primary" | "ghost";
  overlay?: boolean;
  previewState?: PreviewState;
};

const BOX = { xs: "size-space-6", sm: "size-space-8", md: "size-space-10", lg: "size-space-12" };

function iconSize(size: IconButtonSize, variant: "primary" | "ghost", overlay: boolean) {
  if (size === "lg") return 28;
  if (size === "md") return 24;
  if (size === "xs") return 20;
  return variant === "ghost" && !overlay ? 24 : 20;
}

const COLORS = {
  primary:
    "border-secondary-gold bg-secondary-skin text-primary-leather ui-hover:border-primary-leather ui-hover:bg-secondary-ivory ui-pressed:border-black-alpha-20 ui-pressed:bg-secondary-ivory ui-pressed:shadow-inset disabled:bg-white-alpha-0 disabled:opacity-50",
  ghost:
    "border-transparent bg-white-alpha-0 text-primary-leather ui-hover:bg-black-alpha-5 ui-pressed:border-black-alpha-10 ui-pressed:bg-black-alpha-5 disabled:bg-transparent disabled:opacity-50",
  overlayPrimary:
    "ui-focus:outline-base-white border-secondary-gold bg-white-alpha-5 text-base-white ui-hover:bg-secondary-ivory ui-hover:text-primary-leather ui-pressed:border-black-alpha-20 ui-pressed:bg-secondary-ivory ui-pressed:text-primary-leather ui-pressed:shadow-inset disabled:bg-white-alpha-0 disabled:opacity-50",
  overlayGhost:
    "ui-focus:outline-base-white border-transparent bg-white-alpha-0 text-base-white ui-hover:bg-secondary-ivory ui-hover:text-primary-leather ui-pressed:border-black-alpha-10 ui-pressed:bg-secondary-ivory ui-pressed:text-primary-leather disabled:bg-transparent disabled:opacity-50",
};

export function IconButton({
  icon,
  label,
  size = "md",
  variant = "primary",
  overlay = false,
  previewState,
  className,
  type = "button",
  ...rest
}: IconButtonProps) {
  const color = overlay ? (variant === "primary" ? COLORS.overlayPrimary : COLORS.overlayGhost) : COLORS[variant];

  return (
    <button
      type={type}
      aria-label={label}
      data-state={previewState}
      className={cx(
        "ui-transition inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border disabled:cursor-not-allowed",
        BOX[size],
        color,
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={iconSize(size, variant, overlay)} />
    </button>
  );
}

type IconLabelButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconName;
  layout?: "stack" | "row";
  previewState?: PreviewState;
};

export function IconLabelButton({
  icon,
  layout = "stack",
  previewState,
  className,
  children,
  type = "button",
  ...rest
}: IconLabelButtonProps) {
  return (
    <button
      type={type}
      data-state={previewState}
      className={cx(
        "ui-transition-fast type-overline-xs-link inline-flex cursor-pointer items-center rounded-full text-primary-leather ui-hover:text-black-alpha-50",
        layout === "stack" ? "flex-col gap-0.5" : "gap-space-1",
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={28} />
      {children}
    </button>
  );
}
