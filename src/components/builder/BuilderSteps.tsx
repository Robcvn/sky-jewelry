"use client";

import Link from "next/link";
import { Picture } from "@/components/ui/Picture";
import { StepIndicator, StepList } from "@/components/ui/StepIndicator";
import { builderContent } from "@/content/builder";
import { formatPrice, imagesFor, type Product } from "@/content/products";
import type { Stone } from "@/lib/builder";
import { parseRing, type Ring, settingHref, settingShortName, settingsHref, settingVariant, startDefaults, stoneFirst, stoneFirstStartHref, stoneHref, stonesHref, stoneStepName } from "./ring";
import { StonePicture } from "./StonePicture";
import { useQuery } from "./useQuery";

const { steps } = builderContent;

/** Figma's Edit and Remove links in the step bar (overline-xs/link). */
function StepLink({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className="type-overline-xs-link ui-transition-fast text-primary-leather hover:text-black-alpha-60">
      {children}
    </Link>
  );
}

type StepStone = Pick<Stone, "handle" | "title" | "kind" | "shape" | "carat" | "price" | "image">;

type BuilderStepsProps = {
  /** The page's step in the setting-first flow (1 settings, 2 stones, 3 complete); stone first swaps 1 and 2. */
  current: 1 | 2 | 3;
  /** Every setting, so a later step can show the one the URL names. */
  settings?: Product[];
  /** Step 3: the chosen stone (from the URL). */
  stone?: StepStone | null;
  /** Stone first, the setting pages: the stones (slim), so Step 1 can show the one the URL names. */
  stones?: StepStone[];
  /** Step 3: the stone is no longer available (Figma "Builder - Stone Unavailable"). */
  stoneUnavailable?: boolean;
  /** The style guide's demos: a ring to show instead of the URL's. */
  ring?: Partial<Ring>;
};

/**
 * The ring builder's step bar (Figma "steps": desktop three 480 x 80 Step Indicators with a leather rule below,
 * mobile three 130 x 54).
 * Setting first: Select Setting, Select Diamond (or Select Stone in gemstone mode), Complete Ring. On Step 2 the first
 * step shows the chosen setting from the URL (?setting=&metal=): its short name, price, Edit (its page) and Remove
 * (the list), and its photo. On Step 3 (6579:194415) the second step shows the stone too: "Round 0.50 Carat", its
 * price, View (its page) and Remove (the stone list, keeping the setting), and its photo.
 * Stone first (?first=stone; Figma Stone First Builder 5440:36716, mobile Section 1 6683:68101): the same steps in the
 * other order. From Step 2 the first step shows the chosen stone with View and Remove (back to Step 1); on Step 3 the
 * second shows the setting with Edit and Remove (back to Step 2, keeping the stone).
 * The desktop frames say "Select Diamond", or "Select Stone" in gemstone mode; the mobile frames say "Stone".
 * When the stone is no longer available it takes Figma's Unavailable variant (7412:102902): the name struck through,
 * "Unavailable", and Select New Stone.
 */
export function BuilderSteps({ current, settings = [], stone = null, stones = [], stoneUnavailable = false, ring: demoRing }: BuilderStepsProps) {
  const [search] = useQuery();
  const ring = demoRing ? { ...parseRing(new URLSearchParams()), ...demoRing } : parseRing(new URLSearchParams(search));
  const first = stoneFirst(ring);
  const step = first ? ({ 1: 2, 2: 1, 3: 3 } as const)[current] : current;
  const setting = (first ? step === 3 : step >= 2) ? settings.find((product) => product.slug === ring.setting) : undefined;
  const variant = setting ? settingVariant(setting, ring.metal) : undefined;
  const chosenStone = first ? (step === 3 ? stone : step === 2 ? (stones.find((item) => item.handle === ring.stone) ?? null) : null) : step === 3 && setting ? stone : null;
  const gemstone = chosenStone ? chosenStone.kind === "gemstone" : startDefaults(ring.start).kind === "gemstone";
  const second = gemstone ? steps.stone : steps.diamond;
  const stoneRing = { ...ring, metal: variant?.metal ?? ring.metal };
  // Where Select New Stone and the stone's Remove go: setting first, the stone list keeping the setting; stone first,
  // Step 1 (Select New Stone keeps a chosen setting for the "with setting" prices; Remove starts over).
  const newStone = first ? stonesHref({ start: ring.start, first: "stone", setting: setting?.slug, metal: variant?.metal }) : stonesHref(stoneRing);
  const removeStone = first ? stoneFirstStartHref(ring) : stonesHref(stoneRing);

  const settingStep = (number: 1 | 2) => (
    <StepIndicator
      key="setting"
      step={number}
      verb={steps.setting.verb}
      noun={steps.setting.noun}
      active={step === number}
      complete={Boolean(setting)}
      selectedName={setting && variant ? settingShortName(setting, variant.metal) : undefined}
      price={variant ? formatPrice(variant.price) : undefined}
      actions={
        setting && variant
          ? [
              <StepLink key="edit" href={settingHref(setting.slug, { ...ring, metal: variant.metal })}>
                {steps.edit}
              </StepLink>,
              <StepLink key="remove" href={settingsHref(ring)}>
                {steps.remove}
              </StepLink>,
            ]
          : undefined
      }
      image={
        setting && variant ? (
          <Picture image={{ ...imagesFor(setting, variant.metal)[0], alt: "" }} sizes={{ desktop: "64px", mobile: "64px" }} className="size-full object-cover mix-blend-multiply" />
        ) : undefined
      }
    />
  );
  const stoneStep = (number: 1 | 2) => (
    <StepIndicator
      key="stone"
      step={number}
      verb={second.verb}
      noun={second.noun}
      mobileNoun={steps.stone.noun}
      active={step === number}
      complete={Boolean(chosenStone)}
      unavailable={stoneUnavailable}
      selectedName={chosenStone ? stoneStepName(chosenStone) : undefined}
      price={chosenStone ? formatPrice(chosenStone.price) : undefined}
      actions={
        chosenStone
          ? stoneUnavailable
            ? [
                <StepLink key="new" href={newStone}>
                  {builderContent.complete.unavailable.selectNewStone}
                </StepLink>,
              ]
            : [
                <StepLink key="view" href={stoneHref(chosenStone.handle, stoneRing)}>
                  {builderContent.complete.view}
                </StepLink>,
                <StepLink key="remove" href={removeStone}>
                  {steps.remove}
                </StepLink>,
              ]
          : undefined
      }
      image={chosenStone ? <StonePicture stone={chosenStone} sizes={{ desktop: "64px", mobile: "64px" }} /> : undefined}
    />
  );

  return (
    // Figma draws the bar's bottom rule and the dividers inside the 80px (mobile 54px) steps, so they are overlaid rather than added to the height.
    <StepList
      label={steps.label}
      className="relative after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-primary-leather [&>li]:relative [&>li+li]:before:pointer-events-none [&>li+li]:before:absolute [&>li+li]:before:inset-y-0 [&>li+li]:before:left-0 [&>li+li]:before:z-10 [&>li+li]:before:w-px [&>li+li]:before:bg-primary-leather"
    >
      {first ? [stoneStep(1), settingStep(2)] : [settingStep(1), stoneStep(2)]}
      <StepIndicator step={3} verb={steps.complete.verb} noun={steps.complete.noun} active={step === 3} />
    </StepList>
  );
}
