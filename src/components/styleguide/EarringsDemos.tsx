"use client";

import { useState, type ReactNode } from "react";
import { BagPanelRing, BagRingRow } from "@/components/bag/BagRing";
import { TotalPrice } from "@/components/builder/CompleteRing";
import { settingTitle } from "@/components/builder/ring";
import { RingConfigChoice } from "@/components/builder/RingConfigChoice";
import { EarringsDesktopGallery, PairStoneViews } from "@/components/earrings/EarringsGallery";
import { EarringsSteps, PairThumb } from "@/components/earrings/EarringsSteps";
import { PairCard, PairQuickView } from "@/components/earrings/PairCard";
import { settingGalleryOrder } from "@/components/earrings/EarringSettingDetail";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { Picture } from "@/components/ui/Picture";
import { builderContent, shapeIcon } from "@/content/builder";
import { earringsContent } from "@/content/earrings";
import { metalById } from "@/content/metals";
import { formatPrice, imagesFor } from "@/content/products";
import { bagItems, type BagLine, type BagRingItem } from "@/lib/bag";
import type { EarringSetting, StonePair } from "@/lib/earrings";

function Demo({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <figure className={`flex min-w-0 flex-col items-start gap-space-2 ${className ?? ""}`}>
      <div className="w-full">{children}</div>
      <figcaption className="type-ui-2xs-regular text-black-alpha-70">{label}</figcaption>
    </figure>
  );
}

const ring = builderContent.complete;
const text = earringsContent;

/** Built earrings' two bag lines, as the cart returns them (sample data for the style guide). */
function sampleEarrings(setting: EarringSetting, pair: StonePair, available: boolean): BagRingItem {
  const variant = setting.product.variants[0];
  const id = available ? "demo-earrings" : "demo-earrings-gone";
  const base = { variantId: null, quantity: 1, length: null, carat: null };
  const settingLine: BagLine = {
    ...base,
    id: `${id}-setting`,
    handle: setting.handle,
    category: "earring-settings",
    href: "#",
    name: setting.product.name,
    title: setting.product.name,
    metal: variant.metal,
    shipsInDays: setting.product.shipsInDays,
    image: imagesFor(setting.product, variant.metal)[0],
    unitPrice: variant.price,
    subtotal: variant.price,
    total: variant.price,
    available: true,
    ring: { id, size: null, role: "setting", build: "earrings" },
    stone: null,
  };
  const pairLine: BagLine = {
    ...base,
    id: `${id}-pair`,
    handle: pair.handle,
    category: "stone-pairs",
    href: "#",
    name: pair.title,
    title: pair.title,
    metal: variant.metal,
    carat: pair.carat,
    shipsInDays: pair.shipsInDays,
    image: pair.image,
    unitPrice: pair.price,
    subtotal: pair.price,
    total: pair.price,
    available,
    ring: { id, size: null, role: "stone", build: "earrings" },
    stone: { kind: "diamond", origin: pair.origin, shape: pair.shape, carat: pair.carat, color: pair.color, clarity: pair.clarity, cut: pair.cut, pair: [pair.stones[0].carat, pair.stones[1].carat] },
  };
  return bagItems([settingLine, pairLine])[0] as BagRingItem;
}

/**
 * Earrings builder parts (/design-your-own/earrings/): the step bar on Steps 2 and 3 (and its unavailable state), the
 * pair card and its mobile sheet, a diamond's views, the Step 3 gallery and rows, and built earrings in the bag page
 * and panel. The unavailable states appear on the site only when the Storefront API says a pair is gone; they are
 * shown here with sample data.
 */
