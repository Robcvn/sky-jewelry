"use client";

import { useState, type ReactNode } from "react";
import { BuilderSteps } from "@/components/builder/BuilderSteps";
import { CccModal, type CccTab } from "@/components/builder/CccModal";
import { GradeRange } from "@/components/builder/GradeRange";
import { PromoCard } from "@/components/builder/PromoCard";
import { completeHref, settingHref, settingTitle, stoneHref, stonesHref } from "@/components/builder/ring";
import { StoneCard } from "@/components/builder/StoneCard";
import { StoneCertificateTile, StoneSizeGuideTile, StoneSpecsTile } from "@/components/builder/StoneDetailGallery";
import { StonePicture } from "@/components/builder/StonePicture";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { builderContent, DIAMOND_SCALES } from "@/content/builder";
import { productListContent } from "@/content/product-list";
import { formatPrice } from "@/content/products";
import type { RingSetting, Stone } from "@/lib/builder";

function Demo({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <figure className={`flex min-w-0 flex-col items-start gap-space-2 ${className ?? ""}`}>
      <div className="w-full">{children}</div>
      <figcaption className="type-ui-2xs-regular text-black-alpha-70">{label}</figcaption>
    </figure>
  );
}

type BuilderDemosProps = {
  setting: RingSetting;
  /** A round GIA diamond with a photo, a stone whose shape Figma has no photo of, and a stone from another lab. */
  round: Stone;
  drawn: Stone;
  otherLab: Stone;
};

const TABS: CccTab[] = ["cut", "color", "clarity"];

/**
 * Ring builder parts (Figma "Builder 1 - Setting", "Builder 1 - Setting Info", "Builder 2 - Stone", "Builder 2 - Stone
 * Info" and their modals) with catalogue data. The pages are /design-your-own/, /design-your-own/setting/<handle>/,
 * /design-your-own/stone/ and /design-your-own/stone/<handle>/; resize below 1024px for the mobile versions.
 */
export function BuilderDemos({ setting, round, drawn, otherLab }: BuilderDemosProps) {
  const [grades, setGrades] = useState<[number, number]>([1, 2]);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<CccTab>("cut");
  const promos = builderContent.settings.promos;
  const first = setting.product.variants[0];
  const ring = { setting: setting.handle, metal: first.metal, shape: "round" as const };

  return (
    <div className="flex flex-col gap-space-10 text-primary-leather">
      <Demo label="Step bar (BuilderSteps): Step 1 current. On Step 2 the first step shows the setting named in the URL, with Edit and Remove.">
        <BuilderSteps current={1} />
      </Demo>

      <div className="flex flex-wrap items-start gap-space-10">
        <Demo label="Setting card: Product Card with the builder's name, its with-stone note and Choose Setting (hover on desktop)" className="w-75 pb-space-15">
          <ProductCard
            product={setting.product}
            initialVariant={first}
            labels={productListContent.card}
            onQuickView={() => undefined}
            builder={{
              title: settingTitle(setting.product),
              href: (variant) => settingHref(setting.handle, { metal: variant.metal }),
              priceNote: (variant) => `${builderContent.settings.withStone} ${formatPrice(variant.price + round.price)}`,
              action: { label: builderContent.settings.chooseSetting, href: (variant) => stonesHref({ ...ring, metal: variant.metal }) },
            }}
          />
        </Demo>
        <Demo label="Stone card (Product Card, Type=Diamond): photo, stats row, with-setting note" className="w-75 pb-space-15">
          <StoneCard stone={round} href={stoneHref(round.handle, ring)} completeHref={completeHref({ ...ring, stone: round.handle })} settingPrice={first.price} onQuickView={() => undefined} />
        </Demo>
        <Demo label="Stone card for a shape Figma has no photo of: the shape's line drawing" className="w-75 pb-space-15">
          <StoneCard stone={drawn} href={stoneHref(drawn.handle, ring)} completeHref={completeHref({ ...ring, stone: drawn.handle })} settingPrice={null} onQuickView={() => undefined} />
        </Demo>
      </div>

      <div className="flex flex-wrap items-start gap-space-6">
        <Demo label="Promo Card, desktop 300 x 400" className="w-75">
          <PromoCard promo={promos[0]} breakpoint="desktop" className="flex" />
        </Demo>
        <Demo label="Promo Card, desktop two columns, 616 x 400" className="w-full max-w-154">
          <PromoCard promo={promos[1]} breakpoint="desktop" className="flex" />
        </Demo>
        <Demo label="Promo Card, mobile 171 x 264" className="w-[10.6875rem]">
          <PromoCard promo={promos[0]} breakpoint="mobile" className="flex" />
        </Demo>
        <Demo label="Promo Card, mobile full width, 350 x 228" className="w-[21.875rem]">
          <PromoCard promo={promos[1]} breakpoint="mobile" className="flex" />
        </Demo>
      </div>

      <div className="flex flex-wrap items-start gap-space-10">
        <Demo label="Grade slider (GradeRange): two handles over Figma's Slider Option segments; arrow keys move a handle" className="w-100">
          <GradeRange name="cut" options={DIAMOND_SCALES.cut} value={grades} onChange={setGrades} />
        </Demo>
        <Demo label="Modal - Filters Cut / Color / Clarity (opened by the question marks beside the filters)">
          <div className="flex gap-space-2">
            {TABS.map((item) => (
              <Button
                key={item}
                size="sm"
                variant="secondary"
                onClick={() => {
                  setTab(item);
                  setOpen(true);
                }}
              >
                Open on {item}
              </Button>
            ))}
          </div>
        </Demo>
      </div>

      <div className="flex flex-wrap items-start gap-space-6">
        <Demo label="Stone photo (StonePicture)" className="w-40">
          <div className="aspect-square overflow-hidden rounded-4 bg-[radial-gradient(var(--color-base-white),var(--color-secondary-skin))]">
            <StonePicture stone={round} sizes={{ desktop: "160px", mobile: "160px" }} />
          </div>
        </Demo>
        <Demo label="Specs tile, round (length and width in mm; table and depth in %)" className="w-[21.3125rem]">
          <StoneSpecsTile stone={round} />
        </Demo>
        <Demo label="Specs tile, a shape without a drawing" className="w-[21.3125rem]">
          <StoneSpecsTile stone={drawn} />
        </Demo>
        <Demo label="Carat size guide tile (the toggle swaps the photo: 2.5 is Figma’s, the other sizes are retouched from it)" className="w-[21.3125rem]">
          <StoneSizeGuideTile />
        </Demo>
        <Demo label="Certificate tile, GIA" className="w-[21.3125rem]">
          <StoneCertificateTile stone={round} />
        </Demo>
        <Demo label="Certificate tile, another lab (every lab shows the certificate icon and its name)" className="w-[21.3125rem]">
          <StoneCertificateTile stone={otherLab} />
        </Demo>
      </div>

      <CccModal open={open} onClose={() => setOpen(false)} tab={tab} onTabChange={setTab} />
    </div>
  );
}
