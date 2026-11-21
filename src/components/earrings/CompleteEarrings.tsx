"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CreditModal } from "@/components/bag/BagModals";
import { TotalPrice } from "@/components/builder/CompleteRing";
import { DropHintModal } from "@/components/builder/DropHintModal";
import { settingTitle, settingVariant } from "@/components/builder/ring";
import { RingConfigChoice } from "@/components/builder/RingConfigChoice";
import { liveQuery, useIsClient, useQuery } from "@/components/builder/useQuery";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { IconLabelButton } from "@/components/ui/IconButton";
import { Modal } from "@/components/ui/Modal";
import { Picture } from "@/components/ui/Picture";
import { builderContent, shapeIcon } from "@/content/builder";
import { earringsContent } from "@/content/earrings";
import { metalById } from "@/content/metals";
import { productDetailContent } from "@/content/product-detail";
import { formatPrice } from "@/content/products";
import { addEarrings } from "@/lib/bag";
import type { EarringSetting, StonePair } from "@/lib/earrings";
import { useStoneAvailable } from "@/lib/stoneAvailability";
import { EarringSettingInfo, InstallmentsLine, MetalCard, settingGalleryOrder, ShipsAndIcons } from "./EarringSettingDetail";
import { EarringsDesktopGallery, EarringsMobileGallery } from "./EarringsGallery";
import { EarringsSteps, PairThumb } from "./EarringsSteps";
import { PairDiamondInfo, PairQualities } from "./PairDetail";
import { earringSettingHref, earringSettingsHref, pairHref, pairsHref, parseEarrings, type Earrings } from "./routes";

const text = earringsContent;
const ring = builderContent.complete;
const pdp = productDetailContent;

type CompleteEarringsProps = {
  settings: EarringSetting[];
  pairs: StonePair[];
  /** The page's closing sections (the reviews and the button cards), rendered once the earrings are shown. */
  children?: ReactNode;
};

/**
 * Earrings builder Step 3, "Complete" (Figma desktop Custom Earrings - Complete 3565:99574, mobile 3587:128540).
 * One static page: the earrings (?setting=&metal=&shape=&stone=) are read from the URL in the browser.
 * - No valid setting: back to Step 1. A setting but no valid pair: Step 2, keeping the earrings.
 * - Desktop: the 2 x 2 gallery (the studs, the model photo with Figma's badge, dots and arrow, and each diamond; the
 *   360 hint is placed on the studs and diamonds, hidden while SHOW_360 is off); the title and Drop a Hint; the setting row and the pair row; the total; Secure
 *   Checkout and Add to Bag (there is no size to choose); a Diamond Info block per stone; Setting Info; the accordions.
 * - Mobile: the gallery with the diamond thumbnail; Setting Info comes before the two Diamond Info blocks, and a
 *   qualities block per stone follows the page, as the mobile frame orders them.
 * - The pair's availability is read from the Storefront API, as the ring's stone is; when it is gone the page takes
 *   the ring builder's drawn "Stone Unavailable" state (inferred for earrings) and shows its modal once.
 */
