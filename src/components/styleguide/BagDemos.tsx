"use client";

import { useState, type ReactNode } from "react";
import { BagInfoCard, BagItem, CarePlanRow, OrderPrice, SpecialInstructions } from "@/components/bag/BagPage";
import { CarePlanInfoModal, CarePlanModal, CheckoutNoticeModal, CreditModal, ProtectionPlansModal } from "@/components/bag/BagModals";
import { BagPanelItem } from "@/components/bag/BagPanel";
import { CheckoutBar, PillButton, QuantitySelect } from "@/components/bag/BagParts";
import { Button } from "@/components/ui/Button";
import { bagContent } from "@/content/bag";
import type { BagLine } from "@/lib/bag";

const pendant: BagLine = {
  id: "demo-pendant",
  variantId: null,
  handle: "four-prong-solitaire-lab-grown-pendant",
  category: "necklaces",
  href: "/fine-jewelry/necklaces/four-prong-solitaire-lab-grown-pendant/",
  name: "Four Prong Solitaire Lab-Grown Pendant",
  metal: "14k-yellow-gold",
  carat: 0.8,
  length: "16-18",
  shipsInDays: 3,
  image: { desktop: "product-necklace-solitaire-pendant-yellow-gold", alt: "" },
  quantity: 1,
  unitPrice: 1040,
  subtotal: 1040,
  total: 1040,
  available: true,
};
const bracelet: BagLine = {
  ...pendant,
  id: "demo-bracelet",
  handle: "beaded-bezel-lab-grown-tennis-bracelet",
  category: "bracelets",
  href: "/fine-jewelry/bracelets/beaded-bezel-lab-grown-tennis-bracelet/",
  name: "Beaded Bezel Lab-Grown Tennis Bracelet",
  carat: 1.5,
  length: "6-7",
  image: { desktop: "product-bracelet-beaded-tennis-yellow-gold", alt: "" },
  unitPrice: 2450,
  subtotal: 2450,
  total: 2450,
};

function Demo({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <figure className={`flex min-w-0 flex-col items-start gap-space-2 ${className ?? ""}`}>
      <div className="w-full">{children}</div>
      <figcaption className="type-ui-2xs-regular text-black-alpha-70">{label}</figcaption>
    </figure>
  );
}

const noop = () => undefined;

/**
 * Bag panel and bag page parts (Figma "Bag Overlay" 5011:77722, "Nav / Bag" 4990:74441, "Bag / Cart" 6579:196214,
 * "Bag Checkout" 6579:210059) and their modals, with sample lines. The care plan row, Edit links and Perfectly
 * Paired Wedding Bands are the newer design's additions, each behind a flag in src/content/bag.ts (bagFeatures).
 */
