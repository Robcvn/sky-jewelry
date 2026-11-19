"use client";

import { useId, useState, type ReactNode } from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import { Icon } from "@/components/ui/Icon";
import { OptionTile } from "@/components/ui/OptionTile";
import { RangeField } from "@/components/ui/RangeField";
import { withBasePath } from "@/components/ui/shared";
import type { DiamondType } from "@/content/catalog-seed";
import { METALS, type MetalId } from "@/content/metals";
import { productListContent } from "@/content/product-list";
import { formatPrice } from "@/content/products";
import { lengthLabel, type Range } from "./filters";

const { filters: copy } = productListContent;

const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);

/** The Filters sheet's group label: "METAL:  14K YELLOW GOLD", with an optional help toggletip. */
export function FilterLabel({ label, value, help, id }: { label: string; value?: string; help?: string; id?: string }) {
  const [open, setOpen] = useState(false);
  const helpId = useId();
  return (
    <div className="flex flex-col gap-space-2">
      <p id={id} className="type-overline-xs-medium flex flex-wrap items-center gap-x-space-2 text-primary-leather">
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

export const metalBadge = (id: MetalId) => (
  // eslint-disable-next-line @next/next/no-img-element -- a static SVG badge exported from Figma
  <img src={withBasePath(`/images/metals/${id}.svg`)} alt="" width={32} height={32} className="size-space-8" />
);

/** The seven metal tiles (Figma "Metal - 14k White Gold" ...), multi-select. */
export function MetalTiles({ value, onChange, labelledBy, wrap = false }: { value: MetalId[]; onChange: (value: MetalId[]) => void; labelledBy: string; wrap?: boolean }) {
  return (
    <div role="group" aria-labelledby={labelledBy} className={wrap ? "grid grid-cols-3 gap-space-2" : "flex gap-space-2"}>
      {METALS.map((metal) => (
        <OptionTile
          key={metal.id}
          media={metalBadge(metal.id)}
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

export function LengthChecks({ options, value, onChange, labelledBy }: { options: string[]; value: string[]; onChange: (value: string[]) => void; labelledBy: string }) {
  return (
    <div role="group" aria-labelledby={labelledBy} className="grid grid-cols-2 gap-space-4">
      {options.map((length) => (
        <Checkbox key={length} label={lengthLabel(length)} checked={value.includes(length)} onChange={() => onChange(toggle(value, length))} />
      ))}
    </div>
  );
}

export const formatCaratValue = (value: number) => value.toFixed(2);

export function CaratRange({ bounds, value, onChange }: { bounds: Range; value: Range | null; onChange: (value: Range) => void }) {
  return (
    <RangeField name="carat weight" min={bounds[0]} max={bounds[1]} step={0.05} value={value ?? bounds} onChange={onChange} format={formatCaratValue} stepper />
  );
}

export function PriceRange({ bounds, value, onChange }: { bounds: Range; value: Range | null; onChange: (value: Range) => void }) {
  return <RangeField name="price" min={bounds[0]} max={bounds[1]} step={100} value={value ?? bounds} onChange={onChange} format={formatPrice} />;
}

/** The desktop dropdown panel body, styled as Figma's open Price panel: a label, then the control. */
export function PanelBody({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-space-1 p-space-4">
      <p id={id} className="type-overline-xs-medium leading-5 text-primary-leather">
        {label}
      </p>
      {children}
    </div>
  );
}
