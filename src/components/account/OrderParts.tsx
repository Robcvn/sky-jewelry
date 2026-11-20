import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Picture } from "@/components/ui/Picture";
import { ScrollArea } from "@/components/ui/Scrollbar";
import { StatusMarker } from "@/components/ui/StatusMarker";
import { TextButtonText } from "@/components/ui/TextButton";
import { cx } from "@/components/ui/shared";
import { lengthLabel } from "@/components/plp/filters";
import { accountContent, customer, formatOrderDate, orderHref, type AccountAddress } from "@/content/account";
import { metalById } from "@/content/metals";
import { formatCarat, formatMoney } from "@/content/products";
import type { ResolvedOrder, ResolvedOrderLine } from "@/lib/account";

const o = accountContent.orders;
const d = accountContent.detail;

/** Figma "Product Order Card" config line, e.g. "14K Yellow Gold, 16–18”, 0.80ct" (metal, length, carat). */
export const lineConfig = (line: ResolvedOrderLine) =>
  [metalById(line.metal).label, line.length ? lengthLabel(line.length) : null, line.carat !== null ? `${formatCarat(line.carat)}ct` : null]
    .filter(Boolean)
    .join(", ");

/** Figma "Product Order Detail" rows, as the bag page's Fine Jewelry rows: Metal, Carat, Size. */
export const lineAttributes = (line: ResolvedOrderLine) =>
  [
    { label: accountContent.attributes.metal, value: metalById(line.metal).label },
    line.carat !== null ? { label: accountContent.attributes.carat, value: accountContent.attributes.caratValue(formatCarat(line.carat)) } : null,
    line.length ? { label: accountContent.attributes.size, value: lengthLabel(line.length) } : null,
  ].filter((item): item is { label: string; value: string } => item !== null);

/** The product photo on Figma's skin tile (multiply), at the size each place draws. */
function OrderPhoto({ line, className, sizes }: { line: ResolvedOrderLine; className: string; sizes: { desktop: string; mobile: string } }) {
  return (
    <div className={cx("shrink-0 overflow-hidden bg-secondary-skin", className)}>
      {line.image ? <Picture image={line.image} sizes={sizes} className="size-full object-cover mix-blend-multiply" /> : null}
    </div>
  );
}

/** Figma "Status Marker" row: four steps, all reached for a delivered order. Desktop across, mobile down. */
function StatusTrack({ order }: { order: ResolvedOrder }) {
  const reached = o.steps.length; // Delivered: every step reached (the only status Figma draws).
  const last = o.steps.length - 1;
  return (
    <>
      <ol aria-label="Order status" className="relative hidden gap-space-2 pb-space-2 ui-desktop:flex">
        <span aria-hidden="true" className="absolute top-[3.5px] right-[-0.375rem] left-0 h-px bg-primary-leather" />
        {o.steps.map((step, index) => (
          <li key={step} className="relative min-w-0 flex-1">
            <StatusMarker completed={index < reached} delivered={index === last && order.status === "delivered"}>
              {step}
            </StatusMarker>
          </li>
        ))}
      </ol>
      <ol aria-label="Order status" className="relative flex flex-col gap-space-3 ui-desktop:hidden">
        <span aria-hidden="true" className="absolute top-space-2 bottom-space-4 left-[3.5px] w-px bg-primary-leather" />
        {o.steps.map((step, index) => (
          <li key={step} className="relative">
            <StatusMarker size="sm" completed={index < reached} delivered={index === last && order.status === "delivered"}>
              {step}
            </StatusMarker>
          </li>
        ))}
      </ol>
    </>
  );
}

type OrderCardProps = {
  order: ResolvedOrder;
  /** Order Details: the card without pieces, total or View Details (Figma's desktop card links to its own page: corrected). */
  compact?: boolean;
  /** The order number as a heading (Orders list); on Order Details the page has its own heading. */
  headingLevel?: "h2" | "h3" | "p";
};

/**
 * Figma "Order Card" (Design System 3047:23455): order number and date, the status badge and delivered date, View
 * Details, the status track, the pieces (up to four across on desktop, rows on mobile) and the total. Figma's
 * stroke is inside the card, so the padding is 1px less than Figma's next to the 1px border.
 */
