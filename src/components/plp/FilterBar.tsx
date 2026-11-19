"use client";

import { useId } from "react";
import { Dropdown } from "@/components/ui/Dropdown";
import { TextButton } from "@/components/ui/TextButton";
import { productListContent } from "@/content/product-list";
import { CaratRange, DiamondTypeTiles, LengthChecks, MetalTiles, PanelBody, PriceRange } from "./FilterControls";
import { EMPTY_FILTERS, rangeActive, type Bounds, type FilterKey, type FilterState } from "./filters";

const { filters: copy, sortOptions } = productListContent;

type FilterBarProps = {
  state: FilterState;
  onChange: (next: FilterState) => void;
  filters: FilterKey[];
  bounds: Bounds;
  lengths: string[];
  lengthLabel: string;
  shipChoices: Array<{ value: string; label: string }>;
  activeCount: number;
};

/**
 * Desktop filter bar (Figma 3565:98087 / Price open 5958:57571): a gold rule, then Dropdown controls (SM,
 * sized to their text) for each filter, Clear Filters, and Ships by / Sort by on the right.
 * Only the Price panel is drawn open in Figma; the other panels reuse its look (a label, then the
 * Filters sheet's control for that group). Changes apply straight away. An active filter shows its count
 * and a clear button, as Figma's "Metal (1)".
 */
export function FilterBar({ state, onChange, filters, bounds, lengths, lengthLabel, shipChoices, activeCount }: FilterBarProps) {
  const id = useId();
  const set = (patch: Partial<FilterState>) => onChange({ ...state, ...patch, page: 1 });
  const counted = (label: string, count: number) => (count ? `${label} (${count})` : label);

  const caratOn = rangeActive(state.carat, bounds.carat);
  const priceOn = rangeActive(state.price, bounds.price);

  const panelProps = { size: "sm" as const, width: "auto" as const, panelTone: "leather" as const };

  return (
    <div className="hidden flex-col gap-space-6 border-t border-secondary-gold pt-space-6 ui-desktop:flex">
      <div className="flex items-center justify-between gap-space-4">
        <div className="flex flex-wrap items-center gap-2.5">
          {filters.includes("metal") ? (
            <Dropdown
              {...panelProps}
              label={copy.metal}
              displayValue={counted(copy.metal, state.metals.length)}
              clearable={state.metals.length > 0}
              onClear={() => set({ metals: [] })}
              panelWidth="w-80"
              panel={
                <PanelBody label={copy.metalPanel} id={`${id}-metal`}>
                  <div className="pt-space-2">
                    <MetalTiles value={state.metals} onChange={(metals) => set({ metals })} labelledBy={`${id}-metal`} wrap />
                  </div>
                </PanelBody>
              }
            />
          ) : null}
          {filters.includes("diamond") ? (
            <Dropdown
              {...panelProps}
              label={copy.diamondType}
              displayValue={counted(copy.diamondType, state.diamond.length)}
              clearable={state.diamond.length > 0}
              onClear={() => set({ diamond: [] })}
              panelWidth="w-80"
              panel={
                <PanelBody label={copy.diamondType} id={`${id}-diamond`}>
                  <div className="pt-space-2">
                    <DiamondTypeTiles value={state.diamond} onChange={(diamond) => set({ diamond })} labelledBy={`${id}-diamond`} />
                  </div>
                </PanelBody>
              }
            />
          ) : null}
          {filters.includes("carat") && bounds.carat ? (
            <Dropdown
              {...panelProps}
              label={copy.carat}
              displayValue={counted(copy.carat, caratOn ? 1 : 0)}
              clearable={caratOn}
              onClear={() => set({ carat: null })}
              panelWidth="w-80"
              panel={
                <PanelBody label={copy.carat} id={`${id}-carat`}>
                  <CaratRange bounds={bounds.carat} value={state.carat} onChange={(carat) => set({ carat })} />
                </PanelBody>
              }
            />
          ) : null}
          {filters.includes("length") && lengths.length ? (
            <Dropdown
              {...panelProps}
              label={copy.length}
              displayValue={counted(copy.length, state.length.length)}
              clearable={state.length.length > 0}
              onClear={() => set({ length: [] })}
              panelWidth="w-80"
              panel={
                <PanelBody label={lengthLabel} id={`${id}-length`}>
                  <div className="pt-space-2">
                    <LengthChecks options={lengths} value={state.length} onChange={(length) => set({ length })} labelledBy={`${id}-length`} />
                  </div>
                </PanelBody>
              }
            />
          ) : null}
          {filters.includes("price") ? (
            <Dropdown
              {...panelProps}
              label={copy.price}
              displayValue={counted(copy.price, priceOn ? 1 : 0)}
              clearable={priceOn}
              onClear={() => set({ price: null })}
              panelWidth="w-80"
              panel={
                <PanelBody label={copy.price} id={`${id}-price`}>
                  <PriceRange bounds={bounds.price} value={state.price} onChange={(price) => set({ price })} />
                </PanelBody>
              }
            />
          ) : null}
          {activeCount ? (
            <TextButton
              variant="caps"
              size="sm"
              leadingIcon="close"
              className="ml-3.5"
              onClick={() => onChange({ ...EMPTY_FILTERS, sort: state.sort })}
            >
              {copy.clearFilters}
            </TextButton>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-space-4">
          <Dropdown
            size="sm"
            width="auto"
            label={copy.shipsBy}
            valuePrefix={copy.shipsBy}
            options={shipChoices}
            value={state.ships ? String(state.ships) : ""}
            onChange={(value) => set({ ships: value ? Number(value) : null })}
            panelWidth="w-full min-w-44"
            panelAlign="end"
          />
          <Dropdown
            size="sm"
            width="auto"
            label={copy.sortBy}
            valuePrefix={copy.sortBy}
            options={sortOptions.map(({ value, label }) => ({ value, label }))}
            value={state.sort}
            onChange={(sort) => onChange({ ...state, sort, page: 1 })}
            panelWidth="w-full min-w-48"
            panelAlign="end"
          />
        </div>
      </div>
    </div>
  );
}
