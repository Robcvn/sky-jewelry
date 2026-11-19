import type { InputHTMLAttributes } from "react";
import { Icon } from "./Icon";
import { cx } from "./shared";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & {
  label: string;
  className?: string;
};

/**
 * Figma "Checkbox Option" (SM), from the Filters sheet's Chain Length group: a 16px box with a 2px radius
 * and a black-alpha-50 border; checked fills leather with a white check. The label is ui-xs.
 */
export function Checkbox({ label, className, ...rest }: CheckboxProps) {
  return (
    <label className={cx("group/check inline-flex cursor-pointer items-center gap-space-2 text-primary-leather", className)}>
      <span className="relative inline-flex size-space-4 shrink-0">
        <input
          type="checkbox"
          className="peer ui-transition absolute inset-0 m-0 cursor-pointer appearance-none rounded-[2px] border border-black-alpha-50 bg-secondary-skin checked:border-primary-leather checked:bg-primary-leather hover:border-primary-leather focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-leather"
          {...rest}
        />
        <Icon name="checkmark-big" size={12} className="pointer-events-none absolute inset-0.5 hidden text-base-white peer-checked:block" />
      </span>
      <span className="type-ui-xs-regular">{label}</span>
    </label>
  );
}
