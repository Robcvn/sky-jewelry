"use client";

import { useState, type ReactNode } from "react";
import { AddressModal } from "@/components/account/AddressModal";
import { BackToOrders, OrderCard, OrderInfo, OrderSummary, ProductOrderDetail, RepairRequests } from "@/components/account/OrderParts";
import { AddressCard } from "@/components/account/ProfileView";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { customer, orders } from "@/content/account";
import type { ResolvedOrder, ResolvedOrderLine } from "@/lib/account";

const pendant: ResolvedOrderLine = {
  key: "demo-pendant",
  name: "Four Prong Solitaire Lab-Grown Pendant",
  href: "/fine-jewelry/necklaces/four-prong-solitaire-lab-grown-pendant/",
  image: { desktop: "product-necklace-solitaire-pendant-yellow-gold", alt: "" },
  metal: "14k-yellow-gold",
  carat: 0.8,
  length: "16-18",
  quantity: 1,
  price: 1040,
  certificate: true,
};
const bracelet: ResolvedOrderLine = {
  ...pendant,
  key: "demo-bracelet",
  name: "Beaded Bezel Lab-Grown Tennis Bracelet",
  image: { desktop: "product-bracelet-beaded-tennis-yellow-gold", alt: "" },
  carat: 1.5,
  length: "6-7",
  price: 2450,
  certificate: false,
};
const sample: ResolvedOrder = {
  ...orders[0],
  lines: [pendant, bracelet],
  subtotal: 3490,
  total: 3490 + orders[0].shipping - orders[0].discount + orders[0].taxes,
};

function Demo({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <figure className={`flex min-w-0 flex-col items-start gap-space-2 ${className ?? ""}`}>
      <div className="w-full">{children}</div>
      <figcaption className="type-ui-2xs-regular text-black-alpha-70">{label}</figcaption>
    </figure>
  );
}

/**
 * Account parts (Figma "Account - Profile", "Account - Orders", "Account - Order Details" and "Modal / Add Address")
 * with sample data. Resize below 1024px for the mobile versions; the pages are /account/, /account/orders/ and
 * /account/orders/<number>/.
 */
export function AccountDemos() {
  const [modal, setModal] = useState(0);
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-space-10 text-primary-leather">
      <Demo label="Order Card (Design System 3047:23455): status track, pieces, total" className="max-w-[51.375rem]">
        <OrderCard order={sample} />
      </Demo>
      <Demo label="Order Card on Order Details: no pieces, total or View Details" className="max-w-[51.375rem]">
        <OrderCard order={sample} compact headingLevel="p" />
      </Demo>
      <div className="flex flex-wrap items-start gap-space-10">
        <Demo label="Product Order Detail (3047:24488), with and without Download Certificate (inert)" className="w-full max-w-[29.25rem]">
          <ul className="flex flex-col gap-space-6">
            <ProductOrderDetail line={pendant} />
            <ProductOrderDetail line={bracelet} />
          </ul>
        </Demo>
        <Demo label="Order Summary (Order Price): Discount only when the order has one" className="w-[18.25rem]">
          <OrderSummary order={sample} />
        </Demo>
      </div>
      <Demo label="Shipment, payment (masked mock value) and addresses" className="max-w-[51.375rem]">
        <OrderInfo order={sample} />
      </Demo>
      <Demo label="Sky Repair Requests: Icon Block Type=Card; Request inert" className="max-w-[51.375rem]">
        <RepairRequests />
      </Demo>
      <div className="grid max-w-[51.375rem] gap-space-4 ui-desktop:grid-cols-2">
        <Demo label="Address card, default (Edit and Remove inert)">
          <ul>
            <AddressCard address={customer.addresses[0]} isDefault />
          </ul>
        </Demo>
        <Demo label="Address card">
          <ul>
            <AddressCard address={customer.addresses[1]} isDefault={false} />
          </ul>
        </Demo>
      </div>
      <div className="flex flex-wrap items-center gap-space-8">
        <Demo label="Back to Orders">
          <BackToOrders />
        </Demo>
        <Demo label="Checkbox Option MD (337:4884)">
          <Checkbox size="md" label="Set as default address" />
        </Demo>
        <Demo label="Modal / Add Address: try Save empty for the error state; saves stay in this browser">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setModal((count) => count + 1);
              setOpen(true);
            }}
          >
            Modal / Add Address
          </Button>
        </Demo>
      </div>
      <AddressModal key={modal} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
