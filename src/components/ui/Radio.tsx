import type { InputHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { cx, type PreviewState } from "./shared";

type NativeRadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "color">;

type RadioColor = "default" | "success";

type BaseProps = NativeRadioProps & {
  previewState?: PreviewState;
};

const MARK_COLORS = {
  default:
    "[--radio-border:var(--color-black-alpha-50)] [--radio-dot:var(--color-primary-leather)] ui-hover:[--radio-border:var(--color-primary-leather)] has-checked:[--radio-border:var(--color-primary-leather)]",
  success:
    "[--radio-border:var(--color-black-alpha-50)] [--radio-dot:var(--color-state-success)] ui-hover:not-has-checked:[--radio-border:var(--color-primary-leather)] has-checked:[--radio-border:var(--color-state-success)]",
};

function RadioMark() {
  return (
    <span className="ui-transition relative flex size-space-5 shrink-0 items-center justify-center rounded-full border border-(--radio-border) peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-leather">
      <span className="ui-transition size-space-3 rounded-full bg-(--radio-dot) opacity-0 group-has-checked/radio:opacity-100" />
    </span>
  );
}

function HiddenInput({ previewState: _previewState, className: _className, ...rest }: BaseProps) {
  void _previewState;
  void _className;
  return <input type="radio" className="peer sr-only" {...rest} />;
}

type RadioProps = BaseProps & { color?: RadioColor; label: string };

/** Figma "Radio": the bare control. The label is visually hidden. */
export function Radio({ color = "default", label, previewState, className, ...rest }: RadioProps) {
  return (
    <label
      data-state={previewState}
      className={cx("group/radio inline-flex cursor-pointer", MARK_COLORS[color], className)}
    >
      <HiddenInput {...rest} />
      <RadioMark />
      <span className="sr-only">{label}</span>
    </label>
  );
}

type RadioOptionProps = BaseProps & { color?: RadioColor; heading?: ReactNode; children: ReactNode };

export function RadioOption({ color = "default", heading, previewState, className, children, ...rest }: RadioOptionProps) {
  return (
    <label
      data-state={previewState}
      className={cx("group/radio flex cursor-pointer items-start gap-space-2 text-primary-leather", MARK_COLORS[color], className)}
    >
      <HiddenInput {...rest} />
      <RadioMark />
      <span className="flex min-w-0 flex-1 flex-col gap-space-1 py-0.5">
        {heading ? <span className="type-ui-md-medium">{heading}</span> : null}
        <span className="type-ui-sm-regular">{children}</span>
      </span>
    </label>
  );
}

type RadioSelectProps = BaseProps & {
  color?: RadioColor;
  heading?: ReactNode;
  price?: ReactNode;
  children: ReactNode;
};

export function RadioSelect({ color = "default", heading, price, previewState, className, children, ...rest }: RadioSelectProps) {
  return (
    <label
      data-state={previewState}
      className={cx(
        "group/radio ui-transition flex min-h-space-13 cursor-pointer items-center gap-space-3 rounded-4 border border-black-alpha-20 px-space-4 py-[calc(var(--spacing-space-3)-1px)] text-primary-leather has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary-leather ui-hover:not-has-checked:border-secondary-gold",
        color === "success" ? "has-checked:border-state-success" : "has-checked:border-primary-leather",
        MARK_COLORS[color],
        className,
      )}
    >
      <HiddenInput {...rest} />
      <RadioMark />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 py-0.5">
        {heading ? <span className="type-ui-sm-medium">{heading}</span> : null}
        <span className="type-ui-xs-regular">{children}</span>
      </span>
      {price ? <span className="type-ui-md-medium shrink-0">{price}</span> : null}
    </label>
  );
}

const TILE =
  "ui-transition flex cursor-pointer flex-col items-center rounded-4 border text-center text-primary-leather has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary-leather";

type RadioButtonProps = BaseProps & {
  size?: "md" | "sm";
  icon?: IconName;
  children: ReactNode;
};

/** Figma "Radio Button": an icon tile. Figma gives MD a hover state and SM a pressed state. */
export function RadioButton({ size = "md", icon = "plus", previewState, className, children, ...rest }: RadioButtonProps) {
  return (
    <label
      data-state={previewState}
      className={cx(
        TILE,
        "gap-space-1 has-checked:border-primary-leather has-checked:bg-secondary-skin",
        size === "md"
          ? "w-24 border-transparent bg-secondary-skin px-space-2 py-space-3 ui-hover:not-has-checked:bg-secondary-ivory"
          : "size-space-15 justify-center border-black-alpha-20 bg-secondary-skin p-space-2 ui-pressed:not-has-checked:border-black-alpha-0 ui-pressed:not-has-checked:bg-secondary-ivory",
        className,
      )}
    >
      <HiddenInput {...rest} />
      <Icon name={icon} size={size === "md" ? 48 : 32} />
      <span className={size === "md" ? "type-overline-xs-medium" : "type-ui-2xs-medium"}>{children}</span>
    </label>
  );
}

type RadioImageButtonProps = BaseProps & {
  size?: "lg" | "md" | "sm";
  /** Image or other media for the tile. */
  media: ReactNode;
  children: ReactNode;
};

const IMAGE_SIZE = {
  lg: {
    box: "gap-0 border-transparent bg-secondary-skin p-space-3 ui-hover:not-has-checked:bg-secondary-ivory",
    media: "aspect-[4/3] w-full",
    text: "type-ui-sm-medium",
  },
  md: {
    box: "gap-space-1 border-transparent bg-secondary-skin px-space-2 py-space-3 ui-hover:not-has-checked:bg-secondary-ivory",
    media: "size-space-11",
    text: "type-overline-xs-medium",
  },
  sm: {
    box: "gap-space-1 border-transparent bg-secondary-ivory p-space-2 ui-pressed:not-has-checked:border-black-alpha-20",
    media: "size-space-10",
    text: "type-overline-2xs-medium",
  },
};

export function RadioImageButton({ size = "md", media, previewState, className, children, ...rest }: RadioImageButtonProps) {
  const spec = IMAGE_SIZE[size];

  return (
    <label
      data-state={previewState}
      className={cx(TILE, "group/radio has-checked:border-primary-leather has-checked:bg-secondary-skin", spec.box, className)}
    >
      <HiddenInput {...rest} />
      <span className={cx("relative block overflow-hidden", spec.media)}>
        {media}
        {size === "lg" ? (
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(closest-side,var(--color-white-alpha-0)_65%,var(--color-base-white)_100%)] group-has-checked/radio:hidden group-hover/radio:hidden group-data-[state=hover]/radio:hidden"
          />
        ) : null}
      </span>
      <span className={spec.text}>{children}</span>
    </label>
  );
}

type DiamondColorRadioProps = BaseProps & {
  /** Gemstone fill. This is product data, not a design token. */
  gemColor: string;
  children: ReactNode;
};

export function DiamondColorRadio({ gemColor, previewState, className, children, ...rest }: DiamondColorRadioProps) {
  return (
    <label
      data-state={previewState}
      className={cx(
        TILE,
        "w-22 gap-space-1 border-transparent bg-secondary-skin px-space-2 py-space-3 text-black-alpha-70 has-checked:border-primary-leather has-checked:text-primary-leather",
        className,
      )}
    >
      <HiddenInput {...rest} />
      <Icon name="gemstone-color" size={40} accentColor={gemColor} className="text-primary-leather" />
      <span className="type-ui-xs-regular">{children}</span>
    </label>
  );
}

export function RadioGroup({
  legend,
  hideLegend = false,
  className,
  children,
}: {
  legend: string;
  hideLegend?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className={className}>
      <legend className={hideLegend ? "sr-only" : "type-ui-sm-medium mb-space-3 text-primary-leather"}>{legend}</legend>
      {children}
    </fieldset>
  );
}
