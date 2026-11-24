"use client";

import { useState, type ReactNode } from "react";
import { BagRingRow, BagPanelRing } from "@/components/bag/BagRing";
import { CarePlanRow } from "@/components/bag/BagPage";
import { BuilderSteps } from "@/components/builder/BuilderSteps";
import { TotalPrice } from "@/components/builder/CompleteRing";
import { DropHintModal } from "@/components/builder/DropHintModal";
import { settingShort, stoneCaratTitle, stoneSummary, ringName } from "@/components/builder/ring";
import { RingConfigChoice } from "@/components/builder/RingConfigChoice";
import { RingSizeModal } from "@/components/builder/RingSizeModal";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { builderContent, shapeIcon } from "@/content/builder";
import { metalById } from "@/content/metals";
import { formatPrice, imagesFor, type Product } from "@/content/products";
import { bagItems, type BagLine, type BagRingItem } from "@/lib/bag";
import type { RingSetting, Stone } from "@/lib/builder";

function Demo({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <figure className={`flex min-w-0 flex-col items-start gap-space-2 ${className ?? ""}`}>
      <div className="w-full">{children}</div>
      <figcaption className="type-ui-2xs-regular text-black-alpha-70">{label}</figcaption>
    </figure>
  );
}

const text = builderContent.complete;

/** A built ring's two bag lines, as the cart returns them (sample data for the style guide). */
function sampleRing(setting: RingSetting, stone: Stone, available: boolean): BagRingItem {
  const variant = setting.product.variants[0];
  const ring = { id: available ? "demo-ring" : "demo-ring-gone", size: "6.5" };
  const base = { variantId: null, quantity: 1, length: null, carat: null };
  const settingLine: BagLine = {
    ...base,
    id: `${ring.id}-setting`,
    handle: setting.handle,
    category: "engagement-rings",
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
    ring: { ...ring, role: "setting", build: "ring" },
    stone: null,
  };
  const stoneLine: BagLine = {
    ...base,
    id: `${ring.id}-stone`,
    handle: stone.handle,
    category: "loose-stones",
    href: "#",
    name: stone.title,
    title: stone.title,
    metal: variant.metal,
    carat: stone.carat,
    shipsInDays: stone.shipsInDays,
    image: stone.image,
    unitPrice: stone.price,
    subtotal: stone.price,
    total: stone.price,
    available,
    ring: { ...ring, role: "stone", build: "ring" },
    stone: { kind: stone.kind, origin: stone.origin, shape: stone.shape, carat: stone.carat, color: stone.color, clarity: stone.clarity, cut: stone.cut, gem: stone.gem },
  };
  return bagItems([settingLine, stoneLine])[0] as BagRingItem;
}

/**
 * Ring builder Step 3 parts (/design-your-own/complete/): the step bar in its Step 3 and Stone Unavailable states,
 * Ring Config Choice, Total Price, the three modals, and a built ring in the bag page and panel. The unavailable
 * states appear on the site only when the Storefront API says a stone is gone; they are shown here with sample data.
 */
