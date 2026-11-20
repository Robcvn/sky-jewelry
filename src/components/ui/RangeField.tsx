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
 * Figma: the slider frame is 18px (8px above and below the 2px track; the 20px handles overhang it by 1px),
 * then 8px, then the 48px inputs. The label above sits 4px over the slider frame (set by the caller).
 */
export function RangeField({ name, min, max, step, value, onChange, format = String, stepper = false, className }: RangeFieldProps) {
  const labels: [string, string] = [`Minimum ${name}`, `Maximum ${name}`];
  return (
    <div className={cx("flex flex-col gap-space-2", className)}>
      {/* The 20px slider in an 18px slot: Figma's handles overhang the slider frame by 1px above and below. */}
      <div className="-my-px">
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
