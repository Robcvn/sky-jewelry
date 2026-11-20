"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { DialogShell, dialogPanelMotion } from "@/components/ui/Modal";
import { OptionTile } from "@/components/ui/OptionTile";
import { ScrollArea } from "@/components/ui/Scrollbar";
import { metalById } from "@/content/metals";
import { productListContent } from "@/content/product-list";
import type { FineJewelryCategory } from "@/content/products";
import { CaratRange, DiamondTypeTiles, FilterLabel, LengthChecks, MetalTiles, PriceRange } from "./FilterControls";
import { EMPTY_FILTERS, type Bounds, type FilterKey, type FilterState } from "./filters";

const { filters: copy, categories } = productListContent;

type FilterSheetProps = {
  open: boolean;
  onClose: () => void;
  /** null on the all-categories list: no category tile is selected until one is chosen. */
  category: FineJewelryCategory | null;
  state: FilterState;
  /** Called with the new state and category when the shopper presses Apply. */
  onApply: (next: FilterState, category: FineJewelryCategory | null) => void;
  filters: FilterKey[];
  bounds: Bounds;
  lengths: string[];
  lengthLabel: string;
};

/**
 * Figma mobile Filters sheet (5746:89744; as first opened 3587:126927; short 3587:127002): title, the groups
 * (Category, Metal, Diamond Type, Carat, Length, Price) in a body that scrolls within 600px, and an 80px footer with
 * Clear and Apply that stays put: 680px in all, as the first-open frame 3587:126927 draws it. A shorter body shrinks
 * the sheet to fit (3587:127002); on screens too short for 680px the sheet is capped to the screen. (5746:89744
 * draws the sheet expanded to 950px; how it gets there is an open question.) Choices are a draft until Apply. Clear empties the draft (Apply then shows everything).
 * Figma draws no close button: Escape and a tap on the backdrop close it without applying (flagged).
 */
export function FilterSheet({ open, onClose, category, state, onApply, filters, bounds, lengths, lengthLabel }: FilterSheetProps) {
  const id = useId();
  const [draft, setDraft] = useState(state);
  const [draftCategory, setDraftCategory] = useState<FineJewelryCategory | null>(category);
  const [openedWith, setOpenedWith] = useState<FilterState | null>(null);

  // Start each opening from the applied state.
  if (open && openedWith !== state) {
    setOpenedWith(state);
    setDraft(state);
    setDraftCategory(category);
  }
  if (!open && openedWith) setOpenedWith(null);

  const set = (patch: Partial<FilterState>) => setDraft((current) => ({ ...current, ...patch }));
  const sameCategory = draftCategory === category;
  const show = (key: FilterKey) => sameCategory && filters.includes(key);
  const metalValue = draft.metals.length ? draft.metals.map((metal) => metalById(metal).label).join(", ") : copy.all;
  const diamondValue = draft.diamond.length
    ? copy.diamondTypes.filter((option) => draft.diamond.includes(option.value as never)).map((option) => option.label).join(", ")
    : copy.all;

  return (
    <DialogShell open={open} onClose={onClose} labelledBy={`${id}-title`}>
      {({ visible }) => (
        <div
          className={`flex max-h-[calc(100dvh-var(--spacing-space-4))] w-full max-w-[24.375rem] flex-col overflow-hidden rounded-8 bg-secondary-skin text-primary-leather shadow-lg ${dialogPanelMotion(visible)}`}
        >
          <div className="flex min-h-0 max-h-150 flex-col gap-space-6 overflow-y-auto overscroll-contain p-space-5">
            <h2 id={`${id}-title`} className="type-heading-sm">
              {copy.title}
            </h2>

            <section className="flex flex-col gap-space-3">
              <FilterLabel id={`${id}-category`} label={copy.category} value={categories.find((item) => item._key === draftCategory)?.label ?? copy.all} />
              {/* Four tiles that share the row: 80px at 390 as Figma, narrower on smaller phones instead of overflowing. */}
              <div role="radiogroup" aria-labelledby={`${id}-category`} className="grid grid-cols-4 gap-space-2">
                {categories.map((item) => (
                  <OptionTile
                    key={item._key}
                    type="radio"
                    shape="fill"
                    name={`${id}-category`}
                    icon={item.icon}
                    checked={draftCategory === item._key}
                    onChange={() => setDraftCategory(item._key)}
                  >
                    {item.label}
                  </OptionTile>
                ))}
              </div>
              {!sameCategory ? <p className="type-ui-xs-regular text-black-alpha-60">Apply to see {categories.find((item) => item._key === draftCategory)?.label.toLowerCase()}. Metal and diamond type carry over.</p> : null}
            </section>

            {filters.includes("metal") ? (
              <section className="flex flex-col gap-space-3">
                <FilterLabel id={`${id}-metal`} label={copy.metal} value={metalValue} />
                {/* Figma leaves 32px from the indicator to the next group (24 between the other groups). */}
                <ScrollArea label={copy.metal} className="mb-space-2">
                  <MetalTiles value={draft.metals} onChange={(metals) => set({ metals })} labelledBy={`${id}-metal`} />
                </ScrollArea>
              </section>
            ) : null}

            {filters.includes("diamond") ? (
              <section className="flex flex-col gap-space-3">
                <FilterLabel id={`${id}-diamond`} label={copy.diamondType} value={diamondValue} help={copy.diamondTypeHelp} />
                <DiamondTypeTiles value={draft.diamond} onChange={(diamond) => set({ diamond })} labelledBy={`${id}-diamond`} />
              </section>
            ) : null}

            {show("carat") && bounds.carat ? (
              <section className="flex flex-col gap-space-1">
                <FilterLabel label={copy.caratShort} help={copy.caratHelp} tall />
                <CaratRange bounds={bounds.carat} value={draft.carat} onChange={(carat) => set({ carat })} />
              </section>
            ) : null}

            {show("length") && lengths.length ? (
              <section className="flex flex-col gap-space-3">
                <FilterLabel id={`${id}-length`} label={lengthLabel} />
                <LengthChecks options={lengths} value={draft.length} onChange={(length) => set({ length })} labelledBy={`${id}-length`} fixed />
              </section>
            ) : null}

            {show("price") ? (
              <section className="flex flex-col gap-space-1">
                <FilterLabel label={copy.price} tall />
                <PriceRange bounds={bounds.price} value={draft.price} onChange={(price) => set({ price })} />
              </section>
            ) : null}
          </div>

          {/* 80px as in Figma: its 1px top stroke sits inside the 20px padding. */}
          <div className="flex shrink-0 gap-space-2 border-t border-primary-leather px-space-5 pt-[1.1875rem] pb-space-5">
            <Button size="sm" variant="secondary" onClick={() => setDraft({ ...EMPTY_FILTERS, sort: draft.sort, ships: draft.ships })}>
              {copy.clear}
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => {
                const next = sameCategory
                  ? { ...draft, page: 1 }
                  : { ...EMPTY_FILTERS, metals: draft.metals, diamond: draft.diamond, ships: draft.ships, sort: draft.sort };
                onApply(next, draftCategory);
              }}
            >
              {copy.apply}
            </Button>
          </div>
        </div>
      )}
    </DialogShell>
  );
}
