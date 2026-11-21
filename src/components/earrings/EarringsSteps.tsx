"use client";

import Link from "next/link";
import { useQuery } from "@/components/builder/useQuery";
import { StonePicture } from "@/components/builder/StonePicture";
import { settingTitle, settingVariant } from "@/components/builder/ring";
import { Picture } from "@/components/ui/Picture";
import { StepIndicator, StepList } from "@/components/ui/StepIndicator";
import { builderContent } from "@/content/builder";
import { earringsContent } from "@/content/earrings";
import { metalById } from "@/content/metals";
import { formatPrice, imagesFor, type Product } from "@/content/products";
import type { StonePair } from "@/lib/earrings";
import { earringSettingHref, earringSettingsHref, pairHref, pairsHref, parseEarrings, type Earrings } from "./routes";

const { steps } = earringsContent;

function StepLink({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className="type-overline-xs-link ui-transition-fast text-primary-leather hover:text-black-alpha-60">
      {children}
    </Link>
  );
}

/** The pair's two stones side by side, as Figma's 64px step image (e6633852) and 40px row image draw them. */
export function PairThumb({ pair, size }: { pair: Pick<StonePair, "image" | "shape" | "title">; size: string }) {
  return (
    <span aria-hidden="true" className="flex size-full items-center justify-center">
      {[0, 1].map((index) => (
        <span key={index} className="block aspect-square w-1/2">
          <StonePicture stone={{ ...pair, title: "" }} sizes={{ desktop: size, mobile: size }} />
        </span>
      ))}
    </span>
  );
}

type EarringsStepsProps = {
  current: 1 | 2 | 3;
  /** Every earring setting's product, so Step 2 and 3 can show the one the URL names. */
  settings?: Product[];
  /** Step 3: the chosen pair. */
  pair?: StonePair | null;
  /** Step 3: the pair is no longer available (the ring builder's Unavailable state). */
  pairUnavailable?: boolean;
  /** The style guide's demos: earrings to show instead of the URL's. */
  earrings?: Partial<Earrings>;
};

/**
 * The earrings builder's step bar (Figma desktop "steps" 3565:98140, three 480 x 80 Step Indicators; mobile three
 * 130 x 54), built from the ring builder's Step Indicator. From Step 2 the first step shows the chosen setting
 * ("Four Prong Custom Diam..." 3565:98192): its name, price, Edit (the setting's page) and Remove (the list), and its
 * photo. On Step 3 the second step shows the pair (3565:99579): its title, price, View and Remove, and the two stones.
 */
export function EarringsSteps({ current, settings = [], pair = null, pairUnavailable = false, earrings: demo }: EarringsStepsProps) {
  const [search] = useQuery();
  const earrings = demo ? { setting: null, metal: null, shape: null, stone: null, ...demo } : parseEarrings(new URLSearchParams(search));
  const setting = current >= 2 ? settings.find((product) => product.slug === earrings.setting) : undefined;
  const variant = setting ? settingVariant(setting, earrings.metal) : undefined;
  const chosen = current === 3 && setting ? pair : null;
  const linked = { ...earrings, metal: variant?.metal ?? earrings.metal };

  return (
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
        selectedName={setting && variant ? `${settingTitle(setting)} ${metalById(variant.metal).label}` : undefined}
        price={variant ? formatPrice(variant.price) : undefined}
        actions={
          setting && variant
            ? [
                <StepLink key="edit" href={earringSettingHref(setting.slug, linked)}>
                  {builderContent.steps.edit}
                </StepLink>,
                <StepLink key="remove" href={earringSettingsHref()}>
                  {builderContent.steps.remove}
                </StepLink>,
              ]
            : undefined
        }
        image={
          setting && variant ? <Picture image={{ ...imagesFor(setting, variant.metal)[0], alt: "" }} sizes={{ desktop: "64px", mobile: "64px" }} className="size-full object-cover mix-blend-multiply" /> : undefined
        }
      />
      <StepIndicator
        step={2}
        verb={steps.stones.verb}
        noun={steps.stones.noun}
        mobileNoun={steps.stones.mobileNoun}
        active={current === 2}
        complete={Boolean(chosen)}
        unavailable={pairUnavailable}
        selectedName={chosen ? chosen.title : undefined}
        price={chosen ? formatPrice(chosen.price) : undefined}
        actions={
          chosen
            ? pairUnavailable
              ? [
                  <StepLink key="new" href={pairsHref(linked)}>
                    {earringsContent.unavailable.selectNew}
                  </StepLink>,
                ]
              : [
                  <StepLink key="view" href={pairHref(chosen.handle, linked)}>
                    {builderContent.complete.view}
                  </StepLink>,
                  <StepLink key="remove" href={pairsHref(linked)}>
                    {builderContent.steps.remove}
                  </StepLink>,
                ]
            : undefined
        }
        image={chosen ? <PairThumb pair={chosen} size="32px" /> : undefined}
      />
      <StepIndicator step={3} verb={steps.complete.verb} noun={steps.complete.noun} active={current === 3} />
    </StepList>
  );
}
