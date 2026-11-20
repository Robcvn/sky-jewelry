"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { MobileBar } from "@/components/site/HeaderParts";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { DialogShell, dialogPanelMotion } from "@/components/ui/Modal";
import { Picture } from "@/components/ui/Picture";
import { cx } from "@/components/ui/shared";
import { useIsDesktop } from "@/components/ui/useIsDesktop";
import { bagContent } from "@/content/bag";
import type { HeaderContent } from "@/content/site";
import { bagItems, closeBagPanel, removeLine, removeLines, setLineQuantity, useBag, type BagLine } from "@/lib/bag";
import { carePlansTotal, setCarePlan, useCarePlans } from "@/lib/carePlans";
import { BagPanelRing } from "./BagRing";
import { BagCount, CheckoutBar, lineSummary, PillButton, QuantitySelect, unitPriceLabel } from "./BagParts";

export const TILE_BG = "bg-[radial-gradient(var(--color-base-white),var(--color-secondary-skin))]";

/** One bag line in the panel (Figma "Product Card" in "Bag Overlay"): 120px photo, name, metal / size / carat, price, quantity and Remove. */
export function BagPanelItem({ line, busy = false, onNavigate }: { line: BagLine; busy?: boolean; onNavigate?: () => void }) {
  return (
    <li className="flex items-center gap-space-4">
      <Link href={line.href} onClick={onNavigate} tabIndex={-1} aria-hidden="true" className={cx("relative block size-[7.5rem] shrink-0 overflow-hidden rounded-4", TILE_BG)}>
        {line.image ? <Picture image={{ ...line.image, alt: "" }} sizes={{ desktop: "120px", mobile: "120px" }} className="size-full object-cover mix-blend-multiply" /> : null}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-space-2 py-space-2">
        <div className="flex flex-col gap-1">
          <h3 className="type-heading-sm">
            <Link href={line.href} onClick={onNavigate} className="ui-transition rounded-4 ui-hover:text-black-alpha-60">
              {line.name}
            </Link>
          </h3>
          <p className="type-ui-xs-medium">{lineSummary(line)}</p>
          <p className="type-ui-xs-medium">{unitPriceLabel(line)}</p>
          {!line.available ? <p className="type-ui-xs-medium text-state-error">{bagContent.unavailable}</p> : null}
        </div>
        <div className="flex items-center gap-1.5">
          <QuantitySelect value={line.quantity} itemName={line.name} disabled={busy || !line.available} onChange={(quantity) => void setLineQuantity(line.id, quantity)} />
          <PillButton disabled={busy} onClick={() => void removeLine(line.id)} aria-label={`${bagContent.remove}, ${line.name}`}>
            {bagContent.remove}
          </PillButton>
        </div>
      </div>
    </li>
  );
}

function PanelBody({ headingId, onNavigate }: { headingId: string; onNavigate: () => void }) {
  const { bag, error, busyLine, loaded } = useBag();
  return (
    <>
      <div className="flex items-start gap-1.5 pr-space-10">
        <h2 id={headingId} className="type-heading-caps-md">
          {bagContent.panelHeading}
        </h2>
        <BagCount count={bag.count} className="type-body-sm-regular" />
      </div>
      {error ? (
        <p role="alert" className="type-ui-xs-medium flex items-center gap-space-2 text-state-error">
          <Icon name="warning-circle" size={16} />
          {error}
        </p>
      ) : null}
      {loaded && bag.lines.length === 0 ? <p className="type-body-sm-regular">{bagContent.empty.message}</p> : null}
      <ul className="flex flex-col gap-space-5">
        {bagItems(bag.lines).map((item) =>
          item.kind === "ring" ? (
            <BagPanelRing
              key={item.key}
              ring={item}
              busy={item.lines.some((line) => line.id === busyLine)}
              onNavigate={onNavigate}
              onRemove={() =>
                void removeLines(item.lines.map((line) => line.id)).then((removed) => {
                  if (removed) item.lines.forEach((line) => setCarePlan(line.id, null));
                })
              }
            />
          ) : (
            <BagPanelItem key={item.key} line={item.line} busy={busyLine === item.line.id} onNavigate={onNavigate} />
          ),
        )}
      </ul>
    </>
  );
}