export function CompleteDemos({ setting, stone }: { setting: RingSetting; stone: Stone; bands?: Product[] }) {
  const [dialog, setDialog] = useState<"size" | "hint" | "unavailable" | null>(null);
  const [hintKey, setHintKey] = useState(0);
  const variant = setting.product.variants[0];
  const short = settingShort(setting.product);
  const ring = { setting: setting.handle, metal: variant.metal, shape: stone.shape as "round", stone: stone.handle };
  const close = () => setDialog(null);
  const okRing = sampleRing(setting, stone, true);
  const goneRing = sampleRing(setting, stone, false);
  const settingRow = (
    <RingConfigChoice
      icon="setting"
      name={short}
      summary={metalById(variant.metal).label}
      price={formatPrice(variant.price)}
      actions={[
        { label: text.edit, href: "#ring-builder" },
        { label: text.remove, href: "#ring-builder" },
      ]}
    />
  );
  const stoneRow = (unavailable: boolean) => (
    <RingConfigChoice
      icon={shapeIcon(stone.shape)}
      name={stoneCaratTitle(stone.title)}
      summary={stoneSummary(stone, " • ")}
      price={formatPrice(stone.price)}
      actions={[
        { label: text.view, href: "#ring-builder" },
        { label: text.remove, href: "#ring-builder" },
      ]}
      unavailable={unavailable ? { message: text.unavailable.row, action: { label: text.unavailable.selectNewStone, href: "#ring-builder" } } : null}
    />
  );

  return (
    <div className="flex flex-col gap-space-10 text-primary-leather">
      <Demo label="Step bar on Step 3 (Figma 6579:194415): both earlier steps complete, Complete Ring current">
        {/* Full width below 1024, as on the page: inside the style guide's margins the steps are too narrow for their names. */}
        <div className="mx-[calc(var(--grid-margin)*-1)] ui-desktop:mx-0">
          <BuilderSteps current={3} settings={[setting.product]} stone={stone} ring={ring} />
        </div>
      </Demo>
      <Demo label="Stone unavailable (7412:102902): step 2 struck through, Unavailable, Select New Stone">
        {/* Full width below 1024, as on the page: inside the style guide's margins the steps are too narrow for their names. */}
        <div className="mx-[calc(var(--grid-margin)*-1)] ui-desktop:mx-0">
          <BuilderSteps current={3} settings={[setting.product]} stone={stone} ring={ring} stoneUnavailable />
        </div>
      </Demo>

      <div className="flex flex-wrap items-start gap-space-6">
        <Demo label="Ring Config Choice: setting (desktop links in caps; mobile in sentence case)" className="w-[31.625rem]">
          {settingRow}
        </Demo>
        <Demo label="Ring Config Choice: stone" className="w-[31.625rem]">
          {stoneRow(false)}
        </Demo>
        <Demo label="Ring Config Choice: stone unavailable (dashed, struck, Select New Stone)" className="w-[31.625rem]">
          {stoneRow(true)}
        </Demo>
      </div>

      <div className="flex flex-wrap items-start gap-space-10">
        <Demo label="Total Price" className="w-60">
          <TotalPrice total={variant.price + stone.price} struck={false} />
        </Demo>
        <Demo label="Total Price, stone unavailable" className="w-60">
          <TotalPrice total={variant.price + stone.price} struck />
        </Demo>
        <Demo label="Modal - Ring Size 1 and 2, Modal - Drop a Hint, the Stone Unavailable modal">
          <div className="flex flex-wrap gap-space-2">
            <Button size="sm" variant="secondary" onClick={() => setDialog("size")}>
              Modal - Ring Size
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setHintKey((key) => key + 1);
                setDialog("hint");
              }}
            >
              Drop a Hint
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setDialog("unavailable")}>
              Stone unavailable modal
            </Button>
          </div>
        </Demo>
      </div>

      <Demo label="A built ring on the bag page (6579:196262): setting row, stone row, care plan, total and Remove" className="w-full max-w-[51.375rem]">
        <BagRingRow ring={okRing} carePlan={<CarePlanRow state={{ status: "none" }} onAdd={() => undefined} onLearnMore={() => undefined} onRemovePlan={() => undefined} className="-mt-px" />} />
      </Demo>
      <Demo label="The ring with its stone no longer available (7414:137203)" className="w-full max-w-[51.375rem]">
        <BagRingRow ring={goneRing} />
      </Demo>
      <div className="flex flex-wrap items-start gap-space-10">
        <Demo label="The ring in the bag panel (5011:77722): one item, quantity held at 1" className="w-[21.875rem]">
          <ul>
            <BagPanelRing ring={okRing} onRemove={() => undefined} />
          </ul>
        </Demo>
        <Demo label="In the panel, stone unavailable" className="w-[21.875rem]">
          <ul>
            <BagPanelRing ring={goneRing} onRemove={() => undefined} />
          </ul>
        </Demo>
      </div>

      <RingSizeModal open={dialog === "size"} onClose={close} />
      <DropHintModal key={hintKey} open={dialog === "hint"} onClose={close} name={ringName(short, stone, "mobile")} image={imagesFor(setting.product, variant.metal)[0]} />
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
