"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { Logo } from "@/components/site/Logo";
import { Button, ButtonText } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { DialogShell, dialogPanelMotion, Modal } from "@/components/ui/Modal";
import { RadioSelect } from "@/components/ui/Radio";
import { cx } from "@/components/ui/shared";
import { bagContent, carePlanInfoModal, carePlanModal, creditModal, protectionPlansModal, type CarePlanId } from "@/content/bag";
import { formatMoney } from "./BagParts";

type DialogProps = { open: boolean; onClose: () => void };

/** A wider "Modal - Default" container (612px or 1024px) for the content-heavy modals, with Figma's close button. */
function WideDialog({ open, onClose, width, label, children, footer }: DialogProps & { width: "md" | "lg"; label: string; children: (headingId: string) => ReactNode; footer?: ReactNode }) {
  const headingId = useId();
  return (
    <DialogShell open={open} onClose={onClose} labelledBy={headingId}>
      {({ visible }) => (
        <div
          className={cx(
            "relative flex max-h-[calc(100dvh-var(--spacing-space-6))] w-full flex-col overflow-hidden rounded-8 bg-secondary-skin text-primary-leather shadow-lg ring-1 ring-black-alpha-2 ui-desktop:max-h-[calc(100dvh-var(--spacing-space-12))]",
            width === "md" ? "ui-desktop:max-w-[38.25rem]" : "ui-desktop:max-w-[64rem]",
            dialogPanelMotion(visible),
          )}
          aria-label={label}
        >
          <IconButton icon="close" label="Close" size="xs" variant="ghost" onClick={onClose} className="absolute top-space-6 right-space-6 z-10" />
          <div className="min-h-0 overflow-y-auto overscroll-contain">
            {children(headingId)}
            {footer}
          </div>
        </div>
      )}
    </DialogShell>
  );
}

/**
 * Figma "Modal - Credit" (5019:79850): the installments "Learn more". Only the Affirm tab is drawn; the provider
 * names stand in for their logos (third-party marks, as with the GIA logo), and the Klarna tab and the arrows
 * are shown but inert (Held for review). Mobile isn't drawn: the same content in the mobile sheet.
 */