export function BagDemos() {
  const [quantity, setQuantity] = useState(1);
  const [modal, setModal] = useState<"credit" | "plan" | "info" | "plans" | "checkout" | null>(null);
  const close = () => setModal(null);
  const plan = bagContent.carePlan.plans[0];

  return (
    <div className="flex flex-col gap-space-10 text-primary-leather">
      <div className="flex flex-wrap items-start gap-space-8">
        <Demo label="Quanity Select (panel: gold border)">
          <QuantitySelect value={quantity} onChange={(value) => setQuantity(Math.max(1, value))} itemName="Sample" />
        </Demo>
        <Demo label="Quanity Select (bag page: black-alpha-20)">
          <QuantitySelect value={quantity} onChange={(value) => setQuantity(Math.max(1, value))} itemName="Sample" tone="neutral" />
        </Demo>
        <Demo label="Remove pill (the panel)">
          <PillButton>{bagContent.remove}</PillButton>
        </Demo>
        <Demo label="Remove (Button XS, as on Figma's tennis bracelet row: the bag page)">
          <Button size="xs" variant="secondary">
            {bagContent.remove}
          </Button>
        </Demo>
      </div>

      <Demo label="Shop All: the panel's checkout bar (leads to the bag page)" className="max-w-[24.375rem]">
        <CheckoutBar total={4729} href="#bag" />
      </Demo>

      <Demo label="Bag panel line" className="max-w-[21.875rem]">
        <ul>
          <BagPanelItem line={pendant} />
        </ul>
      </Demo>

      <div className="grid gap-space-10 ui-desktop:grid-cols-2">
        <Demo label="Bag line: Add a care plan (resize below 1024px for the mobile row)">
          <BagItem line={pendant} plan={{ status: "none" }} />
        </Demo>
        <Demo label="Bag line: care plan added">
          <BagItem line={pendant} plan={{ status: "added", plan }} />
        </Demo>
        <Demo label="Bag line: care plan no longer available (desktop checkout disabled)">
          <BagItem line={bracelet} plan={{ status: "unavailable", id: "retired" }} />
        </Demo>
        <Demo label="Bag line: item no longer available (Fine Jewelry version of the stone state)">
          <BagItem line={{ ...bracelet, id: "demo-unavailable", available: false }} plan={null} />
        </Demo>
      </div>

      <div className="flex flex-wrap items-start gap-space-10">
        <Demo label="Order Price, desktop column (disabled at 60% while something is unavailable)" className="w-[19.875rem]">
          <OrderPrice variant="column" subtotal={4740} discount={100} carePlans={89} total={4729} shipsInDays={10} blocked={false} onCheckout={() => setModal("checkout")} onLearnMore={() => setModal("credit")} />
        </Demo>
        <Demo label="Order Price, mobile card, something unavailable: stays dark and opens the notice (Discount shows only when the cart has one)" className="w-[21.875rem]">
          <OrderPrice variant="card" subtotal={1040} discount={0} carePlans={0} total={1040} shipsInDays={3} blocked onCheckout={() => setModal("checkout")} onLearnMore={() => setModal("credit")} />
        </Demo>
      </div>

      <div className="grid max-w-[51.375rem] gap-space-6 ui-desktop:grid-cols-2">
        <Demo label="Return Policy (desktop)">
          <BagInfoCard {...bagContent.returnPolicy} />
        </Demo>
        <Demo label="Sky Repairs (mobile)">
          <BagInfoCard {...bagContent.skyRepairs} />
        </Demo>
        <Demo label="Special Instructions (This is a Gift: mobile only)">
          <SpecialInstructions />
        </Demo>
      </div>

      <Demo label="Care plan row states, stand-alone" className="max-w-[38.125rem]">
        <div className="flex flex-col gap-space-4">
          <CarePlanRow state={{ status: "none" }} onAdd={() => setModal("plan")} onLearnMore={() => setModal("info")} onRemovePlan={noop} />
          <CarePlanRow state={{ status: "added", plan }} onAdd={() => setModal("plan")} onLearnMore={noop} onRemovePlan={noop} />
          <CarePlanRow state={{ status: "unavailable", id: "retired" }} onAdd={noop} onLearnMore={noop} onRemovePlan={noop} />
        </div>
      </Demo>

      <div className="flex flex-wrap gap-space-3">
        <Button size="sm" variant="secondary" onClick={() => setModal("credit")}>
          Modal - Credit
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setModal("plan")}>
          Modal / Care Plan
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setModal("info")}>
          Modal - JM Info
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setModal("plans")}>
          Modal / JM Info v2
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setModal("checkout")}>
          Checkout notice
        </Button>
      </div>
      <CreditModal open={modal === "credit"} onClose={close} />
      <CarePlanModal open={modal === "plan"} onClose={close} onAdd={close} />
      <CarePlanInfoModal open={modal === "info"} onClose={close} onLearnMore={() => setModal("plans")} />
      <ProtectionPlansModal open={modal === "plans"} onClose={close} />
      <CheckoutNoticeModal open={modal === "checkout"} onClose={close} />
    </div>
  );
}
