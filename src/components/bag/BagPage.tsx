"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ProductRows } from "@/components/sections/ProductRows";
import { Button, ButtonLink, ButtonText } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Picture } from "@/components/ui/Picture";
import { cx } from "@/components/ui/shared";
import { bagContent, bagFeatures, type CarePlanId } from "@/content/bag";
import { formatInstallment, type Product } from "@/content/products";
import { bagItems, removeLine, removeLines, setLineQuantity, useBag, type BagLine, type BagRingItem } from "@/lib/bag";
import { carePlanEligible, carePlansTotal, carePlanState, setCarePlan, useCarePlans, type CarePlanState } from "@/lib/carePlans";
import { BagCount, formatMoney, lineAttributes, LinkButton, QuantitySelect } from "./BagParts";
import { CarePlanInfoModal, CarePlanModal, CheckoutNoticeModal, CreditModal, ProtectionPlansModal } from "./BagModals";
import { TILE_BG } from "./BagPanel";
import { BagRingRow } from "./BagRing";

/* ---------- Care plan row (the newer design's addition; off with bagFeatures.carePlans) ---------- */

type CarePlanRowProps = {
  state: CarePlanState;
  onAdd: () => void;
  onLearnMore: () => void;
  onRemovePlan: () => void;
  className?: string;
};

/**
 * The care plan row of a bag line, in Figma's three states: "Add a care plan · from $89/year" with Learn More
 * (a question mark on mobile), the added plan with Change (Edit on mobile), and "no longer available" with
 * Remove Plan (Remove on mobile).
 */
export function CarePlanRow({ state, onAdd, onLearnMore, onRemovePlan, className }: CarePlanRowProps) {
  const c = bagContent.carePlan;
  if (state.status === "unavailable")
    return (
      <div role="alert" className={cx("flex items-start gap-space-3 rounded-4 border border-state-error p-[0.6875rem] ui-desktop:items-center ui-desktop:gap-space-6 ui-desktop:rounded-[5px]", className)}>
        <Icon name="security" size={24} className="shrink-0 text-state-error" />
        <div className="flex flex-1 flex-col gap-1">
          <p className="type-ui-sm-medium text-state-error">{c.unavailableTitle}</p>
          <p className="type-ui-xs-regular">{c.unavailableBody}</p>
          <LinkButton onClick={onRemovePlan} className="mt-1 w-fit ui-desktop:hidden">
            {c.removePlan.mobile}
          </LinkButton>
        </div>
        <LinkButton onClick={onRemovePlan} className="hidden ui-desktop:inline">
          {c.removePlan.desktop}
        </LinkButton>
      </div>
    );

  if (state.status === "added")
    return (
      <div className={cx("flex items-center gap-space-3 border-y border-black-alpha-20 py-space-3 ui-desktop:gap-space-6", className)}>
        <Icon name="security" size={24} className="shrink-0" />
        <div className="flex flex-1 flex-col gap-1">
          <p className="type-ui-sm-medium">{state.plan.rowName}</p>
          <p className="type-ui-xs-regular">
            {formatMoney(state.plan.price)} · {c.added}
          </p>
        </div>
        <LinkButton onClick={onAdd}>
          <span className="hidden ui-desktop:inline">{c.change.desktop}</span>
          <span className="ui-desktop:hidden">{c.change.mobile}</span>
          <span className="sr-only">: {state.plan.rowName}</span>
        </LinkButton>
      </div>
    );

  return (
    <div className={cx("flex items-center justify-between gap-space-6 border-y border-black-alpha-20 py-space-3 ui-desktop:min-h-space-12", className)}>
      <div className="flex flex-wrap items-center gap-x-space-2 gap-y-1">
        <button type="button" onClick={onAdd} className="type-overline-sm-medium ui-transition inline-flex cursor-pointer items-center gap-1 rounded-4 ui-hover:text-black-alpha-60">
          <Icon name="security" size={16} />
          {c.add}
        </button>
        <span aria-hidden="true" className="type-body-xs-regular text-black-alpha-30">
          •
        </span>
        <span className="type-body-xs-regular text-black-alpha-60">{c.from}</span>
        <button type="button" onClick={onLearnMore} aria-label={c.more} className="ui-transition grid size-space-5 cursor-pointer place-items-center rounded-full ui-hover:text-black-alpha-60 ui-desktop:hidden">
          <Icon name="question-mark" size={20} />
        </button>
      </div>
      <LinkButton onClick={onLearnMore} className="hidden ui-desktop:inline">
        {c.learnMore}
        <span className="sr-only">: {c.more.toLowerCase()}</span>
      </LinkButton>
    </div>
  );
}

