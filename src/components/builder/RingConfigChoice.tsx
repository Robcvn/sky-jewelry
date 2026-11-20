import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cx } from "@/components/ui/shared";

export type RingConfigAction = { label: string; href: string; /** Screen-reader context after the label, e.g. ": setting". */ context?: string };

type RingConfigChoiceProps = {
  icon: IconName;
  /** The part's name. Pass breakpoint-specific spans where the frames word it differently. */
  name: ReactNode;
  /** "14k White Gold" or "0.50ct • I • VVS2". */
  summary: ReactNode;
  price: string;
  actions: RingConfigAction[];
  /** Figma's stone-unavailable state (7412:101492): dashed error border, struck values and Select New Stone. */
  unavailable?: { message: string; action: RingConfigAction } | null;
  className?: string;
};

/** Edit / View / Remove: Figma's overline link on desktop, the sentence-case ui-xs link on mobile, with a 12px rule between. */
function Actions({ actions }: { actions: RingConfigAction[] }) {
  return (
    <span className="flex items-center gap-space-3">
      {actions.map((action, index) => (
        <Fragment key={action.label}>
          {index > 0 ? <span aria-hidden="true" className="h-space-3 w-px bg-black-alpha-20" /> : null}
          <Link href={action.href} className="type-ui-xs-link ui-transition-fast rounded-4 text-primary-leather hover:text-black-alpha-60 ui-desktop:type-overline-xs-link">
            {action.label}
            {action.context ? <span className="sr-only">{action.context}</span> : null}
          </Link>
        </Fragment>
      ))}
    </span>
  );
}

/**
 * Figma "Ring Config Choice" (Step 3: desktop 6579:194425 / 194426, 506 x 92; mobile 6579:208214 / 208215, 350 x 94):
 * one part of the ring on an ivory card, its icon, name, summary, links and price. The unavailable variant draws a
 * dashed state-error border (dash 2, gap 4), the stone-unavailable icon and name in the error colour, the summary
 * and price struck through at 50%, and "This stone is no longer available." with Select New Stone.
 */
export function RingConfigChoice({ icon, name, summary, price, actions, unavailable = null, className }: RingConfigChoiceProps) {
  const error = Boolean(unavailable);
  return (
    <div data-ring-config={error ? "unavailable" : "default"} className={cx("relative flex items-start gap-space-4 rounded-4 bg-secondary-ivory p-space-4 text-primary-leather", className)}>
      {error ? (
        // CSS dashes can't be set to Figma's 2 / 4 pattern: an SVG outline draws it, inside the card's edge.
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible text-state-error">
          <rect x="0.5" y="0.5" rx="3.5" style={{ width: "calc(100% - 1px)", height: "calc(100% - 1px)" }} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
        </svg>
      ) : null}
      <Icon name={error ? "stone-unavailable" : icon} size={32} className={cx("shrink-0", error && "text-state-error")} />
      <div className={cx("flex min-w-0 flex-1 flex-col", error ? "gap-1" : "gap-space-2")}>
        <div className="flex flex-col gap-1">
          <p className={cx("type-ui-sm-medium", error && "text-state-error")}>{name}</p>
          <p className={cx("type-ui-xs-regular", error && "line-through opacity-50")}>{summary}</p>
        </div>
        {unavailable ? (
          <div className="flex flex-col items-start gap-1 pt-1 ui-desktop:flex-row ui-desktop:items-center ui-desktop:gap-space-2">
            <p className="type-ui-xs-medium text-state-error">{unavailable.message}</p>
            <Link href={unavailable.action.href} className="type-overline-xs-link ui-transition-fast rounded-4 text-primary-leather hover:text-black-alpha-60">
              {unavailable.action.label}
            </Link>
          </div>
        ) : (
          <Actions actions={actions} />
        )}
      </div>
      <p className={cx("shrink-0", error ? "type-ui-md-regular line-through opacity-50" : "type-ui-md-medium")}>{price}</p>
    </div>
  );
}
