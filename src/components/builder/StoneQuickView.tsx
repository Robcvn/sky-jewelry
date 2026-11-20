"use client";

import { useId, useState } from "react";
import { CreditModal } from "@/components/bag/BagModals";
import { ButtonLink } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { DialogShell, dialogPanelMotion } from "@/components/ui/Modal";
import { builderContent, shapeLabel } from "@/content/builder";
import type { Stone } from "@/lib/builder";
import { StoneInstallments, StonePrice, StoneStats } from "./StoneCard";
import { StonePicture } from "./StonePicture";

type StoneQuickViewProps = {
  stone: Stone;
  open: boolean;
  onClose: () => void;
  href: string;
  completeHref: string;
  settingPrice: number | null;
};

/**
 * Figma mobile "Modal / Stone Selection" (3587:126319, 390 x 646), opened by tapping a stone card on mobile: a white
 * sheet with 8px padding, the stone's photo (374 square) with a close button, the shape as the title, the price, the
 * Carat / Color / Clarity / Ratio row, Info and Complete Ring, and the installments line (Learn more opens the Credit
 * modal, as the product quick view). Figma's "360° View / Images" tabs are hidden: no stone has a 360° sequence.
 */
export function StoneQuickView({ stone, open, onClose, href, completeHref, settingPrice }: StoneQuickViewProps) {
  const id = useId();
  const [creditOpen, setCreditOpen] = useState(false);
  return (
    <>
      <DialogShell open={open} onClose={onClose} labelledBy={`${id}-title`}>
        {({ visible }) => (
          <div
            data-stone-sheet={stone.handle}
            className={`relative flex max-h-[calc(100dvh-var(--spacing-space-4))] w-full max-w-[24.375rem] flex-col overflow-y-auto overscroll-contain rounded-8 border border-black-alpha-5 bg-base-white p-space-2 text-primary-leather shadow-lg ${dialogPanelMotion(visible)}`}
          >
            <IconButton icon="close" label="Close" variant="ghost" size="md" onClick={onClose} className="absolute top-space-4 right-space-4 z-10" />
            <div className="relative aspect-square shrink-0 overflow-hidden rounded-4 bg-[radial-gradient(var(--color-base-white),var(--color-secondary-skin))]">
              <StonePicture stone={stone} sizes={{ desktop: "23rem", mobile: "min(23.375rem, 96vw)" }} />
            </div>
            <div className="flex flex-col gap-space-4 px-space-2 py-space-3">
              <div className="flex flex-col gap-space-1 text-center">
                <h2 id={`${id}-title`} className="type-heading-sm">
                  {shapeLabel(stone.shape)}
                  <span className="sr-only">: {stone.title}</span>
                </h2>
                <StonePrice stone={stone} settingPrice={settingPrice} className="type-ui-xs-regular" />
              </div>
              <StoneStats stone={stone} size="sheet" />
              <div className="flex gap-space-2">
                <ButtonLink href={href} size="sm" variant="secondary" className="w-19 shrink-0">
                  {builderContent.info}
                </ButtonLink>
                <ButtonLink href={completeHref} size="sm" rightIcon="chevron-right" className="flex-1">
                  {builderContent.stones.completeRing}
                </ButtonLink>
              </div>
              <StoneInstallments price={stone.price} onLearnMore={() => setCreditOpen(true)} />
            </div>
          </div>
        )}
      </DialogShell>
      <CreditModal open={creditOpen} onClose={() => setCreditOpen(false)} />
    </>
  );
}
