"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { DialogShell, dialogPanelMotion } from "@/components/ui/Modal";
import { OptionTile } from "@/components/ui/OptionTile";
import { ScrollArea } from "@/components/ui/Scrollbar";
import { builderContent, GEM_COLORS, shapeLabel, STONE_SHAPES, type StoneKind } from "@/content/builder";
import { productListContent } from "@/content/product-list";
import type { CccTab } from "./CccModal";
import { CertificateTiles, GemColorTiles, GradeFilter, NumberFilter, StoneFilterLabel, TreatmentChecks } from "./StoneFilterControls";
import { EMPTY_STONE_FILTERS, type StoneBounds, type StoneFilterState } from "./stoneFilters";

const copy = builderContent.stones;
const { filters: listCopy } = productListContent;

type StoneFilterSheetProps = {
  open: boolean;
  onClose: () => void;
  kind: StoneKind;
  state: StoneFilterState;
  bounds: StoneBounds;
  /** Called with the new state when the shopper presses Apply. */
  onApply: (next: StoneFilterState) => void;
  /** Opens the Cut / Color / Clarity modal on a tab. */
  onHelp: (tab: CccTab) => void;
};

/**
 * Figma mobile Filters sheet for stones (Filters / Stone 3587:126389, 680 = a 600px body that scrolls + the 80px
 * Clear / Apply bar; Expanded 3587:126483 with Advanced Filters open; Filters / Gemstones 6659:107965).
 * Diamonds: Shape, Cut, Color, Clarity, Carat, Price, Polish; Advanced Filters: Symmetry, Fluorescence, Table,
 * Depth, L/W Ratio. Gemstones: Shape, Color, Cut, Clarity, Carat, Price; Advanced Filters: Treatment, L/W Ratio,
 * Certificate. Choices are a draft until Apply, as on the product list's sheet; Escape and the backdrop close it
 * without applying. The Expanded frame draws Polish twice (after Price and again last): built once, after Price.
 */