/* ---------- Bag line ---------- */

type BagItemProps = {
  line: BagLine;
  busy?: boolean;
  plan?: CarePlanState | null;
  onAddPlan?: () => void;
  onPlanInfo?: () => void;
  onRemovePlan?: () => void;
  onQuantity?: (quantity: number) => void;
  onRemove?: () => void;
};

/**
 * A bag line on the bag page. Figma draws builder rings (a setting row and a stone row, each with Edit); the
 * Fine Jewelry row follows its "Beaded Bezel Tennis Bracelet" row: photo, name, Metal / Carat / Size, the care
 * plan row, then the price with the quantity selector and Remove. 188px photo on desktop, 72px on mobile.
 */
export function BagItem({ line, busy = false, plan = null, onAddPlan, onPlanInfo, onRemovePlan, onQuantity, onRemove }: BagItemProps) {
  const attributes = lineAttributes(line);
  return (
    <article data-bag-line className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-space-4 gap-y-space-3 ui-desktop:grid-cols-[11.75rem_minmax(0,1fr)] ui-desktop:gap-x-space-6 ui-desktop:gap-y-0">
      <Link
        href={line.href}
        tabIndex={-1}
        aria-hidden="true"
        className={cx("relative col-start-1 row-start-1 block aspect-square overflow-hidden rounded-4 ui-desktop:row-span-2", TILE_BG)}
      >
        {line.image ? <Picture image={{ ...line.image, alt: "" }} sizes={{ desktop: "188px", mobile: "72px" }} className="size-full object-cover mix-blend-multiply" /> : null}
      </Link>
      <h2 className="type-heading-sm col-start-2 row-start-1 self-center ui-desktop:type-heading-md ui-desktop:self-start">
        <Link href={line.href} className="ui-transition rounded-4 ui-hover:text-black-alpha-60">
          {line.name}
        </Link>
      </h2>
      <div className="col-span-2 flex flex-col ui-desktop:col-span-1 ui-desktop:col-start-2 ui-desktop:row-start-2">
        <div className="flex flex-col gap-space-2 py-space-2 ui-desktop:py-space-4">
          <dl className={cx("flex flex-col", !line.available && "opacity-50")}>
            {attributes.map((attribute) => (
              <div key={attribute.label} className="type-ui-xs-regular flex gap-space-2">
                <dt className="w-space-13 shrink-0 text-black-alpha-70">{attribute.label}</dt>
                <dd className={cx(!line.available && "line-through")}>{attribute.value}</dd>
              </div>
            ))}
          </dl>
          {!line.available ? <p className="type-ui-xs-medium text-state-error">{bagContent.unavailable}</p> : null}
        </div>
        {plan ? <CarePlanRow state={plan} onAdd={() => onAddPlan?.()} onLearnMore={() => onPlanInfo?.()} onRemovePlan={() => onRemovePlan?.()} /> : null}
        <div className="flex h-space-12 items-center justify-between gap-space-3">
          <p className={cx("type-ui-md-medium", !line.available && "type-ui-md-regular line-through opacity-50")}>{formatMoney(line.total)}</p>
          <div className="flex items-center gap-1.5">
            {line.available ? (
              <QuantitySelect value={line.quantity} itemName={line.name} tone="neutral" disabled={busy} onChange={(quantity) => onQuantity?.(quantity)} />
            ) : null}
            <Button size="xs" variant="secondary" disabled={busy} onClick={onRemove} aria-label={`${bagContent.remove}, ${line.name}`}>
              {bagContent.remove}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ---------- Order Price ---------- */

type OrderPriceProps = {
  subtotal: number;
  discount: number;
  carePlans: number;
  total: number;
  shipsInDays: number | null;
  /** Something is unavailable. Desktop draws Secure Checkout disabled at 60%; mobile draws it dark, so the card keeps it enabled. */
  blocked: boolean;
  onCheckout: () => void;
  onLearnMore: () => void;
  /** "column": the desktop side column; "card": the mobile bordered card. */
  variant: "column" | "card";
};

/** Figma "Order Price" (its rules are 0-height lines, so 15px padding sits beside each 1px border): Subtotal, Discount (only when the cart has one), Care Plans, Total, installments and Secure Checkout. */
export function OrderPrice({ subtotal, discount, carePlans, total, shipsInDays, blocked, onCheckout, onLearnMore, variant }: OrderPriceProps) {
  const headingId = useId();
  const row = "flex items-center justify-between gap-space-2";
  const label = variant === "column" ? "type-ui-xs-regular text-black-alpha-70" : "type-body-xs-regular text-black-alpha-70";
  return (
    <section
      aria-labelledby={headingId}
      className={cx("flex flex-col gap-space-4 text-primary-leather", variant === "card" ? "rounded-4 border border-black-alpha-20 p-[0.9375rem]" : "")}
    >
      <h2 id={headingId} className="type-heading-sm">
        {bagContent.orderPrice}
      </h2>
      <div className="flex flex-col gap-1 border-y border-black-alpha-20 py-[0.9375rem]">
        <dl className="flex flex-col gap-1">
          <div className={row}>
            <dt className={label}>{bagContent.subtotal}</dt>
            <dd className="type-body-xs-regular">{formatMoney(subtotal)}</dd>
          </div>
          {discount > 0 ? (
            <div className={row}>
              <dt className={label}>{bagContent.discount}</dt>
              <dd className="type-body-xs-regular">-{formatMoney(discount)}</dd>
            </div>
          ) : null}
          {bagFeatures.carePlans && carePlans > 0 ? (
            <div className={row}>
              <dt className={label}>{bagContent.carePlans}</dt>
              <dd className="type-body-xs-regular">{formatMoney(carePlans)}</dd>
            </div>
          ) : null}
        </dl>
        <p className="type-body-xs-regular text-black-alpha-70">{bagContent.shippingNote}</p>
      </div>
      <p className={cx(row, "type-body-sm-medium border-b border-black-alpha-20 pb-[0.9375rem]")}>
        <span>{bagContent.total}</span>
        <span>{formatMoney(total)}</span>
      </p>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="type-body-xs-regular text-black-alpha-70">
          {bagContent.installments} <span className="type-body-xs-medium text-primary-leather">{formatInstallment(total)}</span>
        </p>
        <button type="button" onClick={onLearnMore} className="type-overline-xs-link ui-transition cursor-pointer rounded-4 ui-hover:text-black-alpha-60">
          {bagContent.learnMore}
          <span className="sr-only">: payment plans</span>
        </button>
      </div>
      <Button size="md" disabled={blocked && variant === "column"} onClick={onCheckout} className={cx("w-full", variant === "column" && "mt-space-4")}>
        {bagContent.secureCheckout}
      </Button>
      <ul className={cx("type-body-xs-regular flex flex-col items-center gap-0.5", variant === "column" && "mt-space-4")}>
        {shipsInDays ? (
          <li className="flex items-center gap-1">
            <Icon name="truck" size={20} />
            {bagContent.shipsIn(shipsInDays)}
          </li>
        ) : null}
        <li className="flex items-center gap-1">
          <Icon name="shine" size={20} />
          {bagContent.returns}
        </li>
      </ul>
    </section>
  );
}

/* ---------- Info cards ---------- */

/** Figma's bordered "Return Policy" (desktop) / "Sky Repairs" (mobile) card. Its Learn More leads nowhere drawn: shown, not linked. */
export function BagInfoCard({ title, body, cta, className }: { title: string; body: string; cta: string; className?: string }) {
  return (
    <section className={cx("flex flex-col items-start gap-space-4 rounded-4 border border-black-alpha-20 px-space-4 pt-space-4 pb-space-6", className)}>
      <h2 className="type-heading-sm">{title}</h2>
      <p className="type-body-xs-regular ui-desktop:type-ui-xs-regular ui-desktop:text-black-alpha-70">{body}</p>
      <ButtonText size="sm" variant="secondary" className="ui-desktop:min-h-space-8 ui-desktop:px-space-3">
        {cta}
      </ButtonText>
    </section>
  );
}

const NOTE_KEY = "sky-bag-note";

/** Figma's "Special Instructions?" card. Mobile adds "This is a Gift". Kept in this browser only (checkout is simulated). */
export function SpecialInstructions({ className }: { className?: string }) {
  const noteId = useId();
  const [note, setNote] = useState(() => {
    if (typeof window === "undefined") return { text: "", gift: false };
    try {
      const saved = JSON.parse(window.localStorage.getItem(NOTE_KEY) ?? "null");
      return saved && typeof saved.text === "string" ? { text: saved.text as string, gift: Boolean(saved.gift) } : { text: "", gift: false };
    } catch {
      return { text: "", gift: false };
    }
  });
  const update = (next: { text: string; gift: boolean }) => {
    setNote(next);
    try {
      if (next.text || next.gift) window.localStorage.setItem(NOTE_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(NOTE_KEY);
    } catch {
      // Storage blocked: the note holds for this page view.
    }
  };
  return (
    <div className={cx("flex flex-col gap-space-4 rounded-4 border border-black-alpha-20 p-space-4", className)}>
      <label htmlFor={noteId} className="type-heading-sm">
        {bagContent.specialInstructions[0]}
        <br />
        {bagContent.specialInstructions[1]}
      </label>
      <label className="type-ui-sm-regular flex w-fit cursor-pointer items-center gap-space-2 ui-desktop:hidden">
        <input
          type="checkbox"
          checked={note.gift}
          onChange={(event) => update({ ...note, gift: event.target.checked })}
          className="size-space-5 cursor-pointer appearance-none rounded-full border border-black-alpha-50 bg-secondary-skin checked:border-[6px] checked:border-primary-leather"
        />
        {bagContent.gift}
      </label>
      <textarea
        id={noteId}
        value={note.text}
        onChange={(event) => update({ ...note, text: event.target.value })}
        rows={2}
        className="type-body-xs-regular min-h-[5.125rem] resize-none border-t border-black-alpha-20 bg-transparent pt-space-4 text-primary-leather outline-offset-2 ui-desktop:min-h-[3.875rem]"
      />
    </div>
  );
}

/* ---------- Page ---------- */

type Dialog =
  | { kind: "credit" }
  | { kind: "checkout" }
  | { kind: "plan"; lineId: string; initial: CarePlanId | null }
  | { kind: "planInfo"; lineId: string }
  | { kind: "plans"; lineId: string }
  | null;

/**
 * The bag page (/bag/). Desktop "Bag / Cart" (6579:196214): heading, then the lines, Return Policy and Special
 * Instructions, and Perfectly Paired Wedding Bands, beside the Order Price column. Mobile "Bag Checkout"
 * (6579:210059): heading, lines, Sky Repairs, Special Instructions, then the Order Price card.
 */
export function BagPage({ pairedBands }: { pairedBands: Product[] }) {
  const { bag, loaded, busyLine, error } = useBag();
  const plans = useCarePlans();
  const [dialog, setDialog] = useState<Dialog>(null);
  // Modals keep their content while closing: remember the last one opened.
  const [active, setActive] = useState<Dialog>(null);
  const open = (next: Exclude<Dialog, null>) => {
    setDialog(next);
    setActive(next);
  };

  const carePlans = carePlansTotal(bag.lines, plans);
  const total = bag.total + carePlans;
  const planOf = (line: BagLine) => (carePlanEligible(line) ? carePlanState(line.id, plans) : null);
  const blocked = bag.lines.some((line) => !line.available || planOf(line)?.status === "unavailable");
  const shipsInDays = bag.lines.reduce<number | null>((max, line) => (line.shipsInDays && line.shipsInDays > (max ?? 0) ? line.shipsInDays : max), null);
  const close = () => setDialog(null);

  const removeItem = async (line: BagLine) => {
    if (await removeLine(line.id)) setCarePlan(line.id, null);
  };
  // A built ring's two lines go together; its care plan is kept on the setting line.
  const removeRing = async (ring: BagRingItem) => {
    if (await removeLines(ring.lines.map((line) => line.id))) ring.lines.forEach((line) => setCarePlan(line.id, null));
  };
  const planRow = (line: BagLine) => {
    const plan = planOf(line);
    return plan ? (
      <CarePlanRow
        state={plan}
        onAdd={() => open({ kind: "plan", lineId: line.id, initial: (plans[line.id] as CarePlanId) ?? null })}
        onLearnMore={() => open({ kind: "planInfo", lineId: line.id })}
        onRemovePlan={() => setCarePlan(line.id, null)}
        className="-mt-px"
      />
    ) : null;
  };

  const orderPrice = (variant: "column" | "card") => (
    <OrderPrice
      variant={variant}
      subtotal={bag.subtotal}
      discount={bag.discount}
      carePlans={carePlans}
      total={total}
      shipsInDays={shipsInDays}
      blocked={blocked}
      onCheckout={() => open({ kind: "checkout" })}
      onLearnMore={() => open({ kind: "credit" })}
    />
  );

  return (
    <div className="site-container pt-space-8 pb-space-11 text-primary-leather ui-desktop:pt-space-15 ui-desktop:pb-space-15">
      <div className="flex justify-center gap-1.5 border-b border-primary-leather pb-[1.4375rem] ui-desktop:pb-[2.4375rem]">
        <h1 className="type-heading-caps-lg ui-desktop:type-heading-caps-xl">{bagContent.heading}</h1>
        {loaded ? <BagCount count={bag.count} className="type-body-md-regular" /> : null}
      </div>

      {error ? (
        <p role="alert" className="type-ui-xs-medium mt-space-6 flex items-center gap-space-2 text-state-error">
          <Icon name="warning-circle" size={16} />
          {error}
        </p>
      ) : null}

      {!loaded ? null : bag.lines.length === 0 ? (
        // Not drawn: a minimal empty state after the product list's (Deviations).
        <div className="flex flex-col items-center gap-space-6 py-space-15 text-center">
          <p className="type-heading-sm max-w-[24.875rem] ui-desktop:type-heading-md">{bagContent.empty.message}</p>
          <ButtonLink href={bagContent.backToShopping.href} size="responsive" variant="secondary">
            {bagContent.empty.cta}
          </ButtonLink>
        </div>
      ) : (
        <div className="ui-desktop:grid ui-desktop:grid-cols-[minmax(0,1fr)_19.875rem] ui-desktop:gap-x-[6.75rem]">
          <div className="flex min-w-0 flex-col gap-space-6 pt-space-8 ui-desktop:gap-space-10 ui-desktop:pt-space-10">
            <Link
              href={bagContent.backToShopping.href}
              className="type-overline-xs-medium ui-transition hidden w-fit items-center gap-1 rounded-4 ui-hover:text-black-alpha-60 ui-desktop:inline-flex"
            >
              <Icon name="arrow-left" size={16} />
              {bagContent.backToShopping.label}
            </Link>
            {bagItems(bag.lines).map((item) => {
              if (item.kind === "ring")
                return (
                  <BagRingRow
                    key={item.key}
                    ring={item}
                    busy={item.lines.some((line) => line.id === busyLine)}
                    carePlan={item.setting ? planRow(item.setting) : null}
                    onRemove={() => void removeRing(item)}
                  />
                );
              const { line } = item;
              return (
                <BagItem
                  key={item.key}
                  line={line}
                  busy={busyLine === line.id}
                  plan={planOf(line)}
                  onAddPlan={() => open({ kind: "plan", lineId: line.id, initial: (plans[line.id] as CarePlanId) ?? null })}
                  onPlanInfo={() => open({ kind: "planInfo", lineId: line.id })}
                  onRemovePlan={() => setCarePlan(line.id, null)}
                  onQuantity={(quantity) => void setLineQuantity(line.id, quantity)}
                  onRemove={() => void removeItem(line)}
                />
              );
            })}
            <div className="grid gap-space-6 ui-desktop:grid-cols-2">
              <BagInfoCard {...bagContent.returnPolicy} className="hidden ui-desktop:flex" />
              <BagInfoCard {...bagContent.skyRepairs} className="ui-desktop:hidden" />
              <SpecialInstructions />
            </div>
            <div className="ui-desktop:hidden">{orderPrice("card")}</div>
            {bagFeatures.pairedBands && pairedBands.length ? (
              <section aria-labelledby="bag-paired-bands" className="hidden flex-col gap-space-6 ui-desktop:flex [--grid-margin:0px]">
                <h2 id="bag-paired-bands" className="type-heading-md">
                  {bagContent.pairedBands.heading}
                </h2>
                <ProductRows
                  rows={[{ _key: "paired", products: pairedBands }]}
                  label={bagContent.pairedBands.heading}
                  itemClassName="w-[calc((100cqw-2*var(--spacing-space-6))/3)]"
                  cardWidth="(100cqw - 2 * var(--spacing-space-6)) / 3"
                />
              </section>
            ) : null}
          </div>
          <aside aria-label={bagContent.orderPrice} className="hidden border-l border-primary-leather pt-space-10 pl-space-10 ui-desktop:block">
            {orderPrice("column")}
          </aside>
        </div>
      )}

      <CreditModal open={dialog?.kind === "credit"} onClose={close} />
      <CheckoutNoticeModal open={dialog?.kind === "checkout"} onClose={close} />
      <CarePlanModal
        key={active?.kind === "plan" ? active.lineId : "plan"}
        open={dialog?.kind === "plan"}
        onClose={close}
        initial={active?.kind === "plan" ? active.initial : null}
        onAdd={(plan) => {
          if (active?.kind === "plan") setCarePlan(active.lineId, plan);
          close();
        }}
        onDecline={() => {
          // Not drawn: No Thanks on a reopened picker removes the line's plan (Deviations).
          if (active?.kind === "plan" && active.initial) setCarePlan(active.lineId, null);
          close();
        }}
      />
      <CarePlanInfoModal
        open={dialog?.kind === "planInfo"}
        onClose={close}
        onLearnMore={() => active?.kind === "planInfo" && open({ kind: "plans", lineId: active.lineId })}
      />
      <ProtectionPlansModal
        open={dialog?.kind === "plans"}
        onClose={close}
        onSelect={(plan) => {
          if (active?.kind === "plans") setCarePlan(active.lineId, plan);
          close();
        }}
      />
    </div>
  );
}