export function OrderCard({ order, compact = false, headingLevel = "h3" }: OrderCardProps) {
  const Heading = headingLevel;
  const status = o.status[order.status];
  return (
    <article className="overflow-clip rounded-8 border border-black-alpha-20 text-primary-leather">
      <div className="flex flex-col gap-space-6 p-[1.1875rem] ui-desktop:gap-space-8 ui-desktop:p-[1.4375rem]">
        <div className="flex flex-col gap-space-6 ui-desktop:flex-row ui-desktop:items-center ui-desktop:gap-space-4">
          <div className="flex flex-col gap-space-3 ui-desktop:flex-1 ui-desktop:flex-row ui-desktop:flex-wrap ui-desktop:items-center ui-desktop:gap-x-space-10 ui-desktop:gap-y-space-3">
            <div className="type-body-sm-regular flex items-center gap-space-3 whitespace-nowrap">
              <Heading className="type-body-sm-regular">{o.orderNumber(order.number)}</Heading>
              <span aria-hidden="true" className="hidden h-space-4 w-px bg-gray-200 ui-desktop:block" />
              <p>{o.placed(formatOrderDate(order.placed))}</p>
            </div>
            <div className="flex items-center gap-space-3 ui-desktop:gap-space-4">
              <Badge variant="success" size="sm" className="ui-desktop:hidden">
                {status}
              </Badge>
              <span className="hidden ui-desktop:flex">
                <Badge variant="success">{status}</Badge>
              </span>
              <p className="type-body-sm-regular whitespace-nowrap">{formatOrderDate(order.delivered)}</p>
            </div>
          </div>
          {compact ? null : (
            <ButtonLink href={orderHref(order)} size="sm" variant="secondary" className="w-full ui-desktop:w-auto">
              {o.viewDetails}
              <span className="sr-only">, {o.orderNumber(order.number)}</span>
            </ButtonLink>
          )}
        </div>

        <StatusTrack order={order} />

        {compact ? null : (
          <ul className="flex flex-col gap-space-3 ui-desktop:grid ui-desktop:grid-cols-4 ui-desktop:gap-space-6">
            {order.lines.map((line) => (
              <li key={line.key} className="flex items-center gap-space-3 ui-desktop:flex-col ui-desktop:items-stretch">
                <OrderPhoto line={line} className="size-space-15 ui-desktop:aspect-square ui-desktop:size-auto" sizes={{ desktop: "176px", mobile: "80px" }} />
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="type-ui-sm-medium">{line.name}</p>
                  <p className="type-ui-xs-regular">{lineConfig(line)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {compact ? null : (
        <p className="type-body-sm-regular flex gap-space-2 bg-secondary-ivory px-space-5 py-space-4 ui-desktop:mt-space-8 ui-desktop:px-space-6">
          <span className="font-medium">{o.total}</span>
          <span>{formatMoney(order.total)}</span>
        </p>
      )}
    </article>
  );
}

/**
 * Figma "Product Order Detail" (Design System 3047:24488): photo (136px desktop, 120px mobile), name and price, the
 * attribute rows, and Download Certificate where the product page shows View Certificate. There are no certificate
 * files, so it is shown, inert (Held for review).
 */
export function ProductOrderDetail({ line }: { line: ResolvedOrderLine }) {
  return (
    <li className="flex items-center gap-space-4">
      <OrderPhoto line={line} className="size-[7.5rem] ui-desktop:size-[8.5rem]" sizes={{ desktop: "136px", mobile: "120px" }} />
      <div className="flex min-w-0 flex-1 flex-col gap-space-2">
        <div className="flex flex-col gap-1 ui-desktop:flex-row ui-desktop:items-center ui-desktop:gap-space-2">
          <h3 className="type-heading-xs ui-desktop:type-heading-sm min-w-0 ui-desktop:flex-1">{line.name}</h3>
          <p className="type-ui-xs-regular whitespace-nowrap ui-desktop:type-ui-sm-regular">{formatMoney(line.price * line.quantity)}</p>
        </div>
        <dl className="type-ui-2xs-regular flex flex-col ui-desktop:type-ui-xs-regular">
          {lineAttributes(line).map((row) => (
            <div key={row.label} className="flex gap-space-2">
              <dt className="w-space-13 shrink-0 text-black-alpha-70">{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        {line.certificate ? (
          <div className="pt-space-2">
            <TextButtonText size="sm" variant="caps" leadingIcon="download">
              {d.downloadCertificate}
            </TextButtonText>
          </div>
        ) : null}
      </div>
    </li>
  );
}

/** Figma "Order Summary" (Order Price): Subtotal, Shipping, Discount (only when there is one), Taxes, Total. */
export function OrderSummary({ order }: { order: ResolvedOrder }) {
  const rows = [
    { label: d.subtotal, value: formatMoney(order.subtotal) },
    { label: d.shipping, value: formatMoney(order.shipping) },
    order.discount > 0 ? { label: d.discount, value: `-${formatMoney(order.discount)}` } : null,
    { label: d.taxes, value: formatMoney(order.taxes) },
  ].filter((row): row is { label: string; value: string } => row !== null);
  return (
    <section aria-labelledby={`order-price-${order.number}`} className="flex flex-col gap-space-4 rounded-4 border border-black-alpha-20 p-[0.9375rem]">
      <h2 id={`order-price-${order.number}`} className="type-heading-sm">
        {d.orderPrice}
      </h2>
      <dl className="flex flex-col gap-1 border-t border-black-alpha-20 pt-[0.9375rem]">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-space-2">
            <dt className="type-body-xs-regular text-black-alpha-70">{row.label}</dt>
            <dd className="type-body-xs-regular">{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="type-body-sm-medium flex justify-between gap-space-2">
        <span>{d.total}</span>
        <span>{formatMoney(order.total)}</span>
      </p>
    </section>
  );
}

const addressLines = (address: AccountAddress) => [
  `${customer.firstName} ${customer.lastName}`,
  [address.address1, address.address2].filter(Boolean).join(" "),
  `${address.city}, ${address.state} ${address.zip}`,
  address.country,
];

/** An address as the cards and Order Details draw it: name, street, city line, country. */
export function AddressLines({ address, className }: { address: AccountAddress; className?: string }) {
  return (
    <address className={cx("not-italic", className)}>
      {addressLines(address).map((line, index) => (
        <span key={index} className="block">
          {line}
        </span>
      ))}
    </address>
  );
}

/** Shipment Method, Method of Payment (the masked mock value only), Shipping and Billing Address. */
export function OrderInfo({ order }: { order: ResolvedOrder }) {
  const address = (key: string) => customer.addresses.find((item) => item._key === key) ?? customer.addresses[0];
  const items = [
    { label: d.shipmentMethod, value: order.shipmentMethod },
    {
      label: d.payment,
      value: (
        <>
          <span aria-hidden="true">{order.payment}</span>
          <span className="sr-only">Card ending in {order.payment.replace(/\D/g, "")}</span>
        </>
      ),
    },
    { label: d.shippingAddress, value: <AddressLines address={address(order.shippingAddress)} /> },
    { label: d.billingAddress, value: <AddressLines address={address(order.billingAddress)} /> },
  ];
  return (
    <dl className="grid gap-space-4 ui-desktop:grid-cols-2 ui-desktop:gap-x-space-10 ui-desktop:gap-y-space-10">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1">
          <dt className="type-overline-xs-medium text-black-alpha-60">{item.label}</dt>
          <dd className="type-body-sm-regular ui-desktop:type-body-md-regular">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Figma "Sky Repair Requests": three "Icon Block" Type=Card (Design System 2760:23832). Desktop three across;
 * mobile a swipe row with the Figma scrollbar. Request has no drawn destination: shown, inert (Held for review).
 */
export function RepairRequests() {
  const r = d.repairs;
  return (
    <section aria-labelledby="repair-requests" className="flex flex-col gap-space-6">
      <div className="flex flex-col gap-space-2">
        <h2 id="repair-requests" className="type-heading-sm ui-desktop:type-heading-md">
          {r.heading}
        </h2>
        <p className="type-body-sm-regular ui-desktop:type-body-md-regular">{r.body}</p>
      </div>
      <ScrollArea
        label={`${r.heading}: services`}
        regionClassName="gap-space-4 ui-desktop:gap-space-6 mx-[calc(var(--grid-margin)*-1)] scroll-px-(--grid-margin) px-(--grid-margin) ui-desktop:mx-0 ui-desktop:overflow-visible ui-desktop:px-0"
        scrollbarClassName="mt-space-6 ui-desktop:hidden"
      >
        {r.blocks.map((block) => (
          <div
            key={block._key}
            className="flex w-[18rem] shrink-0 flex-col items-center gap-space-2 rounded-8 border border-secondary-gold bg-secondary-skin px-[0.9375rem] py-[1.4375rem] text-center ui-desktop:w-auto ui-desktop:flex-1"
          >
            <Icon name={block.icon as IconName} size={48} className={block.icon === "warranty" ? "text-primary-hazel" : undefined} />
            <div className="flex flex-1 flex-col items-center gap-space-4">
              <div className="flex flex-col gap-1">
                <h3 className="type-ui-sm-medium">{block.title}</h3>
                <p className="type-ui-xs-regular">{block.body}</p>
              </div>
              <TextButtonText size="sm" variant="caps" trailingIcon="chevron-right" className="mt-auto">
                {r.cta}
              </TextButtonText>
            </div>
          </div>
        ))}
      </ScrollArea>
    </section>
  );
}

/** "Back to Orders": Figma's Text Button with Arrow Left. */
export function BackToOrders() {
  return (
    <Link href={d.back.href} className="type-overline-xs-medium ui-transition-fast inline-flex w-max items-center gap-1 rounded-4 ui-hover:text-black-alpha-60">
      <Icon name="arrow-left" size={16} />
      {d.back.label}
    </Link>
  );
}
