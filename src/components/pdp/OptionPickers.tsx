"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cx } from "@/components/ui/shared";
import { metalBadge } from "@/components/plp/FilterControls";
import { Icon } from "@/components/ui/Icon";
import { OptionTile } from "@/components/ui/OptionTile";
import { metalById, type MetalId } from "@/content/metals";
import { productDetailContent } from "@/content/product-detail";
import { formatCarat } from "@/content/products";
import { useDragScroll } from "@/components/ui/useDragScroll";

const { labels } = productDetailContent;

/** Figma "Input Label": "CARAT WEIGHT:  1.00", the value in regular black-alpha-60. */
export function PickerLabel({ id, label, value, className }: { id: string; label: string; value: string; className?: string }) {
  return (
    <p id={id} className={cx("type-overline-xs-medium flex gap-space-2 text-primary-leather", className)}>
      {label}:<span className="type-overline-xs-regular text-black-alpha-60">{value}</span>
    </p>
  );
}

/**
 * Carat Weight: one tile per carat the selected metal comes in. Desktop tiles share the row (48px tall);
 * mobile tiles are 48 x 48 and scroll sideways, as Figma.
 */
export function CaratPicker({ carats, value, onChange }: { carats: number[]; value: number | null; onChange: (carat: number) => void }) {
  const id = useId();
  const rowRef = useDragScroll<HTMLDivElement>();
  return (
    <div className="flex flex-col gap-space-3">
      <PickerLabel id={`${id}-label`} label={labels.carat} value={value === null ? "" : formatCarat(value)} />
      <div ref={rowRef} role="radiogroup" aria-labelledby={`${id}-label`} className="relative -mx-(--grid-margin) flex gap-space-2 overflow-x-auto px-(--grid-margin) pb-space-1 [scrollbar-width:none] ui-desktop:mx-0 ui-desktop:flex-wrap ui-desktop:overflow-visible ui-desktop:px-0 [&::-webkit-scrollbar]:hidden">
        {carats.map((carat) => (
          <OptionTile
            key={carat}
            type="radio"
            shape="compact"
            name={`${id}-carat`}
            checked={value === carat}
            onChange={() => onChange(carat)}
            className="ui-desktop:h-space-11 ui-desktop:w-auto ui-desktop:min-w-space-11 ui-desktop:flex-1"
          >
            {formatCarat(carat)}
          </OptionTile>
        ))}
      </div>
    </div>
  );
}

/**
 * Desktop Metal ("Setting Options - Material" in Figma): a 5-column grid of metal tiles. With more than five
 * metals, four show with a More tile, which reveals the rest (and becomes Less).
 */
export function MetalPicker({ metals, value, onChange }: { metals: MetalId[]; value: MetalId; onChange: (metal: MetalId) => void }) {
  const id = useId();
  const [expanded, setExpanded] = useState(false);
  const collapsible = metals.length > 5;
  const shown = collapsible && !expanded ? metals.slice(0, 4) : metals;
  return (
    <div className="flex flex-col gap-space-3">
      <PickerLabel id={`${id}-label`} label={labels.metal} value={metalById(value).label} />
      <div className="grid grid-cols-5 gap-space-2">
        <div role="radiogroup" aria-labelledby={`${id}-label`} className="contents">
          {shown.map((metal) => (
            <OptionTile
              key={metal}
              type="radio"
              shape="fill"
              name={`${id}-metal`}
              media={metalBadge(metal)}
              aria-label={metalById(metal).label}
              checked={value === metal}
              onChange={() => onChange(metal)}
            >
              {metalById(metal).shortLabel}
            </OptionTile>
          ))}
        </div>
        {collapsible ? (
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((open) => !open)}
            className="ui-transition flex h-space-15 cursor-pointer flex-col items-center justify-center gap-space-1 rounded-4 border border-black-alpha-20 bg-secondary-skin text-primary-leather hover:border-black-alpha-50"
          >
            <span className="flex size-space-8 items-center justify-center rounded-full bg-black-alpha-5">
              <Icon name={expanded ? "minus" : "plus"} size={16} />
            </span>
            <span className="type-ui-2xs-medium">{expanded ? labels.less : labels.more}</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Mobile Metal (Figma "Product Card Options 2", 3570:105744): a "METAL >" tile showing the current metal, half
 * width as in Figma (where it pairs with the Stone tile; the catalogue has no stone option, see the report).
 * Opening it swaps in a back arrow and a row of metal tiles. With a single metal there is nothing to choose,
 * so the tile only shows it.
 */
export function MobileMetalPicker({ metals, value, onChange }: { metals: MetalId[]; value: MetalId; onChange: (metal: MetalId) => void }) {
  const id = useId();
  const rowRef = useDragScroll<HTMLDivElement>();
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  const metal = metalById(value);
  const choosable = metals.length > 1;
  const toggled = useRef(false);

  // Keep keyboard focus with the control the shopper used: Back after opening, the tile after closing.
  useEffect(() => {
    if (!toggled.current) return;
    toggled.current = false;
    (open ? back : opener).current?.focus();
  }, [open]);

  const summary = (
    <>
      <span className="type-overline-xs-medium flex items-center justify-center gap-space-1">
        {labels.metal}
        {choosable ? <Icon name="chevron-right" size={12} /> : null}
      </span>
      <span className="flex h-space-15 w-full flex-col items-center justify-center gap-space-1 rounded-4 border border-black-alpha-20 bg-secondary-skin p-space-2">
        {metalBadge(value)}
        <span className="type-ui-2xs-medium">{metal.shortLabel}</span>
      </span>
    </>
  );

  if (!open)
    return choosable ? (
      <button
        ref={opener}
        type="button"
        aria-expanded={false}
        onClick={() => {
          toggled.current = true;
          setOpen(true);
        }}
        className="flex w-[calc(50%-0.25rem)] cursor-pointer flex-col items-center gap-space-2 rounded-4 text-primary-leather"
      >
        {summary}
      </button>
    ) : (
      <div className="flex w-[calc(50%-0.25rem)] flex-col items-center gap-space-2 text-primary-leather">{summary}</div>
    );

  return (
    <div className="flex w-full flex-col gap-space-2 text-primary-leather">
      <div className="flex items-center gap-space-2">
        <button
          ref={back}
          type="button"
          aria-expanded
          onClick={() => {
            toggled.current = true;
            setOpen(false);
          }}
          className="inline-flex cursor-pointer items-center gap-space-1 rounded-4"
        >
          <Icon name="chevron-left" size={16} />
          <span className="sr-only">{labels.back}: </span>
        </button>
        <PickerLabel id={`${id}-label`} label={labels.metal} value={metal.label} />
      </div>
      <div ref={rowRef} role="radiogroup" aria-labelledby={`${id}-label`} className="relative flex gap-space-2 overflow-x-auto pb-space-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {metals.map((item) => (
          <OptionTile
            key={item}
            type="radio"
            name={`${id}-metal`}
            media={metalBadge(item)}
            aria-label={metalById(item).label}
            checked={value === item}
            onChange={() => onChange(item)}
          >
            {metalById(item).shortLabel}
          </OptionTile>
        ))}
      </div>
    </div>
  );
}
