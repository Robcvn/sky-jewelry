"use client";

import type { ReactNode } from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import { Icon } from "@/components/ui/Icon";
import { OptionTile } from "@/components/ui/OptionTile";
import { RangeField } from "@/components/ui/RangeField";
import { Swatch } from "@/components/ui/Swatch";
import { cx } from "@/components/ui/shared";
import { builderContent, CERTIFICATES, GEM_COLORS, GEM_TREATMENTS, type StoneKind } from "@/content/builder";
import { formatPrice } from "@/content/products";
import { GradeRange } from "./GradeRange";
import { scalesFor, stepOf, type GradeKey, type NumberKey, type Range, type StoneBounds, type StoneFilterState } from "./stoneFilters";

const copy = builderContent.stones;

export const GRADE_LABEL: Record<GradeKey, string> = {
  cut: copy.cut,
  color: copy.color,
  clarity: copy.clarity,
  polish: copy.polish,
  symmetry: copy.symmetry,
  fluor: copy.fluorescence,
};

export const NUMBER_LABEL: Record<NumberKey, string> = { carat: copy.carat, price: copy.price, table: copy.table, depth: copy.depth, ratio: copy.ratio };

export const NUMBER_FORMAT: Record<NumberKey, (value: number) => string> = {
  carat: (value) => value.toFixed(2),
  price: formatPrice,
  table: (value) => value.toFixed(1),
  depth: (value) => value.toFixed(1),
  ratio: (value) => value.toFixed(2),
};

const toggle = <T,>(items: T[], value: T) => (items.includes(value) ? items.filter((item) => item !== value) : [...items, value]);

/**
 * Figma "Input Label" over a filter: 10/20 overline, an optional value in regular ("COLOR: ALL COLORS") and an
 * optional question mark. On Cut, Color and Clarity the mark opens the Cut / Color / Clarity modal; Figma also draws
 * one on Carat, the gemstone Color and Certificate labels with nothing to open, and those are left out (Held for
 * review). The mark is leather, not Figma's gold, to keep a control's 3:1 contrast.
 */
export function StoneFilterLabel({ id, label, value, onHelp, helpLabel }: { id?: string; label: string; value?: string; onHelp?: () => void; helpLabel?: string }) {
  return (
    <p id={id} className="type-overline-xs-medium flex min-h-space-5 items-center gap-space-2 text-primary-leather">
      <span>
        {label}
        {value !== undefined ? ":" : ""}
      </span>
      {value !== undefined ? <span className="type-overline-xs-regular text-black-alpha-60">{value}</span> : null}
      {onHelp ? (
        <button type="button" aria-haspopup="dialog" aria-label={helpLabel ?? `About ${label.toLowerCase()}`} onClick={onHelp} className="relative inline-flex cursor-pointer rounded-full after:absolute after:-inset-1">
          <Icon name="question-mark" size={16} />
        </button>
      ) : null}
    </p>
  );
}

type FilterProps = { state: StoneFilterState; onChange: (patch: Partial<StoneFilterState>) => void };

/** A grade filter: its label, then the two-handle grade slider. `gap`: 8px on the desktop page, 4px in the sheet. */
export function GradeFilter({
  kind,
  gradeKey,
  state,
  onChange,
  onHelp,
  className,
}: FilterProps & { kind: StoneKind; gradeKey: GradeKey; onHelp?: () => void; className?: string }) {
  const scale = scalesFor(kind)[gradeKey];
  if (!scale) return null;
  const span = state.grades[gradeKey];
  const a = span ? scale.findIndex((item) => item.value === span[0]) : -1;
  const b = span ? scale.findIndex((item) => item.value === span[1]) : -1;
  const value: [number, number] = a >= 0 && b >= 0 ? [Math.min(a, b), Math.max(a, b)] : [0, scale.length - 1];
  const label = GRADE_LABEL[gradeKey];
  return (
    <div data-filter={gradeKey} className={cx("flex flex-col gap-space-1 ui-desktop:gap-space-2", className)}>
      <StoneFilterLabel label={label} onHelp={onHelp} />
      <GradeRange
        name={label.toLowerCase()}
        options={scale}
        value={value}
        onChange={([min, max]) => {
          const grades = { ...state.grades };
          if (min === 0 && max === scale.length - 1) delete grades[gradeKey];
          else grades[gradeKey] = [scale[min].value, scale[max].value];
          onChange({ grades });
        }}
      />
    </div>
  );
}

