import type { HTMLAttributes } from "react";
import { Icon, type IconName } from "./Icon";
import { cx } from "./shared";

type TagProps = HTMLAttributes<HTMLSpanElement> & {
  size?: "md" | "sm";
  color?: "primary" | "secondary";
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  /** Turns the trailing icon into a remove button. */
  onRemove?: () => void;
  removeLabel?: string;
};

export function Tag({
  size = "md",
  color = "primary",
  leadingIcon,
  trailingIcon,
  onRemove,
  removeLabel = "Remove",
  className,
  children,
  ...rest
}: TagProps) {
  const endIcon = trailingIcon ?? (onRemove ? "close" : undefined);

  return (
    <span
      className={cx(
        "type-ui-xs-regular inline-flex items-center gap-0.5 rounded-4 border text-primary-leather",
        size === "md" ? "min-h-space-8 px-space-3" : "min-h-space-6 px-space-2",
        color === "primary" ? "border-black-alpha-20 bg-secondary-skin" : "border-black-alpha-10 bg-secondary-ivory",
        className,
      )}
      {...rest}
    >
      {leadingIcon ? <Icon name={leadingIcon} size={16} /> : null}
      <span className="px-space-1">{children}</span>
      {endIcon && onRemove ? (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className="ui-transition-fast relative inline-flex cursor-pointer rounded-4 hover:text-black-alpha-50 after:absolute after:-inset-[5px]"
        >
          <Icon name={endIcon} size={14} />
        </button>
      ) : endIcon ? (
        <Icon name={endIcon} size={14} />
      ) : null}
    </span>
  );
}
