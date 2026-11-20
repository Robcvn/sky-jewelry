"use client";

import { useId, useState, type ReactNode } from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import { Icon } from "@/components/ui/Icon";
import { MetalBadge } from "@/components/ui/MetalBadge";
import { OptionTile } from "@/components/ui/OptionTile";
import { RangeField } from "@/components/ui/RangeField";
import type { DiamondType } from "@/content/catalog-seed";
import { METALS, type MetalId } from "@/content/metals";
import { productListContent } from "@/content/product-list";
import { formatPrice } from "@/content/products";
import { lengthLabel, type Range } from "./filters";

const { filters: copy } = productListContent;

const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);

/**
 * The Filters sheet's group label: "METAL:  14K YELLOW GOLD", with an optional help toggletip. `tall`: the 20px
 * label row Figma gives the Carat and Price groups (10/20), 4px above their slider; the other labels are 14px.
 */
export function FilterLabel({ label, value, help, id, tall = false }: { label: string; value?: string; help?: string; id?: string; tall?: boolean }) {
  const [open, setOpen] = useState(false);
  const helpId = useId();
  return (
    <div className="flex flex-col gap-space-2">
      <p id={id} className={`type-overline-xs-medium flex flex-wrap items-center gap-x-space-2 text-primary-leather ${tall ? "min-h-space-5" : ""}`}>
        <span>
          {label}
          {value !== undefined ? ":" : ""}
        </span>
        {value !== undefined ? <span className="type-overline-xs-regular text-black-alpha-60">{value}</span> : null}
        {help ? (
          <button
            type="button"
            aria-label={`About ${label.toLowerCase()}`}
            aria-expanded={open}
            aria-controls={helpId}
            onClick={() => setOpen((current) => !current)}
            className="relative inline-flex cursor-pointer rounded-full after:absolute after:-inset-1"
          >
            <Icon name="question-mark" size={16} />
          </button>
        ) : null}
      </p>
      {help ? (
        <p id={helpId} hidden={!open} className="type-ui-xs-regular text-black-alpha-60">
          {help}
        </p>
      ) : null}
    </div>
  );
}

export const metalBadge = (id: MetalId) => <MetalBadge metal={id} />;

/**
 * The seven metal tiles (Figma "Metal - 14k White Gold" ...), multi-select. Badge position as Figma's Filters sheet
 * frames and its desktop Metal panel (Dropdown page, 4055:55935) draw it: 15px from the top on the two Yellow Gold
 * tiles, 8px on the other five, selected or not (an open question). The label is at 51px on every tile.
 */
export function MetalTiles({ value, onChange, labelledBy, wrap = false }: { value: MetalId[]; onChange: (value: MetalId[]) => void; labelledBy: string; wrap?: boolean }) {
  return (
    <div role="group" aria-labelledby={labelledBy} className={wrap ? "grid grid-cols-3 gap-space-2" : "flex gap-space-2"}>
      {METALS.map((metal) => (
        <OptionTile
          key={metal.id}
          media={metalBadge(metal.id)}
          mediaPosition={metal.family === "yellow-gold" ? "center" : "top"}
          aria-label={metal.label}
          checked={value.includes(metal.id)}
          onChange={() => onChange(toggle(value, metal.id))}
          className={wrap ? "w-full" : undefined}
        >
          {metal.shortLabel}
        </OptionTile>
      ))}
    </div>
  );
}

export function DiamondTypeTiles({ value, onChange, labelledBy }: { value: DiamondType[]; onChange: (value: DiamondType[]) => void; labelledBy: string }) {
  return (
    <div role="group" aria-labelledby={labelledBy} className="flex gap-space-2">
      {copy.diamondTypes.map((option) => (
        <OptionTile
          key={option.value}
          shape="text"
          checked={value.includes(option.value as DiamondType)}
          onChange={() => onChange(toggle(value, option.value as DiamondType))}
        >
          {option.label}
        </OptionTile>
      ))}
    </div>
  );
}

/**
 * Chain length checkboxes in two columns. The mobile sheet (Figma 5746:89744) draws two 147px columns with a 16px
 * gap, leaving the right of the row free; `fixed` builds that. Without it the columns share the width (the
 * desktop dropdown, which Figma doesn't draw).
 */
export function LengthChecks({
  options,
  value,
  onChange,
  labelledBy,
  fixed = false,
}: {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  labelledBy: string;
  fixed?: boolean;
}) {
  return (
    <div role="group" aria-labelledby={labelledBy} className={`grid gap-space-4 ${fixed ? "grid-cols-[repeat(2,minmax(0,9.1875rem))]" : "grid-cols-2"}`}>
      {options.map((length) => (
        <Checkbox key={length} label={lengthLabel(length)} checked={value.includes(length)} onChange={() => onChange(toggle(value, length))} />
      ))}
    </div>
  );
}

export const formatCaratValue = (value: number) => value.toFixed(2);

/** A range from the URL can reach past the slider (e.g. "Under $1,000" is 0-1000 while prices start at $500): show it clamped. */
const clampTo = (value: Range | null, bounds: Range): Range =>
  value ? [Math.min(Math.max(value[0], bounds[0]), bounds[1]), Math.max(Math.min(value[1], bounds[1]), bounds[0])] : bounds;

export function CaratRange({ bounds, value, onChange }: { bounds: Range; value: Range | null; onChange: (value: Range) => void }) {
  return (
    <RangeField name="carat weight" min={bounds[0]} max={bounds[1]} step={0.05} value={clampTo(value, bounds)} onChange={onChange} format={formatCaratValue} stepper />
  );
}

export function PriceRange({ bounds, value, onChange }: { bounds: Range; value: Range | null; onChange: (value: Range) => void }) {
  return <RangeField name="price" min={bounds[0]} max={bounds[1]} step={100} value={clampTo(value, bounds)} onChange={onChange} format={formatPrice} />;
}

/**
 * The desktop dropdown panel body, styled as Figma's open Price panel: a label, then the control. Figma's panel
 * ("Dropdown Menu" 5958:58666, 320 x 130) draws its 1px border inside its edge and pads 16px from that edge, so the
 * padding here is 16px less the border: the Price panel is 130px tall outside, border included.
 */
export function PanelBody({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-space-1 p-[calc(var(--spacing-space-4)-1px)]">
      <p id={id} className="type-overline-xs-medium leading-5 text-primary-leather">
        {label}
      </p>
      {children}
    </div>
  );
}