/**
 * A number range filter: label, slider and its two inputs. `compact`: the desktop page's 32px inputs (Figma
 * "Quantity Selector" 96 x 32); the sheet and the dropdown panels keep the 48px ones.
 */
export function NumberFilter({
  numberKey,
  bounds,
  state,
  onChange,
  compact = false,
  hideLabel = false,
}: FilterProps & { numberKey: NumberKey; bounds: StoneBounds; compact?: boolean; hideLabel?: boolean }) {
  const range = bounds[numberKey];
  const current = state.numbers[numberKey];
  const value: Range = current ? [Math.min(Math.max(current[0], range[0]), range[1]), Math.max(Math.min(current[1], range[1]), range[0])] : range;
  const label = NUMBER_LABEL[numberKey];
  return (
    <div data-filter={numberKey} className={cx("flex flex-col gap-space-1", compact && "ui-desktop:gap-space-2")}>
      {hideLabel ? null : <StoneFilterLabel label={label} />}
      <RangeField
        name={label.toLowerCase()}
        min={range[0]}
        max={range[1]}
        step={stepOf(numberKey)}
        value={value}
        onChange={(next) => {
          const numbers = { ...state.numbers };
          if (next[0] <= range[0] && next[1] >= range[1]) delete numbers[numberKey];
          else numbers[numberKey] = next;
          onChange({ numbers });
        }}
        format={NUMBER_FORMAT[numberKey]}
        stepper={numberKey === "carat"}
        // Desktop page: the slider keeps its full 20px slot and the inputs are 32px tall with a 20px stepper column.
        className={compact ? "ui-desktop:[&>div:first-child]:my-0 ui-desktop:[&>div:last-child>div]:h-space-8 ui-desktop:[&>div:last-child>div>span]:w-space-5" : undefined}
      />
    </div>
  );
}

/** Certificate tiles (GIA, AGS, IGI): any of. 56px tall on the desktop page, 48px in the sheet and the dropdown panel. */
export function CertificateTiles({ state, onChange, labelledBy, tall = false }: FilterProps & { labelledBy: string; tall?: boolean }) {
  return (
    <div role="group" aria-labelledby={labelledBy} className="flex gap-space-2">
      {CERTIFICATES.map((lab) => (
        <OptionTile key={lab} shape="text" checked={state.cert.includes(lab)} onChange={() => onChange({ cert: toggle(state.cert, lab) })} className={tall ? "ui-desktop:min-h-space-12" : undefined}>
          {lab}
        </OptionTile>
      ))}
    </div>
  );
}

/** Treatment checkboxes in two columns, read down each column as Figma's sheet (Filters / Gemstones 6659:107965). */
export function TreatmentChecks({ state, onChange, labelledBy }: FilterProps & { labelledBy: string }) {
  return (
    <div role="group" aria-labelledby={labelledBy} className="grid grid-flow-col grid-cols-2 grid-rows-4 gap-space-4">
      {GEM_TREATMENTS.map((item) => (
        <Checkbox key={item.value} label={item.label} checked={state.treatment.includes(item.value)} onChange={() => onChange({ treatment: toggle(state.treatment, item.value) })} />
      ))}
    </div>
  );
}

/** A 20px gemstone colour swatch, as in Figma's Color dropdown rows; 24px on the sheet's tiles. */
export function GemSwatch({ color, large = false }: { color: string; large?: boolean }) {
  return <Swatch color={GEM_COLORS.find((item) => item.value === color)?.swatch ?? "transparent"} className={large ? "size-space-6" : "size-space-5"} />;
}

/** The sheet's gemstone colour tiles (80 x 72, a swatch over the name): one colour, or none for all colours. */
export function GemColorTiles({ state, onChange, labelledBy }: FilterProps & { labelledBy: string }) {
  return (
    <div role="group" aria-labelledby={labelledBy} className="flex gap-space-2">
      {GEM_COLORS.map((color) => (
        <OptionTile
          key={color.value}
          media={
            <span className="flex size-space-8 items-center justify-center">
              <GemSwatch color={color.value} large />
            </span>
          }
          checked={state.gemColor === color.value}
          onChange={() => onChange({ gemColor: state.gemColor === color.value ? null : color.value })}
          className="h-18 w-20"
        >
          {color.label}
        </OptionTile>
      ))}
    </div>
  );
}

/** A panel body for the desktop advanced dropdowns: padding as the product list's Price panel. */
export function AdvancedPanel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("p-[calc(var(--spacing-space-4)-1px)]", className)}>{children}</div>;
}