export function CompleteEarrings({ settings, pairs, children }: CompleteEarringsProps) {
  const [search] = useQuery();
  const isClient = useIsClient();
  const router = useRouter();
  const earrings = parseEarrings(new URLSearchParams(search));
  const setting = settings.find((item) => item.handle === earrings.setting) ?? null;
  const pair = setting ? (pairs.find((item) => item.handle === earrings.stone) ?? null) : null;
  const available = useStoneAvailable(pair);
  const unavailable = Boolean(pair) && !available;
  const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState<"credit" | "hint" | "unavailable" | null>(null);
  const [hintKey, setHintKey] = useState(0);
  const unavailableShown = useRef(false);

  // Missing pieces: no valid setting goes to Step 1, a setting without a valid pair to Step 2. The URL is read as the
  // effect runs: right after a click into this page (Complete Earrings, the bag's Edit), the first render can still
  // see the previous page's query, and trusting it sent the shopper back.
  useEffect(() => {
    if (!isClient) return;
    const live = parseEarrings(liveQuery());
    const liveSetting = settings.find((item) => item.handle === live.setting) ?? null;
    const livePair = liveSetting ? (pairs.find((item) => item.handle === live.stone) ?? null) : null;
    if (!liveSetting) router.replace(earringSettingsHref());
    else if (!livePair) router.replace(pairsHref({ ...live, setting: liveSetting.handle }));
    // The earrings are read from the URL; re-run when it changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, search, setting, pair]);

  useEffect(() => {
    if (!unavailable || unavailableShown.current) return;
    unavailableShown.current = true;
    const frame = requestAnimationFrame(() => setDialog("unavailable"));
    return () => cancelAnimationFrame(frame);
  }, [unavailable]);

  const products = settings.map((item) => item.product);
  if (!isClient || !setting || !pair) {
    return (
      <>
        <EarringsSteps current={3} settings={products} />
        <div className="min-h-dvh" />
      </>
    );
  }

  const { product } = setting;
  const variant = settingVariant(product, earrings.metal);
  const settingName = settingTitle(product);
  const name = text.complete.name(settingName, pair.title);
  const linked: Partial<Earrings> = { setting: setting.handle, metal: variant.metal, shape: pair.shape as Earrings["shape"] };
  const total = variant.price + pair.price;
  const shipsInDays = Math.max(product.shipsInDays ?? 0, pair.shipsInDays);
  const { photos, model, mobile } = settingGalleryOrder(product, variant.metal);
  const newPairsHref = pairsHref(linked);
  const close = () => setDialog(null);

  const addArgs = { setting: product, settingVariant: variant, pair, name: settingName };
  const add = async () => {
    setBusy(true);
    await addEarrings(addArgs);
    setBusy(false);
  };
  // Secure Checkout adds the earrings and goes to the bag page, as on the ring builder's Step 3.
  const checkout = async () => {
    setBusy(true);
    const result = await addEarrings(addArgs, { openPanel: false });
    setBusy(false);
    if (result.ok) router.push("/bag/");
  };

  const [a, b] = pair.stones;

  return (
    <>
      <EarringsSteps current={3} settings={products} pair={pair} pairUnavailable={unavailable} />

      <div className="ui-desktop:site-container ui-desktop:grid ui-desktop:grid-cols-[minmax(0,718fr)_minmax(0,506fr)] ui-desktop:gap-space-6">
        <div className="hidden ui-desktop:block">
          <div className="sticky top-(--sticky-header-height) py-space-15 pr-space-6">
            <EarringsDesktopGallery
              tiles={[
                { key: "front", kind: "photo", image: photos.front, hint360: true, priority: true },
                { key: "model", kind: "model", images: model, name, badge: text.complete.shownWith },
                { key: "a", kind: "stone", stone: a, hint360: true },
                { key: "b", kind: "stone", stone: b, hint360: true },
              ]}
            />
          </div>
        </div>
        <div className="ui-desktop:hidden">
          <EarringsMobileGallery photos={mobile} stone={a} name={name} />
        </div>

        <div className="site-container flex flex-col gap-space-6 pt-space-5 pb-space-11 ui-desktop:gap-space-8 ui-desktop:px-0 ui-desktop:py-space-15">
          {/* Title and Drop a Hint (desktop frame only), side by side. */}
          <div className="flex items-start justify-between gap-space-4">
            <h1 className="type-heading-md text-primary-leather ui-desktop:max-w-[25.9375rem]">{name}</h1>
            <div className="hidden shrink-0 ui-desktop:block">
              <IconLabelButton
                icon="mail"
                layout="stack"
                onClick={() => {
                  setHintKey((key) => key + 1);
                  setDialog("hint");
                }}
              >
                {ring.dropHint}
              </IconLabelButton>
            </div>
          </div>

          <div className="flex flex-col gap-space-4">
            <RingConfigChoice
              icon="setting"
              image={<Picture image={{ ...photos.front, alt: "" }} sizes={{ desktop: "40px", mobile: "40px" }} className="size-full object-cover mix-blend-multiply" />}
              sentenceCase
              name={settingName}
              summary={metalById(variant.metal).label}
              price={formatPrice(variant.price)}
              actions={[
                { label: ring.edit, href: earringSettingHref(setting.handle, linked), context: `: ${settingName}` },
                { label: ring.remove, href: earringSettingsHref(), context: `: ${settingName}` },
              ]}
            />
            <RingConfigChoice
              icon={shapeIcon(pair.shape)}
              image={<PairThumb pair={pair} size="20px" />}
              sentenceCase
              name={pair.title}
              summary={`${pair.color} • ${pair.clarity}`}
              price={formatPrice(pair.price)}
              actions={[
                { label: ring.view, href: pairHref(pair.handle, linked), context: `: ${pair.title}` },
                { label: ring.remove, href: newPairsHref, context: `: ${pair.title}` },
              ]}
              unavailable={unavailable ? { message: text.unavailable.row, action: { label: text.unavailable.selectNew, href: newPairsHref } } : null}
            />
          </div>

          <TotalPrice total={total} struck={unavailable} />

          <div className="flex flex-col gap-space-4">
            <div className="flex flex-col gap-space-3 ui-desktop:gap-space-4">
              {unavailable ? (
                <ButtonLink href={newPairsHref} className="w-full">
                  {text.unavailable.button}
                </ButtonLink>
              ) : (
                <Button leftIcon="security-card" className="w-full" disabled={busy} onClick={checkout}>
                  {ring.secureCheckout}
                </Button>
              )}
              <Button variant="secondary" leftIcon="bag" className="w-full" disabled={busy || unavailable} onClick={add}>
                {ring.addToBag}
              </Button>
            </div>
            <InstallmentsLine price={total} onLearnMore={() => setDialog("credit")} />
          </div>

          <ShipsAndIcons days={shipsInDays} />

          <div className="flex flex-col gap-space-5 ui-desktop:gap-space-8">
            {/* Mobile: Setting Info first (3587:128540); desktop puts it after the diamonds, as an accordion row. */}
            <EarringSettingInfo metal={variant.metal} headingId="complete-setting-info-mobile" className="pt-[calc(var(--spacing-space-5)-1px)] ui-desktop:hidden" />
            <PairDiamondInfo pair={pair} idPrefix="complete-pair-info" />
            {/*
              Desktop: a gold rule, then the Setting Info row (Figma's Accordion Item over the Metal card, 3565:99640)
              above Shipping and Return Policy. Mobile: Shipping and Return Policy only (Setting Info is above).
            */}
            <div className="ui-desktop:border-t ui-desktop:border-secondary-gold ui-desktop:pt-[calc(var(--spacing-space-8)-1px)]">
              <Accordion>
                <AccordionItem question={text.complete.settingInfo} icon="diamond-earrings" headingLevel={2} defaultOpen className="hidden ui-desktop:block">
                  <MetalCard metal={variant.metal} />
                </AccordionItem>
                <AccordionItem question="Shipping" icon="truck" headingLevel={2}>
                  {pdp.shipping(shipsInDays).map((paragraph) => (
                    <p key={paragraph}>{paragraph.replace("This piece", "Your earrings")}</p>
                  ))}
                </AccordionItem>
                <AccordionItem question="Return Policy" icon="package" headingLevel={2}>
                  {pdp.returns.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      <PairQualities pair={pair} desktop={false} />
      {children}

      <CreditModal open={dialog === "credit"} onClose={close} />
      <DropHintModal key={hintKey} open={dialog === "hint"} onClose={close} name={name} image={photos.front} ringSize={false} intro={text.setting.hintIntro} />
      <Modal
        open={dialog === "unavailable"}
        onClose={close}
        align="center"
        icon={<Icon name="stone-unavailable" size={64} className="text-state-error" />}
        heading={text.unavailable.modal.heading}
        body={text.unavailable.modal.body}
        actionsLayout="stack"
        primaryAction={{ label: text.unavailable.modal.primary, onClick: () => router.push(newPairsHref) }}
        secondaryAction={{ label: text.unavailable.modal.secondary, onClick: close }}
      />
    </>
  );
}
