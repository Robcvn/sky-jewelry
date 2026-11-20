"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { cx } from "@/components/ui/shared";
import { bagContent } from "@/content/bag";
import { metalById } from "@/content/metals";
import { formatCarat, formatPrice } from "@/content/products";
import { lengthLabel } from "@/components/plp/filters";
import type { BagLine } from "@/lib/bag";

/** "$1,250.00": the bag shows cents, as Figma does. */
export const formatMoney = (usd: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(usd);

/** The panel's "14K Yellow Gold / 16–18” / 0.80ct" line (Figma: metal / ring size / carat). */
export const lineSummary = (line: BagLine) =>
  [metalById(line.metal).label, line.length ? lengthLabel(line.length) : null, line.carat !== null ? `${formatCarat(line.carat)}ct` : null]
    .filter(Boolean)
    .join(" / ");

/** The bag page's attribute rows (Figma's tennis bracelet row: Metal, Carat, Size). Rings have no size in the catalogue. */
export const lineAttributes = (line: BagLine) =>
  [
    { label: bagContent.attributes.metal, value: metalById(line.metal).label },
    line.carat !== null ? { label: bagContent.attributes.carat, value: bagContent.attributes.caratValue(formatCarat(line.carat)) } : null,
    line.length ? { label: bagContent.attributes.size, value: lengthLabel(line.length) } : null,
  ].filter((item): item is { label: string; value: string } => item !== null);

export const unitPriceLabel = (line: BagLine) => `${formatPrice(line.unitPrice)} ${bagContent.currencySuffix}`;

type QuantitySelectProps = {
  value: number;
  onChange: (value: number) => void;
  /** The item, for the buttons' accessible names. */
  itemName: string;
  /** Figma draws the panel's selector with a gold border and the bag page's with black-alpha-20. */
  tone?: "gold" | "neutral";
  disabled?: boolean;
  max?: number;
  className?: string;
};

const PILL = "inline-flex h-space-8 shrink-0 items-center rounded-full border bg-secondary-skin text-primary-leather";

/** Figma "Quanity Select" (Design System, held until now): a 32px pill with minus, the count and plus. */
export function QuantitySelect({ value, onChange, itemName, tone = "gold", disabled = false, max = 10, className }: QuantitySelectProps) {
  const step = "ui-transition grid size-space-4 place-items-center rounded-full ui-hover:text-black-alpha-60 disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div
      role="group"
      aria-label={`${bagContent.quantity}, ${itemName}`}
      className={cx(PILL, "gap-[5px] px-[7px]", tone === "gold" ? "border-secondary-gold" : "border-black-alpha-20", className)}
    >
      <button type="button" aria-label={`${bagContent.decrease}, ${itemName}`} disabled={disabled} onClick={() => onChange(value - 1)} className={step}>
        <Icon name="minus" size={16} />
      </button>
      <span aria-live="polite" className="type-ui-xs-medium min-w-[5px] text-center">
        {value}
      </span>
      <button
        type="button"
        aria-label={`${bagContent.increase}, ${itemName}`}
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        className={step}
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}

/** The "Remove" pill that shares the Quanity Select shape (the panel, and the third row of the desktop bag page). */
export function PillButton({ tone = "gold", className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "gold" | "neutral" }) {
  return (
    <button
      type="button"
      className={cx(
        PILL,
        "ui-transition type-ui-xs-medium cursor-pointer px-[15px] ui-hover:border-primary-leather ui-hover:bg-secondary-peach disabled:cursor-not-allowed disabled:opacity-50",
        tone === "gold" ? "border-secondary-gold" : "border-black-alpha-20",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/** Small underlined caps link-style button (Figma overline/overline-xs/link): Edit, Learn More, Change, Remove Plan. */
export function LinkButton({ className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={cx("type-overline-xs-link ui-transition cursor-pointer text-primary-leather ui-hover:text-black-alpha-60", className)} {...rest}>
      {children}
    </button>
  );
}

/**
 * Figma "Shop All" (Design System, held until now): the 80px ivory bar under the bag panel with the total and
 * "Secure Checkout". It leads to the bag page, where checkout starts (Figma draws no page in between).
 */
export function CheckoutBar({ total, href = "/bag/", onNavigate, className }: { total: number; href?: string; onNavigate?: (event: MouseEvent<HTMLAnchorElement>) => void; className?: string }) {
  return (
    <div className={cx("flex h-space-15 shrink-0 items-center justify-center border-y border-primary-leather bg-secondary-ivory px-space-6", className)}>
      <Link href={href} onClick={onNavigate} className="ui-transition group inline-flex items-center gap-space-6 rounded-8 text-primary-leather">
        <span className="type-heading-caps-md">{formatMoney(total)}</span>
        <span className="type-overline-xs-medium inline-flex items-center gap-1 group-hover:text-black-alpha-60">
          {bagContent.secureCheckout}
          <Icon name="chevron-right" size={14} />
        </span>
      </Link>
    </div>
  );
}

/** "(5)" after the bag headings (Figma: body text set beside the heading's cap height). */
export function BagCount({ count, className }: { count: number; className?: string }) {
  return (
    <span className={cx("self-start", className)}>
      <span aria-hidden="true">({count})</span>
      <span className="sr-only">
        , {count} {count === 1 ? "item" : "items"}
      </span>
    </span>
  );
}
