"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Carousel } from "@/components/ui/Carousel";
import { Dropdown } from "@/components/ui/Dropdown";
import { IconButton } from "@/components/ui/IconButton";
import { Input, InputMessage } from "@/components/ui/Input";
import { DialogShell, dialogPanelMotion } from "@/components/ui/Modal";
import { Picture } from "@/components/ui/Picture";
import { RichText } from "@/components/ui/RichText";
import { cx } from "@/components/ui/shared";
import { builderContent } from "@/content/builder";

const copy = builderContent.ringSizeModal;
type Unit = "in" | "cm";

/** Millimetres in one unit. */
const MM: Record<Unit, number> = { in: 25.4, cm: 10 };
const UNIT_WORDS: Record<Unit, string> = { in: "inches", cm: "centimetres" };

/**
 * The standard US ring size from a finger's circumference: the inside diameter in mm is 11.63 + 0.8128 x size, so
 * size = (circumference / pi - 11.63) / 0.8128, rounded to the nearest half size.
 * Figma's example (2 inches, size 6) doesn't follow it: 2 inches is 50.8mm, which is size 5.5 (size 6 is 51.9mm).
 */
export function ringSizeFromCircumference(mm: number) {
  return Math.round(((mm / Math.PI - 11.63) / 0.8128) * 2) / 2;
}
const circumferenceOf = (size: number) => Math.PI * (11.63 + 0.8128 * size);

/** The sizes the converter answers with: the usual US range. A length outside it is more likely a mistake. */
const SMALLEST = 3;
const LARGEST = 13.5;

/** "5.5" or "6". */
export const formatRingSize = (size: number) => (Number.isInteger(size) ? String(size) : size.toFixed(1));

type Result = { ok: true; size: number } | { ok: false; error: string };

export function convertMeasurement(raw: string, unit: Unit): Result {
  const value = Number(raw.trim().replace(",", "."));
  if (!raw.trim() || !Number.isFinite(value)) return { ok: false, error: copy.errors.required };
  const size = ringSizeFromCircumference(value * MM[unit]);
  if (value <= 0 || size < SMALLEST || size > LARGEST) {
    // The lengths that round to the smallest and largest sizes, in the chosen unit.
    const bound = (s: number) => (circumferenceOf(s) / MM[unit]).toFixed(2);
    return { ok: false, error: copy.errors.range(bound(SMALLEST - 0.25), bound(LARGEST + 0.25), UNIT_WORDS[unit]) };
  }
  return { ok: true, size };
}

/**
 * Figma "Step Card": a 4:3 photo over the step's title and text, base white. Figma draws its black-alpha-10 border
 * inside the card, over the photo's edges, so the border is an overlay here and the photo keeps the card's full width.
 */
function StepCard({ step }: { step: (typeof copy.steps)[number] }) {
  return (
    <div data-step-card className="relative flex h-full flex-col overflow-hidden rounded-4 bg-base-white text-primary-leather after:pointer-events-none after:absolute after:inset-0 after:rounded-4 after:border after:border-black-alpha-10">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Picture image={step.image} sizes={{ desktop: "14rem", mobile: "18rem" }} className="absolute inset-0 size-full object-cover" />
      </div>
      <div className="flex flex-col gap-1 p-space-3">
        <h3 className="type-body-sm-medium">{step.title}</h3>
        <p className="type-body-xs-regular">{step.body}</p>
      </div>
    </div>
  );
}

type RingSizeModalProps = { open: boolean; onClose: () => void };

/**
 * "Modal - Ring Size 1" (3565:101570; mobile 3587:126687) and "2" (3565:101612; mobile 3587:126704): three
 * measuring steps, then the Measurement Converter. Calculate turns the finger's circumference into a US ring size
 * (modal 2); Reset goes back to modal 1. Units: Inches, as drawn, and Centimetres. The result doesn't set the page's
 * ring size (Figma draws no control for that).
 * Desktop: 800 wide, 48 padding, the cards in a row. Mobile: the cards in a swipe row with the 1px scrollbar.
 */
