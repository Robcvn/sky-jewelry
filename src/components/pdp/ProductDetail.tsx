"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { BagToast, type BagNotice } from "@/components/plp/BagToast";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { IconBlock } from "@/components/ui/IconBlock";
import { CompositionChart, DimensionsDiagram, InfoScale, ProductInfoCard } from "@/components/ui/ProductInfoCard";
import { metalComposition, productDetailContent } from "@/content/product-detail";
import { formatInstallment, formatPrice, variantName, type Product, type ProductVariant } from "@/content/products";
import { addToBag } from "@/lib/bag";
import { DesktopGallery, MobileGallery } from "./Gallery";
import { CaratPicker, MetalPicker, MobileMetalPicker } from "./OptionPickers";
import { caratsFor, findVariant, metalLabel, metalsOf, pieceIcon, pieceNoun, stoneFacts, variantFromQuery, variantQuery } from "./productFacts";

const content = productDetailContent;
const { labels } = content;

const QUERY_EVENT = "pdp:querychange";
const subscribe = (listener: () => void) => {
  window.addEventListener("popstate", listener);
  window.addEventListener(QUERY_EVENT, listener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener(QUERY_EVENT, listener);
  };
};

/**
 * The selected variant, kept in the URL (?metal=14k-white-gold&carat=1.00) so it survives a reload and can be
 * shared. The static HTML shows the default variant; the URL's variant applies as the page hydrates.
 */
function useVariant(product: Product) {
  const search = useSyncExternalStore(subscribe, () => window.location.search, () => "");
  const variant = search ? variantFromQuery(product, search) : product.variants[0];
  const setVariant = useCallback(
    (next: ProductVariant) => {
      const query = variantQuery(product, next);
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
      window.dispatchEvent(new Event(QUERY_EVENT));
    },
    [product],
  );
  return [variant, setVariant] as const;
}

const mm = (n: number) => n.toFixed(2);

/**
 * Product Detail, top of the page (Figma desktop 3565:98312, mobile 3587:127149 and 3587:127150): the
 * gallery, the buying area, and the Info / Stone Info blocks with the accordions.
 */
