import { Children, Fragment, type ReactNode } from "react";
import { Icon } from "./Icon";
import { paginationNumberClasses } from "./paginationStyles";
import { cx } from "./shared";

type StepIndicatorProps = {
  step: number;
  /** "Select" in "Select Setting". Shown on its own line on mobile. */
  verb: string;
  /** "Setting" in "Select Setting". */
  noun: string;
  /** The noun on mobile where its frames word it differently (the builder's "Diamond" is "Stone" on mobile). */
  mobileNoun?: string;
  /** Figma State=Active. */
  active?: boolean;
  /** Figma Complete=True. */
  complete?: boolean;
  /** Figma Unavailable=True. Only meaningful with complete. */
  unavailable?: boolean;
  /** The chosen item, for example "Freesia 2mm Solitaire". Desktop only. */
  selectedName?: ReactNode;
  price?: ReactNode;
  /** Links such as Edit and Remove, or Select New Stone. Desktop only. */
  actions?: ReactNode;
  /** Product image, 64px. Desktop only. */
  image?: ReactNode;
  breakpoint?: "desktop" | "mobile";
  className?: string;
};

/** Figma "Step Indicator" for the ring builder. Wrap steps in StepList. */
export function StepIndicator({
  step,
  verb,
  noun,
  mobileNoun,
  active = false,
  complete = false,
  unavailable = false,
  selectedName,
  price,
  actions,
  image,
  breakpoint,
  className,
}: StepIndicatorProps) {
  const error = complete && unavailable;
  const status = error ? "unavailable" : complete ? "complete" : active ? "current step" : "not started";

  return (
    <div
      aria-current={active ? "step" : undefined}
      data-breakpoint={breakpoint}
      className={cx(
        "flex w-full items-center text-primary-leather",
        "gap-space-1 py-space-3 pr-space-2 pl-space-3 ui-desktop:min-h-20 ui-desktop:px-space-6 ui-desktop:py-space-2",
        complete ? "ui-desktop:gap-space-3" : "ui-desktop:justify-center",
        active ? "bg-secondary-skin" : error ? "bg-state-error-light" : "bg-secondary-ivory",
        className,
      )}
    >
      <div className={cx("flex min-w-0 items-center gap-1.5 ui-desktop:gap-space-3", complete ? "flex-1" : "flex-1 ui-desktop:flex-none")}>
        <span aria-hidden="true" className="flex ui-desktop:hidden">
          <span className={paginationNumberClasses("sm", false, error ? "error" : "default")}>{step}</span>
        </span>
        <span aria-hidden="true" className="hidden ui-desktop:flex">
          <span className={paginationNumberClasses("md", false, error ? "error" : "default")}>{step}</span>
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="sr-only">
            Step {step}, {status}:{" "}
          </span>
          <span className="type-overline-2xs-medium -mb-space-1 text-black-alpha-60 ui-desktop:hidden">{verb}</span>
          {/* The builder frames set the current step's name in the italic heading style. */}
          <span className={cx(active ? "type-heading-italic-xs" : "type-heading-xs", error && "text-state-error")}>
            <span className="hidden ui-desktop:inline">{verb} </span>
            {mobileNoun && mobileNoun !== noun ? (
              <>
                <span className="hidden ui-desktop:inline">{noun}</span>
                <span className="ui-desktop:hidden">{mobileNoun}</span>
              </>
            ) : (
              noun
            )}
          </span>
          {complete && selectedName ? (
            <span
              className={cx(
                "hidden truncate ui-desktop:block",
                active ? "type-body-xs-regular" : "type-ui-xs-regular",
                // Figma's Unavailable variant strikes the chosen item through at 50%.
                error && "line-through opacity-50",
              )}
            >
              {selectedName}
            </span>
          ) : null}
        </span>
        {complete ? (
          <Icon
            name={error ? "alert" : "checkmark-big"}
            size={20}
            className={cx("ui-desktop:hidden", error ? "text-state-error" : "text-primary-leather")}
          />
        ) : null}
      </div>
      {complete ? (
        // Figma's "stack" aligns its children to the right (counter axis MAX): the price, or the Unavailable badge, ends
        // where the links end, in every builder frame.
        <div className="hidden shrink-0 flex-col items-end gap-space-1 ui-desktop:flex">
          {error ? (
            <span className="type-overline-xs-medium flex items-center gap-space-1 text-state-error">
              <Icon name="alert" size={16} />
              Unavailable
            </span>
          ) : price ? (
            <span className="type-ui-xs-regular">{price}</span>
          ) : null}
          {actions ? <StepActions>{actions}</StepActions> : null}
        </div>
      ) : null}
      {complete && image ? <div className="hidden size-space-13 shrink-0 ui-desktop:block">{image}</div> : null}
    </div>
  );
}

function StepActions({ children }: { children: ReactNode }) {
  const items = Children.toArray(children);
  return (
    <span className="flex items-center gap-space-2">
      {items.map((child, index) => (
        <Fragment key={index}>
          {/* Figma: a vertical 8px rule between the links ("Line 1", 0 x 8). */}
          {index > 0 ? <span aria-hidden="true" className="h-space-2 w-px bg-black-alpha-20" /> : null}
          {child}
        </Fragment>
      ))}
    </span>
  );
}

/** A link styled for Step Indicator actions. */
export function StepActionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="type-overline-xs-link ui-transition-fast text-primary-leather hover:text-black-alpha-60">
      {children}
    </a>
  );
}

export function StepList({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <ol aria-label={label} className={cx("flex", className)}>
      {Children.toArray(children).map((child, index) => (
        <li key={index} className="min-w-0 flex-1">
          {child}
        </li>
      ))}
    </ol>
  );
}
