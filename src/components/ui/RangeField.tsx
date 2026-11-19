"use client";

import { NumberField } from "./NumberField";
import { RangeSlider, type RangeValue } from "./RangeSlider";
import { cx } from "./shared";

type RangeFieldProps = {
  /** What is being chosen, e.g. "price" or "carat weight": names the handles and inputs ("Minimum price"). */
  name: string;
  min: number;
  max: number;
  step: number;
  value: RangeValue;
  onChange: (value: RangeValue) => void;
  format?: (value: number) => string;
  /** Up/down steppers in the inputs, as on Figma's Carat inputs. */
  stepper?: boolean;
  className?: string;
};

/**
 * The slider with its two number inputs below, as in Figma's Price dropdown and the Filters sheet's
 * Carat and Price groups. Slider and inputs stay in sync, and the minimum never passes the maximum.
 */
export function RangeField({ name, min, max, step, value, onChange, format = String, stepper = false, className }: RangeFieldProps) {
  const labels: [string, string] = [`Minimum ${name}`, `Maximum ${name}`];
  return (
    <div className={cx("flex flex-col gap-space-2", className)}>
      <div className="py-space-2">
        <RangeSlider min={min} max={max} step={step} value={value} onChange={onChange} labels={labels} formatValue={format} />
      </div>
      <div className="flex items-center justify-between gap-space-4">
        <NumberField
          label={labels[0]}
          value={value[0]}
          min={min}
          max={value[1]}
          step={step}
          format={format}
          stepper={stepper}
          onChange={(next) => onChange([next, value[1]])}
        />
        <NumberField
          label={labels[1]}
          value={value[1]}
          min={value[0]}
          max={max}
          step={step}
          format={format}
          stepper={stepper}
          onChange={(next) => onChange([value[0], next])}
        />
      </div>
    </div>
  );
}
