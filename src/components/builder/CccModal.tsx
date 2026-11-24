"use client";

import { useId, useState, type CSSProperties } from "react";
import { DialogShell, dialogPanelMotion } from "@/components/ui/Modal";
import { Tabs } from "@/components/ui/Tabs";
import { cx, withBasePath } from "@/components/ui/shared";
import { builderContent, DIAMOND_SCALES, type Option } from "@/content/builder";
import { CLARITY_GRADES, COLOR_GRADES, CUT_GRADES, type GradeCopy } from "@/content/builder-grades";
import { gradeScales } from "@/content/product-detail";

export type CccTab = "cut" | "color" | "clarity";

const copy = builderContent.stones;

/**
 * Each tab: its scale, the grade Figma draws selected, what each grade means, and the drawing with its height as a
 * percentage of the 16:9 frame. Cut is the modal's own drawing (the diamond with its light arrows, 200 x 138 in the
 * 234px frame, exported from 3565:101513). Color and Clarity reuse the Product Detail drawings (those files carry
 * their own margins, hence the larger percentages for the same drawn size); the modal's Clarity
 * drawing differs from that one (its loupe overlaps the stone) and is still to be exported.
 */
const TABS: Record<CccTab, { label: string; scale: Option[]; initial: string; grades: Record<string, GradeCopy>; illustration: { src: string; height: number } }> = {
  cut: { label: copy.cut, scale: DIAMOND_SCALES.cut, initial: "excellent", grades: CUT_GRADES, illustration: { src: "/images/builder/ccc-cut.svg", height: 59 } },
  color: { label: copy.color, scale: DIAMOND_SCALES.color, initial: "G", grades: COLOR_GRADES, illustration: { src: gradeScales.color.illustration.src, height: 91 } },
  clarity: { label: copy.clarity, scale: DIAMOND_SCALES.clarity, initial: "VVS2", grades: CLARITY_GRADES, illustration: { src: gradeScales.clarity.illustration.src, height: gradeScales.clarity.illustration.height.desktop } },
};

/**
 * One grade at a time on Figma's "Slider Option" row: a radio group drawn as the slider, with the 20px thumb over the
 * chosen grade. Arrow keys move between grades (native radios).
 */
export function GradePicker({ name, legend, scale, value, onChange }: { name: string; legend: string; scale: Option[]; value: string; onChange: (value: string) => void }) {
  return (
    <fieldset className="relative flex h-[2.75rem] min-w-0 items-start gap-0.5 pt-space-2">
      <legend className="sr-only">{legend}</legend>
      {scale.map((option) => {
        const selected = option.value === value;
        return (
          <label
            key={option.value}
            className={cx(
              "ui-transition-fast relative min-w-0 flex-1 cursor-pointer border-t-2 px-0.5 pt-space-2 pb-space-2 text-center ui-desktop:pt-2.5",
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary-leather",
              selected ? "border-primary-leather text-primary-leather" : "border-secondary-gold text-black-alpha-70 hover:text-primary-leather",
            )}
          >
            <input type="radio" name={name} value={option.value} checked={selected} onChange={() => onChange(option.value)} className="sr-only" />
            {selected ? <span aria-hidden="true" className="absolute -top-[11px] left-1/2 size-space-5 -translate-x-1/2 rounded-full border border-primary-leather bg-base-white shadow-md" /> : null}
            <span className="type-ui-2xs-medium block truncate ui-desktop:type-ui-xs-regular">{option.label}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

type CccModalProps = {
  open: boolean;
  onClose: () => void;
  /** The tab to open on: the filter whose question mark was pressed. */
  tab: CccTab;
  onTabChange: (tab: CccTab) => void;
};

/**
 * Figma "Modal - Filters Cut / Color / Clarity" (desktop 480 wide, 3565:101513 to 101515; mobile "Modal - CCC
 * Filters" 390 wide, 3587:126684 to 126686): pill tabs across the top, what the grade measures, a drawing in an ivory
 * 16:9 frame, the grade scale and what the chosen grade means. Opened by the question marks beside the Cut, Color and
 * Clarity filters, on that filter's tab. Choosing a grade here changes the explanation only, not the filters.
 * Figma draws no close button and no title: Escape and the backdrop close it, and the title is for screen readers.
 */
export function CccModal({ open, onClose, tab, onTabChange }: CccModalProps) {
  const id = useId();
  return (
    <DialogShell open={open} onClose={onClose} labelledBy={`${id}-title`}>
      {({ visible }) => (
        <div
          data-ccc-modal={tab}
          // Figma: base-white with a black-alpha-15 border drawn inside its 20 / 32 padding.
          className={`flex max-h-[calc(100dvh-var(--spacing-space-4))] w-full max-w-[24.375rem] flex-col gap-space-4 overflow-y-auto overscroll-contain rounded-8 border border-black-alpha-15 bg-base-white p-[calc(var(--spacing-space-5)-1px)] text-primary-leather shadow-lg ui-desktop:max-w-[30rem] ui-desktop:gap-space-6 ui-desktop:p-[calc(var(--spacing-space-8)-1px)] ${dialogPanelMotion(visible)}`}
        >
          <h2 id={`${id}-title`} className="sr-only">
            Diamond {TABS[tab].label.toLowerCase()} explained
          </h2>
          <CccPanel tab={tab} onTabChange={onTabChange} />
        </div>
      )}
    </DialogShell>
  );
}

/**
 * The explainer itself: the pill tabs, what the grade measures, the drawing, the grade scale and what the chosen grade
 * means. The modal above shows it; Resource Detail shows it inline as "Your Diamond's Qualities" (3565:101773).
 */
export function CccPanel({ tab, onTabChange }: { tab: CccTab; onTabChange: (tab: CccTab) => void }) {
  const id = useId();
  const [grade, setGrade] = useState<Record<CccTab, string>>({ cut: TABS.cut.initial, color: TABS.color.initial, clarity: TABS.clarity.initial });
  const current = TABS[tab];
  return (
    <>
      <Tabs
        label="Cut, color and clarity"
        value={tab}
        onChange={(next) => onTabChange(next as CccTab)}
        items={(Object.keys(TABS) as CccTab[]).map((key) => ({ id: key, label: TABS[key].label }))}
        size="sm"
        // Three equal 32px tabs across the row (40 with the pill's padding and border).
        className="[&_[role=tab]]:flex-1 [&>[role=tablist]]:w-full"
      />
      <p className="type-p-xs-regular ui-desktop:type-p-sm-regular">{copy.help[tab]}</p>
      <div className="flex aspect-video shrink-0 items-center justify-center overflow-hidden rounded-4 border border-black-alpha-5 bg-secondary-ivory">
        {/* eslint-disable-next-line @next/next/no-img-element -- a static SVG diagram exported from Figma */}
        <img
          src={withBasePath(current.illustration.src)}
          alt=""
          width={267}
          height={198}
          className="h-(--drawing) w-auto max-w-none"
          style={{ "--drawing": `${current.illustration.height}%` } as CSSProperties}
        />
      </div>
      <div className="flex flex-col gap-space-2 ui-desktop:gap-space-4">
        <GradePicker name={`${id}-${tab}`} legend={`${current.label} grade`} scale={current.scale} value={grade[tab]} onChange={(value) => setGrade((all) => ({ ...all, [tab]: value }))} />
        <p aria-live="polite" className="type-p-xs-regular">
          {current.grades[grade[tab]]?.description}
        </p>
      </div>
    </>
  );
}
