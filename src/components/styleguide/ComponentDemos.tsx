"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { Pagination, PaginationDots } from "@/components/ui/Pagination";
import { Tabs } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { TextButton } from "@/components/ui/TextButton";
import { DiamondTypeTiles, MetalTiles } from "@/components/plp/FilterControls";
import { Checkbox } from "@/components/ui/Checkbox";
import { NumberField } from "@/components/ui/NumberField";
import { OptionTile } from "@/components/ui/OptionTile";
import { ProductCard } from "@/components/ui/ProductCard";
import { RangeField } from "@/components/ui/RangeField";
import type { DiamondType } from "@/content/catalog-seed";
import type { MetalId } from "@/content/metals";
import { productListContent } from "@/content/product-list";
import { formatPrice, type Product } from "@/content/products";

export function ModalDemo({ layout = "row" }: { layout?: "row" | "stack" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {layout === "row" ? "Open modal" : "Open modal with stacked buttons"}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        heading="Are you sure you want to remove this item?"
        body="This removes the ring from your bag. You can add it again at any time."
        icon={layout === "stack" ? <Icon name="alert" size={48} className="text-state-error" /> : undefined}
        actionsLayout={layout}
        secondaryAction={{ label: "Cancel", onClick: () => setOpen(false) }}
        primaryAction={{ label: "Remove", onClick: () => setOpen(false) }}
      />
    </>
  );
}

export function PaginationDemo({ size = "md" }: { size?: "md" | "sm" }) {
  const [page, setPage] = useState(2);
  return <Pagination pageCount={5} currentPage={page} onPageChange={setPage} size={size} label={`Results pages, ${size}`} />;
}

export function PaginationDotsDemo({ overlay = false }: { overlay?: boolean }) {
  const [slide, setSlide] = useState(0);
  return <PaginationDots count={5} current={slide} onSelect={setSlide} overlay={overlay} label={overlay ? "Hero images" : "Product images"} />;
}

export function RemovableTagDemo() {
  const [visible, setVisible] = useState(true);

  return visible ? (
    <Tag leadingIcon="round" onRemove={() => setVisible(false)} removeLabel="Remove Round">
      Round
    </Tag>
  ) : (
    <TextButton onClick={() => setVisible(true)}>Restore tag</TextButton>
  );
}

export function RangeFieldDemo({ kind }: { kind: "price" | "carat" }) {
  const [value, setValue] = useState<[number, number]>(kind === "price" ? [600, 4200] : [0.5, 3]);
  return kind === "price" ? (
    <RangeField name="price" min={500} max={9500} step={100} value={value} onChange={setValue} format={formatPrice} className="w-72" />
  ) : (
    <RangeField name="carat weight" min={0.1} max={5} step={0.05} value={value} onChange={setValue} format={(n) => n.toFixed(2)} stepper className="w-72" />
  );
}

export function NumberFieldDemo({ stepper = false }: { stepper?: boolean }) {
  const [value, setValue] = useState(stepper ? 1.5 : 1200);
  return stepper ? (
    <NumberField label="Carat weight" value={value} onChange={setValue} min={0.5} max={6} step={0.05} format={(n) => n.toFixed(2)} stepper />
  ) : (
    <NumberField label="Price" value={value} onChange={setValue} min={500} max={9500} step={100} format={formatPrice} />
  );
}

export function CheckboxDemo() {
  const [checked, setChecked] = useState(["16-18"]);
  return (
    <div className="grid grid-cols-2 gap-space-4">
      {["14-16", "16-18", "18-20", "20-22"].map((length) => (
        <Checkbox
          key={length}
          label={`${length.replace("-", "–")}”`}
          checked={checked.includes(length)}
          onChange={() => setChecked((list) => (list.includes(length) ? list.filter((item) => item !== length) : [...list, length]))}
        />
      ))}
    </div>
  );
}

export function OptionTileDemo({ kind }: { kind: "metal" | "text" | "compact" }) {
  const [metals, setMetals] = useState<MetalId[]>(["14k-yellow-gold"]);
  const [diamond, setDiamond] = useState<DiamondType[]>([]);
  const [carat, setCarat] = useState("0.80");
  if (kind === "metal")
    return (
      <div className="w-70">
        <MetalTiles value={metals} onChange={setMetals} labelledBy="demo-metal-tiles" wrap />
      </div>
    );
  if (kind === "text")
    return (
      <div className="w-[21.875rem]">
        <DiamondTypeTiles value={diamond} onChange={setDiamond} labelledBy="demo-diamond-tiles" />
      </div>
    );
  return (
    <div role="radiogroup" aria-label="Carat weight" className="flex gap-space-2">
      {["0.50", "0.80", "1.00", "1.50"].map((value) => (
        <OptionTile key={value} type="radio" shape="compact" name="demo-carat" checked={carat === value} onChange={() => setCarat(value)}>
          {value}
        </OptionTile>
      ))}
    </div>
  );
}

export function ProductCardDemo({ product }: { product: Product }) {
  return (
    <div className="w-[18.75rem]">
      <ProductCard
        product={product}
        initialVariant={product.variants[0]}
        labels={productListContent.card}
        onAddToBag={() => {}}
        onQuickView={() => {}}
      />
    </div>
  );
}

export function GalleryTabsDemo() {
  const [tab, setTab] = useState("images");
  return (
    <div className="w-[24.375rem] max-w-full">
      <Tabs
        label="Views of the product"
        variant="line"
        size="sm"
        divider
        value={tab}
        onChange={setTab}
        items={[
          { id: "spin", label: "360° View" },
          { id: "images", label: "Images" },
        ]}
      />
    </div>
  );
}
