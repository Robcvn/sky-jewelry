"use client";

import { useId, useState } from "react";
import { FilterLabel, MetalTiles, PriceRange } from "@/components/plp/FilterControls";
import { Button } from "@/components/ui/Button";
import { DialogShell, dialogPanelMotion } from "@/components/ui/Modal";
import { OptionTile } from "@/components/ui/OptionTile";
import { ScrollArea } from "@/components/ui/Scrollbar";
import { builderContent, shapeLabel, SHEET_SETTING_STYLES, STONE_SHAPES, styleLabel, type SettingStyle } from "@/content/builder";
import { metalById, type MetalId } from "@/content/metals";
import { productListContent } from "@/content/product-list";
import { EMPTY_SETTING_FILTERS, type Range, type SettingFilterState } from "./settingFilters";

const { filters: copy } = productListContent;
const { settings: text } = builderContent;

type SettingFilterSheetProps = {
  open: boolean;
  onClose: () => void;
  state: SettingFilterState;
  priceBounds: Range;
  /** The styles that have settings: a sheet tile shows only for these. */
  styles: SettingStyle[];
  onApply: (next: SettingFilterState) => void;
  /**
   * The earrings builder's sheet has Metal and Price only (no shape or style to choose), and only its metals.
   * Stone first, the shape is the chosen stone's: `shapes` offers only it, and it can't be cleared.
   */
  sections?: { shape: boolean; style: boolean; metals?: MetalId[]; shapes?: string[] };
};

/**
 * Figma mobile "Filters / Setting" sheet (3587:126325, 390 x 693): the title, then Metal, Center Stone Shape and
 * Style as rows of 80px tiles that scroll sideways over the Figma scrollbar, then Price; an 80px footer with Clear
 * and Apply. The Style row has the frame's eight styles (no Natural), less any that have no settings: the Radio
 * Button has no disabled state in the Design System. Built like the product list's Filters sheet: choices are a draft until Apply, Clear empties the
 * draft, and Escape or a tap on the backdrop closes without applying.
 */
export function SettingFilterSheet({ open, onClose, state, priceBounds, styles, onApply, sections = { shape: true, style: true } }: SettingFilterSheetProps) {
  const id = useId();
  const [draft, setDraft] = useState(state);
  const [openedWith, setOpenedWith] = useState<SettingFilterState | null>(null);

  // Start each opening from the applied state.
  if (open && openedWith !== state) {
    setOpenedWith(state);
    setDraft(state);
  }
  if (!open && openedWith) setOpenedWith(null);

  const set = (patch: Partial<SettingFilterState>) => setDraft((current) => ({ ...current, ...patch }));
  const metalValue = draft.metals.length ? draft.metals.map((metal) => metalById(metal).label).join(", ") : copy.all;

  return (
    <DialogShell open={open} onClose={onClose} labelledBy={`${id}-title`}>
      {({ visible }) => (
        <div
          className={`flex max-h-[calc(100dvh-var(--spacing-space-4))] w-full max-w-[24.375rem] flex-col overflow-hidden rounded-8 bg-secondary-skin text-primary-leather shadow-lg ${dialogPanelMotion(visible)}`}
        >
          {/* 613px as drawn: 20 + the 26px title + 20 + the four groups (527) + 20. */}
          <div className="flex min-h-0 max-h-[38.3125rem] flex-col gap-space-4 overflow-y-auto overscroll-contain p-space-5">
            <h2 id={`${id}-title`} className="type-heading-sm mb-space-1">
              {copy.title}
            </h2>

            <section className="flex flex-col gap-space-3">
              <FilterLabel id={`${id}-metal`} label={copy.metal} value={metalValue} />
              <ScrollArea label={copy.metal} className="mb-space-2">
                <MetalTiles value={draft.metals} onChange={(metals) => set({ metals })} labelledBy={`${id}-metal`} metals={sections.metals} />
              </ScrollArea>
            </section>

            {sections.shape ? (
              <section className="flex flex-col gap-space-3">
                <FilterLabel id={`${id}-shape`} label={text.shapePanel} value={draft.shape ? shapeLabel(draft.shape) : copy.all} />
                <ScrollArea label={text.shapePanel} className="mb-space-2">
                  <div role="radiogroup" aria-labelledby={`${id}-shape`} className="flex gap-space-2">
                    {STONE_SHAPES.filter((shape) => !sections.shapes || sections.shapes.includes(shape.value)).map((shape) => (
                      <OptionTile
                        key={shape.value}
                        type="radio"
                        name={`${id}-shape`}
                        icon={shape.icon}
                        checked={draft.shape === shape.value}
                        onChange={() => set({ shape: shape.value })}
                        onClick={() => !sections.shapes && draft.shape === shape.value && set({ shape: null })}
                      >
                        {shape.label}
                      </OptionTile>
                    ))}
                  </div>
                </ScrollArea>
              </section>
            ) : null}

            {sections.style ? (
              <section className="flex flex-col gap-space-3">
                <FilterLabel id={`${id}-style`} label={text.style} value={draft.style ? styleLabel(draft.style) : copy.all} />
                <ScrollArea label={text.style} className="mb-space-2">
                  <div role="radiogroup" aria-labelledby={`${id}-style`} className="flex gap-space-2">
                    {SHEET_SETTING_STYLES.filter((style) => styles.includes(style.value)).map((style) => (
                      <OptionTile
                        key={style.value}
                        type="radio"
                        name={`${id}-style`}
                        icon={style.icon}
                        checked={draft.style === style.value}
                        onChange={() => set({ style: style.value })}
                        onClick={() => draft.style === style.value && set({ style: null })}
                      >
                        {style.label}
                      </OptionTile>
                    ))}
                  </div>
                </ScrollArea>
              </section>
            ) : null}

            <section className="flex flex-col gap-space-1">
              <FilterLabel label={copy.price} tall />
              <PriceRange bounds={priceBounds} value={draft.price} onChange={(price) => set({ price })} />
            </section>
          </div>

          {/* 80px as in Figma: its 1px top stroke sits inside the 20px padding. */}
          <div className="flex shrink-0 gap-space-2 border-t border-primary-leather px-space-5 pt-[1.1875rem] pb-space-5">
            <Button size="sm" variant="secondary" onClick={() => setDraft({ ...EMPTY_SETTING_FILTERS, sort: draft.sort, ships: draft.ships, start: draft.start })}>
              {copy.clear}
            </Button>
            <Button size="sm" className="flex-1" onClick={() => onApply({ ...draft, page: 1 })}>
              {copy.apply}
            </Button>
          </div>
        </div>
      )}
    </DialogShell>
  );
}