export function EarringsDemos({ setting, pair }: { setting: EarringSetting; pair: StonePair }) {
  const [dialog, setDialog] = useState<"sheet" | "unavailable" | null>(null);
  const variant = setting.product.variants[0];
  const name = settingTitle(setting.product);
  const earrings = { setting: setting.handle, metal: variant.metal, shape: pair.shape as "round", stone: pair.handle };
  const close = () => setDialog(null);
  const { photos, model } = settingGalleryOrder(setting.product, variant.metal);
  const settingRow = (
    <RingConfigChoice
      icon="setting"
      image={<Picture image={{ ...photos.front, alt: "" }} sizes={{ desktop: "40px", mobile: "40px" }} className="size-full object-cover mix-blend-multiply" />}
      sentenceCase
      name={name}
      summary={metalById(variant.metal).label}
      price={formatPrice(variant.price)}
      actions={[
        { label: ring.edit, href: "#earrings-builder" },
        { label: ring.remove, href: "#earrings-builder" },
      ]}
    />
  );
  const pairRow = (unavailable: boolean) => (
    <RingConfigChoice
      icon={shapeIcon(pair.shape)}
      image={<PairThumb pair={pair} size="20px" />}
      sentenceCase
      name={pair.title}
      summary={`${pair.color} • ${pair.clarity}`}
      price={formatPrice(pair.price)}
      actions={[
        { label: ring.view, href: "#earrings-builder" },
        { label: ring.remove, href: "#earrings-builder" },
      ]}
      unavailable={unavailable ? { message: text.unavailable.row, action: { label: text.unavailable.selectNew, href: "#earrings-builder" } } : null}
    />
  );

  return (
    <div className="flex flex-col gap-space-10 text-primary-leather">
      <Demo label="Step bar on Step 2 (Figma 3565:98191): the setting chosen, Select Diamonds current">
        <EarringsSteps current={2} settings={[setting.product]} earrings={earrings} />
      </Demo>
      <Demo label="Step bar on Step 3 (3565:99577): both earlier steps complete, Complete Earrings current">
        <EarringsSteps current={3} settings={[setting.product]} pair={pair} earrings={earrings} />
      </Demo>
      <Demo label="Step bar, pair unavailable (inferred from the ring builder's Unavailable variant)">
        <EarringsSteps current={3} settings={[setting.product]} pair={pair} pairUnavailable earrings={earrings} />
      </Demo>

      <div className="grid gap-space-8 ui-desktop:grid-cols-2">
        <Demo label="Pair card (Product Card, Type=Multi; 3565:98292). Hover or focus it for the hover state (3565:98305)">
          <div className="pb-space-15">
            <PairCard pair={pair} href="#earrings-builder" completeHref="#earrings-builder" settingPrice={variant.price} onQuickView={() => setDialog("sheet")} />
          </div>
        </Demo>
        <Demo label="A diamond's views (Stones Info 3565:99228): photo with the 360 hint, specs, certificate">
          <div className="max-w-[20.1875rem]">
            <PairStoneViews stone={pair.stones[0]} name={pair.stones[0].title} variant="desktop" />
          </div>
        </Demo>
      </div>
      <Demo label="Mobile pair sheet (Product List - Multi / Modal 3587:127084)">
        <Button size="sm" variant="secondary" onClick={() => setDialog("sheet")}>
          Open the pair sheet
        </Button>
      </Demo>

      <Demo label="Step 3 gallery (3565:99574): the studs with the 360 hint, the model photo with Figma's badge, dots and arrow, and each diamond">
        <div className="max-w-[43.375rem]">
          <EarringsDesktopGallery
            tiles={[
              { key: "front", kind: "photo", image: photos.front, hint360: true },
              { key: "model", kind: "model", images: model, name, badge: text.complete.shownWith },
              { key: "a", kind: "stone", stone: pair.stones[0], hint360: true },
              { key: "b", kind: "stone", stone: pair.stones[1], hint360: true },
            ]}
          />
        </div>
      </Demo>

      <div className="grid gap-space-8 ui-desktop:grid-cols-2">
        <Demo label="Step 3 rows (3565:99587 / 99588): the setting and the pair, each with its photo">
          <div className="flex max-w-[31.625rem] flex-col gap-space-4">
            {settingRow}
            {pairRow(false)}
          </div>
        </Demo>
        <Demo label="Pair unavailable (the ring builder's drawn state, inferred): the row, the struck total and the button">
          <div className="flex max-w-[31.625rem] flex-col gap-space-4">
            {pairRow(true)}
            <TotalPrice total={variant.price + pair.price} struck />
            <Button className="w-full" onClick={() => setDialog("unavailable")}>
              Open the unavailable modal
            </Button>
          </div>
        </Demo>
      </div>

      <Demo label="Built earrings on the bag page (following the ring's rows; inferred: the bag frames draw a ring)">
        <BagRingRow ring={sampleEarrings(setting, pair, true)} />
      </Demo>
      <Demo label="Built earrings on the bag page, pair unavailable">
        <BagRingRow ring={sampleEarrings(setting, pair, false)} />
      </Demo>
      <div className="grid gap-space-8 ui-desktop:grid-cols-2">
        <Demo label="Bag panel item">
          <ul className="max-w-[22.375rem]">
            <BagPanelRing ring={sampleEarrings(setting, pair, true)} onRemove={() => undefined} />
          </ul>
        </Demo>
        <Demo label="Bag panel item, pair unavailable">
          <ul className="max-w-[22.375rem]">
            <BagPanelRing ring={sampleEarrings(setting, pair, false)} onRemove={() => undefined} />
          </ul>
        </Demo>
      </div>

      <PairQuickView pair={pair} open={dialog === "sheet"} onClose={close} href="#earrings-builder" completeHref="#earrings-builder" settingPrice={variant.price} />
      <Modal
        open={dialog === "unavailable"}
        onClose={close}
        align="center"
        icon={<Icon name="stone-unavailable" size={64} className="text-state-error" />}
        heading={text.unavailable.modal.heading}
        body={text.unavailable.modal.body}
        actionsLayout="stack"
        primaryAction={{ label: text.unavailable.modal.primary, onClick: close }}
        secondaryAction={{ label: text.unavailable.modal.secondary, onClick: close }}
      />
    </div>
  );
}