export function RingSizeModal({ open, onClose }: RingSizeModalProps) {
  const headingId = useId();
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState<Unit>("in");
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const errorId = useId();

  const calculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = convertMeasurement(value, unit);
    if (!result.ok) {
      setError(result.error);
      inputRef.current?.focus();
      return;
    }
    setError(null);
    setSize(result.size);
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLButtonElement>("[data-ring-size-reset]")?.focus());
  };
  const reset = () => {
    setSize(null);
    setValue("");
    setError(null);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <DialogShell open={open} onClose={onClose} labelledBy={headingId}>
      {({ visible }) => (
        <div
          data-ring-size-modal={size === null ? "1" : "2"}
          className={cx(
            "relative flex max-h-[calc(100dvh-var(--spacing-space-6))] w-full flex-col overflow-y-auto overscroll-contain rounded-t-8 bg-secondary-skin text-primary-leather shadow-lg ring-1 ring-black-alpha-2",
            "ui-desktop:max-h-[calc(100dvh-var(--spacing-space-12))] ui-desktop:max-w-[50rem] ui-desktop:rounded-4",
            dialogPanelMotion(visible),
          )}
        >
          <IconButton icon="close" label="Close" size="sm" variant="ghost" onClick={onClose} className="absolute top-space-4 right-space-4 z-10 ui-desktop:top-space-5 ui-desktop:right-space-5 ui-desktop:size-space-10" />
          <div className="flex flex-col gap-space-5 px-space-5 pt-space-5 pb-space-8 ui-desktop:gap-space-8 ui-desktop:p-space-11">
            <div className="flex flex-col gap-space-2 text-center ui-desktop:gap-space-3">
              <h2 id={headingId} className="type-heading-caps-md px-space-10 ui-desktop:type-heading-caps-lg">
                <RichText value={copy.heading} emClassName="type-heading-italic-md ui-desktop:type-heading-italic-lg" />
              </h2>
              <p className="type-p-xs-regular ui-desktop:type-p-sm-regular">{copy.intro}</p>
            </div>
            <Carousel
              label={copy.stepsLabel}
              desktop="grid"
              gridClassName="ui-desktop:grid-cols-3 ui-desktop:gap-space-4!"
              itemClassName="w-[18rem] ui-desktop:w-auto"
              className="-mx-space-5 [--grid-margin:var(--spacing-space-5)] ui-desktop:mx-0 ui-desktop:[--grid-margin:0px] [&>div:last-child]:mt-space-5"
              items={copy.steps.map((step) => ({ key: step._key, node: <StepCard step={step} /> }))}
            />
            <form ref={formRef} noValidate onSubmit={calculate} className="flex flex-col gap-space-4">
              <h3 className="type-heading-sm text-center">{copy.converter}</h3>
              {size === null ? (
                <div className="flex flex-col gap-space-1">
                  <div className="flex items-start gap-space-3 ui-desktop:gap-space-4">
                    <Input
                      ref={inputRef}
                      label={copy.measurement}
                      size="sm"
                      inputMode="decimal"
                      autoComplete="off"
                      value={value}
                      onChange={(event) => setValue(event.target.value)}
                      error={Boolean(error)}
                      aria-describedby={error ? errorId : undefined}
                      className="min-w-0 flex-1"
                    />
                    <Dropdown
                      label={copy.unitsLabel}
                      size="sm"
                      width="auto"
                      options={copy.units}
                      value={unit}
                      onChange={(next) => setUnit(next as Unit)}
                      panelWidth="w-44"
                      panelAlign="end"
                      className="shrink-0"
                    />
                    <Button type="submit" size="sm" className="w-[7.375rem] shrink-0 ui-desktop:w-50">
                      {copy.calculate}
                    </Button>
                  </div>
                  {/* Not drawn: the Design System's input error message, under the row (the field is too narrow on mobile). */}
                  {error ? (
                    <InputMessage id={errorId} status="error">
                      {error}
                    </InputMessage>
                  ) : null}
                </div>
              ) : (
                <div className="flex items-center gap-space-3 ui-desktop:gap-space-4">
                  <p aria-live="polite" className="flex h-space-10 min-w-0 flex-1 items-center justify-center gap-space-3 bg-secondary-ivory px-space-2">
                    <span className="type-body-xs-medium">{copy.result}</span>
                    <span data-ring-size-result className="type-body-md-medium">
                      {formatRingSize(size)}
                    </span>
                  </p>
                  <Button data-ring-size-reset type="button" size="sm" onClick={reset} className="w-[10.5625rem] shrink-0 ui-desktop:w-50">
                    {copy.reset}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </DialogShell>
  );
}
