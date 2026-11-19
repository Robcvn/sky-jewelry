"use client";

import { useId, useState, type ElementType, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { cx, type PreviewState } from "./shared";

type Breakpoint = "desktop" | "mobile";

type AccordionItemProps = {
  question: ReactNode;
  children: ReactNode;
  /** Figma "Show Icon": an optional icon before the question. */
  icon?: IconName;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Forces one Figma breakpoint. By default the item switches at 1024px. */
  breakpoint?: Breakpoint;
  previewState?: PreviewState;
  className?: string;
};

export function AccordionItem({
  question,
  children,
  icon,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  headingLevel = 3,
  breakpoint,
  previewState,
  className,
}: AccordionItemProps) {
  const id = useId();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;
  const Heading = `h${headingLevel}` as ElementType;
  const toggle = () => {
    setInternalOpen(!open);
    onOpenChange?.(!open);
  };

  return (
    <div
      data-breakpoint={breakpoint}
      className={cx("text-primary-leather shadow-[inset_0_1px_0_var(--color-secondary-gold),inset_0_-1px_0_var(--color-secondary-gold)] [&+&]:-mt-px", className)}
    >
      <Heading className="m-0">
        <button
          type="button"
          id={`${id}-button`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          data-state={previewState}
          onClick={toggle}
          className="ui-transition flex w-full cursor-pointer items-center gap-space-5 py-space-5 text-left text-primary-leather ui-hover:text-black-alpha-60 ui-desktop:gap-space-8 ui-desktop:py-space-8"
        >
          <span className="flex min-w-0 flex-1 items-center gap-space-2 ui-desktop:gap-space-3">
            {icon ? <Icon name={icon} size={24} className="ui-desktop:size-space-8" /> : null}
            <span className="type-heading-sm ui-desktop:type-heading-md">{question}</span>
          </span>
          <Icon
            name="chevron-down"
            size={24}
            className={cx(
              "text-primary-leather transition-transform duration-300 ease-out ui-desktop:size-space-8",
              open && "rotate-180",
            )}
          />
        </button>
      </Heading>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        className={cx(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="type-p-xs-regular flex flex-col gap-space-5 pb-space-5 ui-desktop:type-p-sm-regular ui-desktop:gap-space-6 ui-desktop:pb-space-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Accordion({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("flex flex-col", className)}>{children}</div>;
}