export function StoneFilterSheet({ open, onClose, kind, state, bounds, onApply, onHelp }: StoneFilterSheetProps) {
  const id = useId();
  const [draft, setDraft] = useState(state);
  const [openedWith, setOpenedWith] = useState<string | null>(null);
  const [advanced, setAdvanced] = useState(false);

  // Start each opening from the applied state. Compared by value: the listing parses the URL on every render, so
  // the state object is new each time (for example when the Cut / Color / Clarity modal opens over the sheet).
  const applied = JSON.stringify(state);
  if (open && openedWith !== applied) {
    setOpenedWith(applied);
    setDraft(state);
  }
  if (!open && openedWith) setOpenedWith(null);

  const set = (patch: Partial<StoneFilterState>) => setDraft((current) => ({ ...current, ...patch }));
  const gem = kind === "gemstone";
  const filter = { state: draft, onChange: set };

  return (
    <DialogShell open={open} onClose={onClose} labelledBy={`${id}-title`}>
      {({ visible }) => (
        <div
          data-stone-filter-sheet=""
          className={`flex max-h-[calc(100dvh-var(--spacing-space-4))] w-full max-w-[24.375rem] flex-col overflow-hidden rounded-8 bg-secondary-skin text-primary-leather shadow-lg ${dialogPanelMotion(visible)}`}
        >
          <div className="flex max-h-150 min-h-0 flex-col overflow-x-clip overflow-y-auto overscroll-contain">
            <div className="flex flex-col gap-space-5 p-space-5">
              <h2 id={`${id}-title`} className="type-heading-sm">
                {listCopy.title}
              </h2>

              <section className="flex flex-col gap-space-3 pb-space-2">
                <StoneFilterLabel id={`${id}-shape`} label={copy.shape} value={draft.shape ? shapeLabel(draft.shape) : listCopy.all} />
                <ScrollArea label={copy.shape} scrollbarClassName="mt-space-4">
                  <div role="radiogroup" aria-labelledby={`${id}-shape`} className="flex gap-space-2">
                    {STONE_SHAPES.map((shape) => (
                      <OptionTile
                        key={shape.value}
                        type="radio"
                        name={`${id}-shape`}
                        media={<Icon name={shape.icon} size={40} />}
                        checked={draft.shape === shape.value}
                        onChange={() => set({ shape: shape.value })}
                        // A second tap on the chosen shape clears it (a radio can't be unchecked otherwise).
                        onClick={() => draft.shape === shape.value && set({ shape: null })}
                      >
                        <span className="type-overline-2xs-medium block">{shape.label}</span>
                      </OptionTile>
                    ))}
                  </div>
                </ScrollArea>
              </section>

              {gem ? (
                <section className="flex flex-col gap-space-3 pb-space-2">
                  <StoneFilterLabel id={`${id}-gemcolor`} label={copy.color} value={GEM_COLORS.find((color) => color.value === draft.gemColor)?.label ?? copy.allColors} />
                  <ScrollArea label={copy.color} scrollbarClassName="mt-space-4">
                    <GemColorTiles {...filter} labelledBy={`${id}-gemcolor`} />
                  </ScrollArea>
                </section>
              ) : null}

              <GradeFilter kind={kind} gradeKey="cut" {...filter} onHelp={gem ? undefined : () => onHelp("cut")} className="gap-space-1!" />
              {gem ? null : <GradeFilter kind={kind} gradeKey="color" {...filter} onHelp={() => onHelp("color")} className="gap-space-1!" />}
              <GradeFilter kind={kind} gradeKey="clarity" {...filter} onHelp={gem ? undefined : () => onHelp("clarity")} className="gap-space-1!" />
              <NumberFilter numberKey="carat" bounds={bounds} {...filter} />
              <NumberFilter numberKey="price" bounds={bounds} {...filter} />
              {gem ? null : <GradeFilter kind={kind} gradeKey="polish" {...filter} className="gap-space-1!" />}
            </div>

            <div className="flex flex-col gap-space-5 border-t border-primary-leather p-space-5">
              <h3>
                <button type="button" aria-expanded={advanced} aria-controls={`${id}-advanced`} onClick={() => setAdvanced((current) => !current)} className="flex w-full cursor-pointer items-center gap-space-4 rounded-4 text-left">
                  <span className="type-heading-sm flex-1">{copy.advanced}</span>
                  <Icon name={advanced ? "chevron-up" : "chevron-down"} size={24} />
                </button>
              </h3>
              <div id={`${id}-advanced`} hidden={!advanced} className="flex flex-col gap-space-5">
                {gem ? (
                  <>
                    <section className="flex flex-col gap-space-3">
                      <StoneFilterLabel id={`${id}-treatment`} label={copy.treatment} />
                      <TreatmentChecks {...filter} labelledBy={`${id}-treatment`} />
                    </section>
                    <NumberFilter numberKey="ratio" bounds={bounds} {...filter} />
                    <section className="flex flex-col gap-space-3">
                      <StoneFilterLabel id={`${id}-cert`} label={copy.certificate} value={draft.cert.length ? draft.cert.join(", ") : listCopy.all} />
                      <CertificateTiles {...filter} labelledBy={`${id}-cert`} />
                    </section>
                  </>
                ) : (
                  <>
                    <GradeFilter kind={kind} gradeKey="symmetry" {...filter} className="gap-space-1!" />
                    <GradeFilter kind={kind} gradeKey="fluor" {...filter} className="gap-space-1!" />
                    <NumberFilter numberKey="table" bounds={bounds} {...filter} />
                    <NumberFilter numberKey="depth" bounds={bounds} {...filter} />
                    <NumberFilter numberKey="ratio" bounds={bounds} {...filter} />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 80px as in Figma: its 1px top stroke sits inside the 20px padding. */}
          <div className="flex shrink-0 gap-space-2 border-t border-primary-leather px-space-5 pt-[1.1875rem] pb-space-5">
            <Button size="sm" variant="secondary" onClick={() => setDraft({ ...EMPTY_STONE_FILTERS, origin: draft.origin, sort: draft.sort, ships: draft.ships })}>
              {listCopy.clear}
            </Button>
            <Button size="sm" className="flex-1" onClick={() => onApply({ ...draft, page: 1 })}>
              {listCopy.apply}
            </Button>
          </div>
        </div>
      )}
    </DialogShell>
  );
}
