"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { TextButton } from "./TextButton";
import { cx } from "./shared";
import { useIsDesktop } from "./useIsDesktop";

type Breakpoint = "desktop" | "mobile";

export type ModalAction = { label: string; onClick?: () => void };

type ModalPanelProps = {
  heading: ReactNode;
  /** Figma "Body". */
  body?: ReactNode;
  /** Figma "Content" slot. */
  children?: ReactNode;
  /** Figma "Icon" slot, shown above the heading. */
  icon?: ReactNode;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  /** Figma "Button Group" (row) or "Button Stack" (stack). */
  actionsLayout?: "row" | "stack";
  showClose?: boolean;
  closeLabel?: string;
  onClose?: () => void;
  breakpoint?: Breakpoint;
  headingId?: string;
  bodyId?: string;
  className?: string;
};

/** The Figma "Modal - Default" container. Use Modal to open it as a dialog. */
export function ModalPanel({
  heading,
  body,
  children,
  icon,
  primaryAction,
  secondaryAction,
  actionsLayout = "row",
  showClose = true,
  closeLabel = "Close",
  onClose,
  breakpoint,
  headingId,
  bodyId,
  className,
}: ModalPanelProps) {
  const isDesktopViewport = useIsDesktop();
  const desktop = breakpoint ? breakpoint === "desktop" : isDesktopViewport;
  const buttonSize = desktop ? "md" : "sm";
  const hasActions = Boolean(primaryAction || secondaryAction);

  return (
    <div
      data-breakpoint={breakpoint}
      className={cx(
        "relative flex w-full flex-col rounded-8 bg-secondary-skin py-space-2 text-primary-leather shadow-lg ring-1 ring-black-alpha-2 ui-desktop:max-w-[30rem] ui-desktop:py-space-4",
        className,
      )}
    >
      {showClose ? (
        <IconButton
          icon="close"
          label={closeLabel}
          size="xs"
          variant="ghost"
          onClick={onClose}
          className="absolute top-space-6 right-space-6 z-10"
        />
      ) : null}
      <div className="flex min-h-0 flex-col gap-space-4 overflow-y-auto px-space-5 py-space-3 ui-desktop:px-space-8 ui-desktop:py-space-4">
        {icon ? <div className="flex">{icon}</div> : null}
        <h2 id={headingId} className={cx("type-heading-sm ui-desktop:type-heading-md", showClose && "pr-space-10")}>
          {heading}
        </h2>
        {body ? (
          <div id={bodyId} className="type-p-xs-regular ui-desktop:type-p-sm-regular">
            {body}
          </div>
        ) : null}
        {children ? <div className="type-p-xs-regular flex flex-col gap-space-4 ui-desktop:type-p-sm-regular">{children}</div> : null}
      </div>
      {hasActions ? (
        <div
          className={cx(
            "flex px-space-5 py-space-3 ui-desktop:px-space-8 ui-desktop:py-space-4",
            actionsLayout === "row"
              ? "items-center gap-space-3 ui-desktop:gap-space-4"
              : "flex-col items-center gap-space-3 ui-desktop:gap-space-4",
          )}
        >
          {actionsLayout === "row" ? (
            <>
              {secondaryAction ? (
                <Button size={buttonSize} variant="secondary" onClick={secondaryAction.onClick}>
                  {secondaryAction.label}
                </Button>
              ) : null}
              {primaryAction ? (
                <Button size={buttonSize} onClick={primaryAction.onClick} className="flex-1">
                  {primaryAction.label}
                </Button>
              ) : null}
            </>
          ) : (
            <>
              {primaryAction ? (
                <Button size={buttonSize} onClick={primaryAction.onClick} className="w-full">
                  {primaryAction.label}
                </Button>
              ) : null}
              {secondaryAction ? (
                <TextButton size={buttonSize === "md" ? "md" : "sm"} variant="caps" onClick={secondaryAction.onClick}>
                  {secondaryAction.label}
                </TextButton>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type ModalProps = Omit<ModalPanelProps, "headingId" | "bodyId" | "onClose"> & {
  open: boolean;
  onClose: () => void;
};

/**
 * Dialog with backdrop, focus trap, Escape to close, scroll lock and focus returned to the trigger.
 * Opens with Figma's "Move In" from the bottom: 300ms ease-out.
 */
export function Modal({ open, onClose, breakpoint, ...panel }: ModalProps) {
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    if (!open && dialog.open) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const frame = requestAnimationFrame(() => setVisible(false));
      const timer = window.setTimeout(() => {
        dialog.close();
        document.documentElement.style.overflow = "";
        returnFocusRef.current?.focus();
      }, reduced ? 0 : 300);
      return () => {
        cancelAnimationFrame(frame);
        window.clearTimeout(timer);
      };
    }
  }, [open]);

  useEffect(
    () => () => {
      document.documentElement.style.overflow = "";
    },
    [],
  );

  const trapFocus = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${id}-heading`}
      aria-describedby={panel.body ? `${id}-body` : undefined}
      data-breakpoint={breakpoint}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={trapFocus}
      className="fixed inset-0 m-0 size-full max-h-none max-w-none bg-transparent p-0 backdrop:bg-transparent open:flex"
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cx("absolute inset-0 bg-black-alpha-50 transition-opacity duration-300 ease-out", visible ? "opacity-100" : "opacity-0")}
      />
      <div
        className={cx(
          "relative flex w-full items-end justify-center ui-desktop:items-center ui-desktop:p-space-6",
          "pointer-events-none [&>*]:pointer-events-auto",
        )}
      >
        <ModalPanel
          {...panel}
          breakpoint={breakpoint}
          onClose={onClose}
          headingId={`${id}-heading`}
          bodyId={`${id}-body`}
          className={cx(
            "max-h-[calc(100dvh-var(--spacing-space-6))] transition-[opacity,translate] duration-300 ease-out ui-desktop:max-h-[calc(100dvh-var(--spacing-space-12))]",
            visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 ui-desktop:translate-y-space-12",
          )}
        />
      </div>
    </dialog>
  );
}