type BagPanelProps = {
  content: HeaderContent;
  bagLabel: string;
  /** Mobile: distance from the top of the viewport to the header row, so the announcement bar stays visible. */
  getTop?: () => number;
};

/**
 * The bag panel, opened by the header's Bag link and by every Add to Bag. Desktop: Figma "Bag Overlay"
 * (5011:77722), a 390px dialog at the top right. Mobile: Figma "Nav / Bag" (4990:74441), a full screen under the
 * header row with a back row and the checkout bar fixed at the bottom (the frame ends just above that bar).
 */
export function BagPanel({ content, bagLabel, getTop }: BagPanelProps) {
  const { bag, panelOpen } = useBag();
  const plans = useCarePlans();
  const isDesktop = useIsDesktop();
  const headingId = useId();
  const total = bag.total + carePlansTotal(bag.lines, plans);
  const close = () => closeBagPanel();
  const onLink = (event?: MouseEvent<HTMLAnchorElement>) => {
    if (event && (event.metaKey || event.ctrlKey || event.shiftKey)) return;
    close();
  };

  if (isDesktop)
    return (
      <DialogShell open={panelOpen} onClose={close} labelledBy={headingId} placement="top-end">
        {({ visible }) => (
          <div
            className={cx(
              "relative flex max-h-[calc(100dvh-var(--spacing-space-12))] w-[24.375rem] flex-col overflow-hidden rounded-8 bg-secondary-skin text-primary-leather shadow-lg ring-1 ring-black-alpha-2",
              dialogPanelMotion(visible),
            )}
          >
            <IconButton icon="close" label={bagContent.close} size="md" variant="ghost" onClick={close} className="absolute top-space-6 right-space-4 z-10" />
            <div className="flex min-h-0 flex-col gap-space-8 overflow-y-auto overscroll-contain px-space-5 pt-space-6 pb-space-10">
              <PanelBody headingId={headingId} onNavigate={() => onLink()} />
            </div>
            <CheckoutBar total={total} onNavigate={onLink} />
          </div>
        )}
      </DialogShell>
    );

  return panelOpen ? <MobileBagScreen content={content} bagLabel={bagLabel} getTop={getTop} headingId={headingId} total={total} onClose={close} /> : null;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function MobileBagScreen({ content, bagLabel, getTop, headingId, total, onClose }: BagPanelProps & { headingId: string; total: number; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [top] = useState(() => getTop?.() ?? 0);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const returnTo = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => {
      root.style.overflow = previous;
      returnTo?.focus();
    };
  }, []);

  // Escape closes the screen even when focus has left it (e.g. after Remove takes the focused button away).
  useEffect(() => {
    const onEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onClose();
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [onClose]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !ref.current) return;
    const items = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  // Following a link closes the screen (the page underneath changes).
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest("a[href]")) onClose();
  };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      onKeyDown={onKeyDown}
      onClick={onClick}
      style={{ top }}
      className="fixed inset-x-0 bottom-0 z-50 flex flex-col bg-secondary-skin text-primary-leather transition-opacity duration-200 ease-out starting:opacity-0 ui-desktop:hidden"
    >
      <MobileBar content={content} bagLabel={bagLabel} menuOpen onMenuClick={onClose} menuButtonRef={closeRef} />
      <div className="relative flex h-space-12 shrink-0 items-center justify-center border-b border-primary-leather bg-secondary-ivory px-space-4">
        <button type="button" onClick={onClose} aria-label={bagContent.close} className="ui-transition absolute left-space-4 grid size-space-6 place-items-center rounded-4 ui-hover:text-black-alpha-60">
          <Icon name="chevron-left" size={24} />
        </button>
        <p className="type-ui-sm-medium">{bagContent.panelBack}</p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-space-10 overflow-y-auto overscroll-contain px-space-5 pt-space-11 pb-space-11">
        <PanelBody headingId={headingId} onNavigate={() => undefined} />
      </div>
      <CheckoutBar total={total} />
    </div>
  );
}