export function ProductDetail({ product }: { product: Product }) {
  const [variant, setVariant] = useVariant(product);
  const [notice, setNotice] = useState<BagNotice | null>(null);
  const [busy, setBusy] = useState(false);
  const name = variantName(product, variant);
  const metals = metalsOf(product);
  const carats = caratsFor(product, variant.metal);
  const stone = stoneFacts(product, variant);
  const noun = pieceNoun(product);
  const icon = pieceIcon(product);
  const [dollar, amount] = [formatPrice(variant.price).slice(0, 1), formatPrice(variant.price).slice(1)];

  const add = async () => {
    setBusy(true);
    const result = await addToBag(variant.id);
    setBusy(false);
    setNotice({ id: Date.now(), tone: result.ok ? "success" : "error", text: result.ok ? `Added to bag: ${name}` : `Couldn't add ${name} to the bag. Please try again.` });
  };
  const dismiss = useCallback(() => setNotice(null), []);

  const sectionHeading = (title: string, headingIcon: Parameters<typeof Icon>[0]["name"]) => (
    <h2 className="type-heading-sm flex items-center gap-space-2 text-primary-leather ui-desktop:type-heading-md ui-desktop:gap-space-3">
      <Icon name={headingIcon} size={24} className="ui-desktop:hidden" />
      <Icon name={headingIcon} size={32} className="hidden ui-desktop:block" />
      {title}
    </h2>
  );

  const detailsRows: Array<[string, string]> = [
    ...(variant.sku ? [["SKU", variant.sku] as [string, string]] : []),
    ...(stone?.shape ? [["Stone Shape", stone.shape[0].toUpperCase() + stone.shape.slice(1)] as [string, string]] : []),
    ["Material", metalLabel(variant.metal)],
    ...(product.length ? [["Length", `${product.length.replace("-", "–")}”`] as [string, string]] : []),
  ];
  const stoneRows: Array<[string, string]> = stone
    ? [
        ["Carat", `${stone.carat.toFixed(2)}ct${stone.kind === "single" ? "" : " total"}`],
        ["Type", stone.type],
        ...(stone.color ? [["Color", stone.color.grade] as [string, string]] : []),
        ...(stone.clarity ? [["Clarity", stone.clarity.grade] as [string, string]] : []),
      ]
    : [];

  return (
    <div className="ui-desktop:site-container ui-desktop:grid ui-desktop:grid-cols-[minmax(0,718fr)_minmax(0,506fr)] ui-desktop:gap-space-6">
      <div className="hidden ui-desktop:block">
        <div className="sticky top-0 py-space-15">
          <DesktopGallery product={product} variant={variant} name={name} />
        </div>
      </div>
      <div className="ui-desktop:hidden">
        <MobileGallery product={product} variant={variant} name={name} />
      </div>

      <div className="site-container flex flex-col gap-space-6 pt-space-5 pb-space-11 ui-desktop:gap-space-8 ui-desktop:px-0 ui-desktop:py-space-15">
        {/* Title, price and the pickers */}
        <div className="flex flex-col gap-space-6">
          <div className="flex flex-col gap-space-4 ui-desktop:gap-space-3">
            <div className="flex items-start justify-between gap-space-4">
              <h1 className="type-heading-md text-primary-leather">{name}</h1>
              {/* Drop a hint opens a held modal: shown as designed, not interactive yet. */}
              <span className="hidden shrink-0 flex-col items-center gap-0.5 text-primary-leather ui-desktop:inline-flex">
                <Icon name="mail" size={28} />
                <span className="type-overline-xs-link">{labels.dropHint}</span>
              </span>
            </div>
            {/* type-paragraph keeps the line box this price was built with (it used to come from the base <p> rule). */}
            <p className="type-paragraph text-primary-leather">
              <span className="type-heading-caps-xs">{dollar}</span>
              <span className="type-heading-caps-sm">{amount}</span>
            </p>
          </div>
          {carats.length ? (
            <CaratPicker carats={carats} value={variant.carat} onChange={(carat) => setVariant(findVariant(product, variant.metal, carat))} />
          ) : null}
          <div className="hidden ui-desktop:block">
            <MetalPicker metals={metals} value={variant.metal} onChange={(metal) => setVariant(findVariant(product, metal, variant.carat))} />
          </div>
          <div className="ui-desktop:hidden">
            <MobileMetalPicker metals={metals} value={variant.metal} onChange={(metal) => setVariant(findVariant(product, metal, variant.carat))} />
          </div>
        </div>

        {/* Buttons, installments, shipping, icon row */}
        <div className="flex flex-col gap-space-6">
          <div className="flex flex-col gap-space-3 ui-desktop:gap-space-4">
            <ButtonLink href={content.checkoutHref} leftIcon="security" className="w-full">
              {labels.secureCheckout}
            </ButtonLink>
            <Button variant="secondary" leftIcon="bag" className="w-full" disabled={busy || !variant.available} onClick={add}>
              {labels.addToBag}
            </Button>
          </div>
          <p className="type-body-xs-regular flex flex-wrap items-center justify-center gap-x-space-3 text-center text-primary-leather">
            <span>
              {labels.installments} <span className="font-medium">{formatInstallment(variant.price)}</span>
            </span>
            {/* Learn more opens the held Credit modal: shown as designed, not interactive yet. */}
            <span className="type-overline-xs-link">{labels.learnMore}</span>
          </p>
          {product.shipsInDays ? (
            <p className="type-ui-xs-regular flex items-center justify-center gap-space-2 text-primary-leather ui-desktop:type-body-sm-regular">
              <Icon name="truck" size={24} />
              {labels.shipsIn(product.shipsInDays)}
            </p>
          ) : null}
          <ul className="flex gap-space-2">
            {content.iconRow.map((item) => (
              <li key={item._key} className="flex flex-1">
                <IconBlock icon={item.icon} label={item.label} lines={item.lines} />
              </li>
            ))}
          </ul>
        </div>

        {/* Metal info */}
        <section aria-labelledby="pdp-metal-info" className="flex flex-col gap-space-5 border-t border-secondary-gold pt-space-6 ui-desktop:gap-space-8 ui-desktop:pt-space-8">
          <div id="pdp-metal-info">{sectionHeading(`${noun} ${labels.info}`, icon)}</div>
          <ProductInfoCard label={labels.metal} value={metalLabel(variant.metal)} note={content.metalNote}>
            <CompositionChart parts={metalComposition[variant.metal]} />
          </ProductInfoCard>
        </section>

        {stone ? (
          <section aria-labelledby="pdp-stone-info" className="flex flex-col gap-space-5 border-t border-secondary-gold pt-space-6 ui-desktop:gap-space-8 ui-desktop:pt-space-8">
            <div id="pdp-stone-info">{sectionHeading(labels.stoneInfo, (stone.shape as "round" | "oval" | "emerald") ?? "round")}</div>
            <div className="grid grid-cols-2 items-start gap-space-2 ui-desktop:gap-space-3">
              <ProductInfoCard
                label="Carat"
                value={stone.carat.toFixed(2)}
                note={stone.kind === "pair" ? content.caratNote.pair : stone.kind === "line" ? content.caratNote.line : content.caratNote.single}
                spread
                className="h-full"
              />
              {stone.color ? (
                <ProductInfoCard label="Color" value={stone.color.grade} note={stone.color.short || undefined}>
                  {stone.diamond ? <InfoScale kind="color" position={stone.color.position} label={`Color ${stone.color.grade} on a scale from colorless to tinted`} /> : null}
                </ProductInfoCard>
              ) : null}
              {stone.clarity ? (
                <ProductInfoCard label="Clarity" value={stone.clarity.grade} note={stone.clarity.short}>
                  <InfoScale kind="clarity" position={stone.clarity.position} label={`Clarity ${stone.clarity.grade} on a scale from flawless to included`} />
                </ProductInfoCard>
              ) : null}
              {stone.dimensions ? (
                <ProductInfoCard
                  label="Dimensions (mm)"
                  value={`${mm(stone.dimensions.length)} × ${mm(stone.dimensions.width)}`}
                  note={
                    <span className="flex items-end justify-between gap-space-2">
                      <span className="ui-desktop:hidden">{stone.shape === "round" ? <DimensionsDiagram /> : null}</span>
                      <span>
                        {labels.ratio}: {stone.dimensions.ratio.toFixed(2)}
                      </span>
                    </span>
                  }
                  spread
                  className="h-full"
                />
              ) : null}
              {stone.lab ? (
                <ProductInfoCard
                  label="Certification"
                  value={stone.lab}
                  // View Certificate needs a certificate file per stone, which the catalogue doesn't have: shown, not linked.
                  note={<span className="underline decoration-black-alpha-25 underline-offset-2">{labels.viewCertificate}</span>}
                  spread
                />
              ) : null}
            </div>
          </section>
        ) : null}

        <Accordion>
          <AccordionItem question={`${noun} ${labels.details}`} icon={icon} headingLevel={2} className="hidden ui-desktop:block">
            <div className="flex flex-col gap-space-4 ui-desktop:flex-row">
              {[
                { title: labels.details, rows: detailsRows },
                ...(stoneRows.length ? [{ title: stone?.kind === "single" ? labels.centerStone : labels.stones, rows: stoneRows }] : []),
              ].map((table) => (
                <div key={table.title} className="flex flex-1 flex-col gap-space-4 px-space-1 ui-desktop:px-space-2">
                  <h3 className="type-ui-sm-medium">{table.title}</h3>
                  <dl className="flex flex-col gap-space-2">
                    {table.rows.map(([term, value]) => (
                      <div key={term} className="type-ui-xs-regular flex gap-space-2">
                        <dt className="w-24 shrink-0">{term}</dt>
                        <dd className="font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </AccordionItem>
          <AccordionItem question="Shipping" icon="truck" headingLevel={2}>
            {content.shipping(product.shipsInDays ?? 3).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </AccordionItem>
          <AccordionItem question="Return Policy" icon="package" headingLevel={2}>
            {content.returns.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </AccordionItem>
        </Accordion>
      </div>

      <BagToast notice={notice} onDismiss={dismiss} />
    </div>
  );
}