export function CreditModal({ open, onClose }: DialogProps) {
  return (
    <WideDialog open={open} onClose={onClose} width="md" label={creditModal.heading}>
      {(headingId) => (
        <>
          <div className="flex flex-col gap-space-8 px-space-5 pt-space-10 ui-desktop:px-space-8">
            <ul className="flex gap-space-8 border-b border-black-alpha-20 pr-space-10">
              {creditModal.providers.map((provider, index) => (
                <li
                  key={provider}
                  aria-current={index === 0 ? "true" : undefined}
                  className={cx("type-heading-md -mb-px pb-space-6", index === 0 ? "border-b border-primary-leather" : "text-black-alpha-20")}
                >
                  {provider}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-space-6">
              <div className="flex flex-col gap-space-2">
                <h2 id={headingId} className="type-heading-md">
                  {creditModal.heading}
                </h2>
                <p className="type-body-sm-regular text-black-alpha-70">{creditModal.body}</p>
              </div>
              {creditModal.groups.map((group) => (
                <div key={group._key} className="flex flex-col gap-space-3">
                  <p className="flex flex-col gap-1">
                    <span className="type-overline-sm-medium text-black-alpha-70">{creditModal.rangeLabel}</span>
                    <span className="type-body-sm-medium">{group.range}</span>
                  </p>
                  <ul className="flex flex-col gap-space-3">
                    {group.plans.map((plan) => (
                      <li key={plan._key} className="flex gap-space-2 rounded-4 border border-primary-leather px-space-4 py-3.5">
                        <span className="flex flex-1 flex-col gap-1">
                          <span className="type-ui-md-medium">{plan.title}</span>
                          <span className="type-ui-xs-regular text-black-alpha-70">{plan.body}</span>
                        </span>
                        <span className="flex flex-col items-end gap-0.5">
                          <span className="type-overline-2xs-medium inline-flex items-center gap-0.5 rounded-full border border-black-alpha-20 px-space-2 py-1">
                            <Icon name="money-back-guarantee" size={12} />
                            {creditModal.noInterest}
                          </span>
                          <span className="type-ui-xs-regular text-black-alpha-70">{plan.term}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-space-2 p-space-5 ui-desktop:p-space-8">
            <span aria-hidden="true" className="grid size-space-8 shrink-0 place-items-center rounded-full border border-black-alpha-20 text-black-alpha-20">
              <Icon name="chevron-left" size={16} />
            </span>
            <p className="type-ui-3xs-regular flex-1 text-center text-black-alpha-70">
              {creditModal.fineprint[0]}
              <br />
              {creditModal.fineprint[1]}
            </p>
            <span aria-hidden="true" className="grid size-space-8 shrink-0 place-items-center rounded-full border border-black-alpha-20">
              <Icon name="chevron-right" size={16} />
            </span>
          </div>
        </>
      )}
    </WideDialog>
  );
}

/**
 * Figma "Modal / Care Plan" (6579:196459) with its loading state (6579:196464): the plans load (mock, a short
 * pause), then the shopper picks one. Plans and prices are local content, not Shopify.
 */
export function CarePlanModal({
  open,
  onClose,
  initial,
  onAdd,
  onDecline,
  loadingMs = 500,
}: DialogProps & {
  initial?: CarePlanId | null;
  onAdd: (plan: CarePlanId) => void;
  /** No Thanks. When the picker reopens for an added plan (Change / Edit), the bag passes a handler that removes it. */
  onDecline?: () => void;
  loadingMs?: number;
}) {
  const name = useId();
  const [choice, setChoice] = useState<CarePlanId>(initial ?? "3-year");
  const [loading, setLoading] = useState(true);

  // Each opening starts on the loading state, as Figma's flow does, then shows the plans.
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setLoading(false), loadingMs);
    return () => {
      window.clearTimeout(timer);
      setLoading(true);
    };
  }, [open, loadingMs]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      heading={carePlanModal.heading}
      body={carePlanModal.body}
      secondaryAction={{ label: carePlanModal.noThanks, onClick: onDecline ?? onClose }}
      primaryAction={{ label: carePlanModal.add, disabled: loading, onClick: () => onAdd(choice) }}
    >
      {loading ? (
        <div role="status" className="flex h-[8.75rem] flex-col items-center justify-center gap-space-2 rounded-4 border border-dashed border-black-alpha-20">
          <Icon name="spinner-gap" size={32} className="motion-safe:animate-spin" />
          <span className="type-ui-sm-regular">{carePlanModal.loading}</span>
        </div>
      ) : (
        <fieldset className="flex flex-col gap-space-3">
          <legend className="sr-only">{carePlanModal.plansLabel}</legend>
          {bagContent.carePlan.plans.map((plan) => (
            <RadioSelect
              key={plan._key}
              name={name}
              value={plan._key}
              checked={choice === plan._key}
              onChange={() => setChoice(plan._key)}
              heading={plan.name}
              price={formatMoney(plan.price)}
            >
              {plan.provider}
            </RadioSelect>
          ))}
        </fieldset>
      )}
    </Modal>
  );
}

/** Figma "Modal - JM Info" (7260:61576): the care plan row's Learn More. Its own Learn More opens the plans table. */
export function CarePlanInfoModal({ open, onClose, onLearnMore }: DialogProps & { onLearnMore: () => void }) {
  return (
    <WideDialog open={open} onClose={onClose} width="md" label={carePlanInfoModal.heading}>
      {(headingId) => (
        <div className="flex flex-col gap-space-11 px-space-5 py-space-10 ui-desktop:px-space-8">
          <div className="flex flex-col gap-space-8">
            <p className="type-heading-md w-fit border-b border-primary-leather pb-space-6 pr-space-10">{carePlanInfoModal.provider}</p>
            <div className="flex flex-col gap-space-2">
              <h2 id={headingId} className="type-heading-md">
                {carePlanInfoModal.heading}
              </h2>
              <p className="type-body-xs-regular max-w-[27rem] text-black-alpha-70">{carePlanInfoModal.body}</p>
            </div>
            <ul className="grid gap-space-6 ui-desktop:grid-cols-3">
              {carePlanInfoModal.features.map((feature) => (
                <li key={feature._key} className="flex flex-col gap-1">
                  <Icon name={feature.icon as IconName} size={24} />
                  <span className="type-body-sm-medium">{feature.title}</span>
                  <span className="type-body-xs-regular text-black-alpha-70">{feature.body}</span>
                </li>
              ))}
            </ul>
          </div>
          <Button size="sm" variant="secondary" onClick={onLearnMore} className="w-full">
            {carePlanInfoModal.cta}
          </Button>
        </div>
      )}
    </WideDialog>
  );
}

const COLUMN_RULE = ["border-secondary-peach", "border-secondary-gold", "border-primary-hazel"];

function Coverage({ value }: { value: "yes" | "no" | "first-year" }) {
  if (value === "no")
    return (
      <span className="type-body-md-regular text-black-alpha-50">
        <span aria-hidden="true">—</span>
        <span className="sr-only">Not included</span>
      </span>
    );
  return (
    <span className="flex flex-col items-center">
      <Icon name="checkmark-big" size={28} label={value === "first-year" ? undefined : "Included"} />
      {value === "first-year" ? <span className="type-overline-xs-medium">{protectionPlansModal.firstYearOnly}</span> : null}
    </span>
  );
}

function ColumnLogo({ logo }: { logo: "sky" | "jm" }) {
  return logo === "sky" ? <Logo width={156} /> : <span className="type-heading-sm">JM Care Plan</span>;
}

/**
 * Figma "Modal / JM Info v2" (7479:93082) on desktop and "Modal / JM Info - Columns" (7479:93509) on mobile: the
 * plans compared. Jeweler's Mutual's logo is shown as text. Select Plan adds that plan to the bag line the modal
 * was opened from; mobile draws no Select Plan.
 */
export function ProtectionPlansModal({ open, onClose, onSelect }: DialogProps & { onSelect?: (plan: CarePlanId) => void }) {
  const [expanded, setExpanded] = useState<string | null>("3-year");
  const m = protectionPlansModal;
  return (
    <WideDialog
      open={open}
      onClose={onClose}
      width="lg"
      label={m.heading}
      footer={
        <div className="flex flex-col gap-space-5 bg-secondary-ivory px-space-5 py-space-8 ui-desktop:flex-row ui-desktop:items-center ui-desktop:px-space-11 ui-desktop:py-space-6">
          <div className="flex flex-1 flex-col gap-space-2">
            <p className="type-heading-md">{m.support.heading}</p>
            <p className="type-body-sm-regular">{m.support.body}</p>
          </div>
          {/* Not drawn where it leads: shown, not linked (Held for review). */}
          <ButtonText size="sm" variant="secondary" className="w-fit">
            {m.support.cta}
          </ButtonText>
        </div>
      }
    >
      {(headingId) => (
        <div className="flex flex-col gap-space-6 px-space-5 py-space-8 ui-desktop:gap-space-10 ui-desktop:p-space-11">
          <h2 id={headingId} className="type-heading-lg border-b border-black-alpha-20 pr-space-10 pb-space-6 ui-desktop:type-heading-xl ui-desktop:pb-space-10">
            {m.heading}
          </h2>
          <div className="flex flex-col gap-space-6 border-b border-black-alpha-20 pb-space-6 ui-desktop:flex-row ui-desktop:gap-space-11 ui-desktop:pb-space-10">
            {m.intro.map((block) => (
              <div key={block._key} className="flex flex-1 gap-space-3 ui-desktop:flex-col ui-desktop:gap-space-4">
                <Icon name={block.icon as IconName} size={48} className="hidden text-primary-hazel ui-desktop:block" />
                <Icon name={block.icon as IconName} size={40} className="shrink-0 text-primary-hazel ui-desktop:hidden" />
                <div className="flex flex-col gap-space-3">
                  <h3 className="type-heading-md">{block.title}</h3>
                  {"body" in block && block.body ? <p className="type-body-sm-regular">{block.body}</p> : null}
                  {"bullets" in block && block.bullets ? (
                    <ul className="type-body-sm-regular list-disc pl-space-5">
                      {block.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: the comparison table. */}
          <table className="hidden w-full border-separate border-spacing-x-space-2 ui-desktop:table">
            <thead>
              <tr>
                <td className="w-[33%]" />
                {m.columns.map((column, index) => (
                  <th key={column._key} scope="col" className={cx("border-b-2 px-space-4 pb-space-4 align-bottom font-normal", COLUMN_RULE[index])}>
                    <span className="flex flex-col items-center gap-1 text-center">
                      <ColumnLogo logo={column.logo} />
                      <span className="type-body-sm-medium">{column.title}</span>
                      <span className="type-body-sm-regular text-primary-hazel">{column.subtitle}</span>
                      <span className="type-price-md text-primary-hazel">{column.price}</span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {m.rows.map(([label, ...cells], rowIndex) => (
                <tr key={label} className={rowIndex % 2 === 0 ? "[&>*]:bg-secondary-ivory" : undefined}>
                  <th scope="row" className="type-ui-sm-regular h-space-15 px-space-4 text-left font-normal">
                    {label}
                  </th>
                  {cells.map((value, index) => (
                    <td key={m.columns[index]._key} className="h-space-15 text-center">
                      <Coverage value={value} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td />
                {m.columns.map((column, index) => (
                  <td key={column._key} className={cx("border-t-2 px-space-4 pt-space-4 text-center", COLUMN_RULE[index])}>
                    {column.plan ? (
                      <Button size="sm" variant={index === 2 ? "default" : "secondary"} className="w-full" onClick={() => onSelect?.(column.plan!)} disabled={!onSelect}>
                        {m.select}
                      </Button>
                    ) : (
                      <span className="type-body-sm-medium">{m.included}</span>
                    )}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>

          {/* Mobile: one card per plan, the coverage list behind View Plan Details. */}
          <ul className="flex flex-col gap-space-6 ui-desktop:hidden">
            {m.columns.map((column, index) => {
              const isOpen = expanded === column._key;
              const listId = `${headingId}-${column._key}`;
              return (
                <li key={column._key} className="flex flex-col items-center gap-space-5 rounded-4 border border-black-alpha-20 p-space-5 text-center">
                  <span className="flex flex-col items-center gap-space-2">
                    <ColumnLogo logo={column.logo} />
                    <span className="type-body-sm-medium">{column.mobileTitle}</span>
                    <span className="type-price-md text-primary-hazel">{column.price}</span>
                  </span>
                  {isOpen ? (
                    <ul id={listId} className="flex w-full flex-col text-left">
                      {m.rows.map(([label, ...cells], rowIndex) => (
                        <li key={label} className={cx("flex items-center", rowIndex % 2 === 0 && "bg-secondary-ivory")}>
                          <span className="grid w-[3.25rem] shrink-0 place-items-center py-space-2">
                            <Coverage value={cells[index]} />
                          </span>
                          <span className="type-ui-sm-regular px-space-3 py-space-3">{label}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <Button
                    size="sm"
                    variant="secondary"
                    rightIcon={isOpen ? "chevron-up" : "chevron-down"}
                    aria-expanded={isOpen}
                    aria-controls={isOpen ? listId : undefined}
                    onClick={() => setExpanded(isOpen ? null : column._key)}
                    className="w-full"
                  >
                    {isOpen ? m.hideDetails : m.viewDetails}
                  </Button>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col gap-space-4 border-t border-black-alpha-20 pt-space-6 ui-desktop:pt-space-10">
            <h3 className="type-heading-md">{m.termsHeading}</h3>
            <p className="type-body-sm-regular max-w-[40rem]">{m.terms}</p>
            {/* No terms documents exist yet: shown, not linked (Held for review). */}
            <ul className="flex flex-col gap-space-2">
              {m.termsLinks.map((link) => (
                <li key={link} className="type-ui-sm-regular underline decoration-black-alpha-25 underline-offset-2">
                  {link}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </WideDialog>
  );
}

/** The bag page's Secure Checkout: Figma's "Modal - Default" with the portfolio notice (Figma draws no checkout). */
export function CheckoutNoticeModal({ open, onClose }: DialogProps) {
  const n = bagContent.checkoutNotice;
  return <Modal open={open} onClose={onClose} heading={n.heading} body={n.body} primaryAction={{ label: n.close, onClick: onClose }} />;
}
