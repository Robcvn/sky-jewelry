"use client";

import Link from "next/link";
import { Picture } from "@/components/ui/Picture";
import { StepIndicator, StepList } from "@/components/ui/StepIndicator";
import { builderContent } from "@/content/builder";
import { formatPrice, imagesFor, type Product } from "@/content/products";
import type { Stone } from "@/lib/builder";
import { parseRing, type Ring, settingHref, settingShortName, settingsHref, settingVariant, startDefaults, stoneHref, stonesHref, stoneStepName } from "./ring";
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

type BuilderStepsProps = {
  /** The step this page belongs to. */
  current: 1 | 2 | 3;
  /** Every setting, so Step 2 can show the one the URL names. Step 1 pages don't need them. */
  settings?: Product[];
  /** Step 3: the chosen stone (from the URL), shown in the second step. */
  stone?: Stone | null;
  /** Step 3: the stone is no longer available (Figma "Builder - Stone Unavailable"). */
  stoneUnavailable?: boolean;
  /** The style guide's demos: a ring to show instead of the URL's. */
  ring?: Partial<Ring>;
};

/**
 * The ring builder's step bar (Figma "steps": desktop three 480 x 80 Step Indicators with a leather rule below,
 * mobile three 130 x 54). On Step 2 the first step shows the chosen setting from the URL (?setting=&metal=): its
 * short name, price, Edit (back to the setting's page) and Remove (back to the list), and its photo.
 * Step 2 reads "Select Diamond", or "Select Stone" in gemstone mode, as the Gemstone frames do on desktop; the
 * mobile frames say "Stone" for both.
 * On Step 3 (6579:194415) the second step shows the stone too: "Round 0.50 Carat", its price, View (the stone's page)
 * and Remove (the stone list, keeping the setting), and its photo. When the stone is no longer available it takes
 * Figma's Unavailable variant (7412:102902): the name struck through, "Unavailable", and Select New Stone.
 */
export function BuilderSteps({ current, settings = [], stone = null, stoneUnavailable = false, ring: demoRing }: BuilderStepsProps) {
  const [search] = useQuery();
  const ring = demoRing ? { ...parseRing(new URLSearchParams()), ...demoRing } : parseRing(new URLSearchParams(search));
  const setting = current >= 2 ? settings.find((product) => product.slug === ring.setting) : undefined;
  const variant = setting ? settingVariant(setting, ring.metal) : undefined;
  const chosenStone = current === 3 && setting ? stone : null;
  const gemstone = chosenStone ? chosenStone.kind === "gemstone" : startDefaults(ring.start).kind === "gemstone";
  const second = gemstone ? steps.stone : steps.diamond;
  const stoneRing = { ...ring, metal: variant?.metal ?? ring.metal };

  return (
    // Figma draws the bar's bottom rule and the dividers inside the 80px (mobile 54px) steps, so they are overlaid rather than added to the height.
    <StepList
      label={steps.label}
      className="relative after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-primary-leather [&>li]:relative [&>li+li]:before:pointer-events-none [&>li+li]:before:absolute [&>li+li]:before:inset-y-0 [&>li+li]:before:left-0 [&>li+li]:before:z-10 [&>li+li]:before:w-px [&>li+li]:before:bg-primary-leather"
    >
      <StepIndicator
        step={1}
        verb={steps.setting.verb}
        noun={steps.setting.noun}
        active={current === 1}
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
      <StepIndicator
        step={2}
        verb={second.verb}
        noun={second.noun}
        mobileNoun={steps.stone.noun}
        active={current === 2}
        complete={Boolean(chosenStone)}
        unavailable={stoneUnavailable}
        selectedName={chosenStone ? stoneStepName(chosenStone) : undefined}
        price={chosenStone ? formatPrice(chosenStone.price) : undefined}
        actions={
          chosenStone
            ? stoneUnavailable
              ? [
                  <StepLink key="new" href={stonesHref(stoneRing)}>
                    {builderContent.complete.unavailable.selectNewStone}
                  </StepLink>,
                ]
              : [
                  <StepLink key="view" href={stoneHref(chosenStone.handle, stoneRing)}>
                    {builderContent.complete.view}
                  </StepLink>,
                  <StepLink key="remove" href={stonesHref(stoneRing)}>
                    {steps.remove}
                  </StepLink>,
                ]
            : undefined
        }
        image={chosenStone ? <StonePicture stone={chosenStone} sizes={{ desktop: "64px", mobile: "64px" }} /> : undefined}
      />
      <StepIndicator step={3} verb={steps.complete.verb} noun={steps.complete.noun} active={current === 3} />
    </StepList>
  );
}
