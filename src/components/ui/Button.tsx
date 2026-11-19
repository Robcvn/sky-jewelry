import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { Icon, type IconName } from "./Icon";
import { cx, type PreviewState } from "./shared";

export type ButtonSize = "md" | "sm" | "xs";
export type ButtonVariant = "default" | "secondary";

type ButtonStyleProps = {
  size?: ButtonSize;
  variant?: ButtonVariant;
  /** Figma "Button - Overlay", for use on images and dark surfaces. */
  overlay?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  /** Style guide only. */
  previewState?: PreviewState;
};

const SIZE = {
  md: "min-h-space-12 px-space-5 type-overline-sm-medium",
  sm: "min-h-space-10 px-space-4 type-overline-xs-medium",
  xs: "min-h-space-8 px-space-3 type-overline-xs-medium",
};

const LABEL_PADDING = { md: "px-space-3", sm: "px-space-2", xs: "px-1.5" };

const COLORS = {
  default:
    "border-primary-leather bg-primary-leather text-base-white ui-hover:bg-secondary-peach ui-hover:text-primary-leather ui-pressed:border-black-alpha-20 ui-pressed:bg-secondary-peach ui-pressed:text-primary-leather disabled:opacity-60 disabled:text-white-alpha-60",
  secondary:
    "border-secondary-gold bg-secondary-skin text-primary-leather ui-hover:border-primary-leather ui-hover:bg-secondary-peach ui-pressed:border-black-alpha-20 ui-pressed:bg-secondary-peach disabled:bg-white-alpha-0 disabled:opacity-50",
  overlayDefault:
    "border-secondary-peach bg-secondary-peach text-primary-leather ui-hover:border-secondary-gold ui-hover:bg-secondary-gold ui-pressed:border-secondary-gold ui-pressed:bg-secondary-gold ui-pressed:shadow-inset disabled:opacity-60 disabled:text-black-alpha-60 disabled:backdrop-blur-sm",
  overlaySecondary:
    "border-secondary-gold bg-white-alpha-2 text-base-white backdrop-blur-sm ui-hover:bg-secondary-gold ui-hover:text-primary-leather ui-hover:backdrop-blur-none ui-pressed:bg-secondary-gold ui-pressed:text-primary-leather ui-pressed:shadow-inset ui-pressed:backdrop-blur-none disabled:bg-white-alpha-0 disabled:opacity-50 disabled:backdrop-blur-none",
};

function buttonClasses({ size = "md", variant = "default", overlay }: ButtonStyleProps) {
  const color = overlay
    ? variant === "default"
      ? COLORS.overlayDefault
      : COLORS.overlaySecondary
    : COLORS[variant];

  return cx(
    "ui-transition inline-flex cursor-pointer items-center justify-center rounded-full border text-center disabled:cursor-not-allowed",
    SIZE[size],
    color,
    overlay && "ui-focus:outline-base-white",
  );
}

function ButtonContent({
  size = "md",
  overlay,
  leftIcon,
  rightIcon,
  children,
}: ButtonStyleProps & { children: ReactNode }) {
  return (
    <>
      {leftIcon ? <Icon name={leftIcon} size={16} /> : null}
      <span className={overlay && size === "xs" ? "px-space-2" : LABEL_PADDING[size]}>{children}</span>
      {rightIcon ? <Icon name={rightIcon} size={16} /> : null}
    </>
  );
}

type ButtonProps = ButtonStyleProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  size,
  variant,
  overlay,
  leftIcon,
  rightIcon,
  previewState,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      data-state={previewState}
      className={cx(buttonClasses({ size, variant, overlay }), className)}
      {...rest}
    >
      <ButtonContent size={size} overlay={overlay} leftIcon={leftIcon} rightIcon={rightIcon}>
        {children}
      </ButtonContent>
    </button>
  );
}

type ButtonLinkProps = ButtonStyleProps & ComponentProps<typeof Link>;

export function ButtonLink({
  size,
  variant,
  overlay,
  leftIcon,
  rightIcon,
  previewState,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      data-state={previewState}
      className={cx(buttonClasses({ size, variant, overlay }), className)}
      {...rest}
    >
      <ButtonContent size={size} overlay={overlay} leftIcon={leftIcon} rightIcon={rightIcon}>
        {children}
      </ButtonContent>
    </Link>
  );
}

type HeroButtonProps = ComponentProps<typeof Link> & {
  icon?: IconName;
  /** Figma "Hero Button - Overlay". */
  overlay?: boolean;
  /** LG is the only size on the solid version. Overlay also has SM. */
  size?: "lg" | "sm";
  previewState?: PreviewState;
};

export function HeroButton({
  icon = "setting",
  overlay = false,
  size = "lg",
  previewState,
  className,
  children,
  ...rest
}: HeroButtonProps) {
  const compact = overlay && size === "sm";

  return (
    <Link
      data-state={previewState}
      className={cx(
        "group/hero ui-transition relative isolate flex w-full items-center justify-center overflow-hidden",
        overlay
          ? "ui-focus:outline-base-white flex-col text-base-white [--hero-icon:var(--color-base-white)] ui-hover:[--hero-icon:var(--color-secondary-peach)] ui-pressed:[--hero-icon:var(--color-secondary-peach)]"
          : "gap-space-2 bg-secondary-ivory px-space-17 py-space-4 text-primary-leather [--hero-icon:var(--color-primary-leather)] ui-hover:bg-secondary-skin ui-hover:[--hero-icon:var(--color-secondary-gold)]",
        overlay && (compact ? "gap-space-1 px-space-2 pt-space-6 pb-space-8" : "gap-space-2 px-space-17 py-space-12"),
        !overlay && "min-h-space-18",
        className,
      )}
      {...rest}
    >
      {overlay ? (
        <span
          aria-hidden="true"
          className="ui-transition absolute inset-0 -z-10 bg-linear-to-b from-black-alpha-0 to-base-black opacity-0 group-hover/hero:opacity-30 group-active/hero:opacity-30 group-data-[state=hover]/hero:opacity-30 group-data-[state=pressed]/hero:opacity-30"
        />
      ) : null}
      <Icon name={icon} size={overlay ? (compact ? 40 : 48) : 24} className="ui-transition text-(--hero-icon)" />
      <span className="flex items-center">
        <span className={cx("type-heading-sm", !compact && "px-space-2")}>{children}</span>
        {compact ? null : (
          <Icon
            name="chevron-right"
            size={16}
            className="ui-transition opacity-0 group-hover/hero:opacity-100 group-focus-visible/hero:opacity-100 group-data-[state=hover]/hero:opacity-100"
          />
        )}
      </span>
    </Link>
  );
}
