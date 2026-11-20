import type { InputHTMLAttributes } from "react";
import { Icon } from "./Icon";
import { cx } from "./shared";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & {
  label: string;
  /** "sm": 16px box, ui-xs label (the Filters sheet). "md": 20px box, ui-sm label (Modal / Add Address). */
  size?: "sm" | "md";
  className?: string;
};

/**
 * Figma "Checkbox Option" (Design System 337:4884): SM from the Filters sheet's Chain Length group, a 16px box;
 * MD from Modal / Add Address, a 20px box with an 18px check. Both have a 2px radius and a black-alpha-50 border;
 * checked fills leather with a white check.
 */
export function Checkbox({ label, size = "sm", className, ...rest }: CheckboxProps) {
  const md = size === "md";
  return (
    <label className={cx("group/check inline-flex cursor-pointer items-center gap-space-2 text-primary-leather", className)}>
      <span className={cx("relative inline-flex shrink-0", md ? "size-space-5" : "size-space-4")}>
        <input
          type="checkbox"
          className="peer ui-transition absolute inset-0 m-0 cursor-pointer appearance-none rounded-[2px] border border-black-alpha-50 bg-secondary-skin checked:border-primary-leather checked:bg-primary-leather hover:border-primary-leather focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-leather"
          {...rest}
        />
        <Icon
          name="checkmark-big"
          size={md ? 18 : 12}
          className={cx("pointer-events-none absolute hidden text-base-white peer-checked:block", md ? "inset-px" : "inset-0.5")}
        />
      </span>
      <span className={md ? "type-ui-sm-regular" : "type-ui-xs-regular"}>{label}</span>
    </label>
  );
}
