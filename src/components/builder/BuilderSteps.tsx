"use client";

import Link from "next/link";
import { Picture } from "@/components/ui/Picture";
import { StepIndicator, StepList } from "@/components/ui/StepIndicator";
import { builderContent } from "@/content/builder";
import { formatPrice, imagesFor, type Product } from "@/content/products";
import { parseRing, settingHref, settingShortName, settingsHref, settingVariant, startDefaults } from "./ring";
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
  current: 1 | 2;
  /** Every setting, so Step 2 can show the one the URL names. Step 1 pages don't need them. */
  settings?: Product[];
};

/**
 * The ring builder's step bar (Figma "steps": desktop three 480 x 80 Step Indicators with a leather rule below,
 * mobile three 130 x 54). On Step 2 the first step shows the chosen setting from the URL (?setting=&metal=): its
 * short name, price, Edit (back to the setting's page) and Remove (back to the list), and its photo.
 * Step 2 reads "Select Diamond", or "Select Stone" in gemstone mode, as the Gemstone frames do on desktop; the
 * mobile frames say "Stone" for both.
 */
export function BuilderSteps({ current, settings = [] }: BuilderStepsProps) {
  const [search] = useQuery();
  const ring = parseRing(new URLSearchParams(search));
  const setting = current === 2 ? settings.find((product) => product.slug === ring.setting) : undefined;
  const variant = setting ? settingVariant(setting, ring.metal) : undefined;
  const second = startDefaults(ring.start).kind === "gemstone" ? steps.stone : steps.diamond;

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
      />
      <StepIndicator step={3} verb={steps.complete.verb} noun={steps.complete.noun} />
    </StepList>
  );
}
