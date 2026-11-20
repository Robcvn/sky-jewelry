"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { TextButton } from "./TextButton";
import { cx } from "./shared";
import { useIsDesktop } from "./useIsDesktop";

type Breakpoint = "desktop" | "mobile";

export type ModalAction = { label: string; onClick?: () => void; disabled?: boolean };

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
  /** "center": the icon, heading and body centred, as Figma's Stone Unavailable modal (7412:103358). */
  align?: "start" | "center";
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
  align = "start",
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
      <div className={cx("flex min-h-0 flex-col gap-space-4 overflow-y-auto px-space-5 py-space-3 ui-desktop:px-space-8 ui-desktop:py-space-4", align === "center" && "text-center")}>
        {icon ? <div className={cx("flex", align === "center" && "justify-center")}>{icon}</div> : null}
        <h2 id={headingId} className={cx("type-heading-sm ui-desktop:type-heading-md", showClose && (align === "center" ? "px-space-10" : "pr-space-10"))}>
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
                <Button size={buttonSize} onClick={primaryAction.onClick} disabled={primaryAction.disabled} className="flex-1">
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

type DialogShellProps = {
  open: boolean;
  onClose: () => void;
  /** id of the element that names the dialog. */
  labelledBy: string;
  describedBy?: string;
  breakpoint?: Breakpoint;
  /** "center" (default): bottom sheet on mobile, centred from 1024px. "top-end": the desktop bag panel, top right. */
  placement?: "center" | "top-end";
  /** Classes for the panel wrapper, e.g. a width. Its children are the panel itself. */
  children: (state: { visible: boolean }) => ReactNode;
};

/**
 * The dialog behaviour shared by Modal, the Filters sheet and the product quick view: a native <dialog> with
 * a black-alpha-50 backdrop, focus trap, Escape and backdrop click to close, scroll lock, and focus returned
 * to the trigger. Opens with Figma's "Move In" from the bottom: 300ms ease-out (instant under reduced motion).
 * On mobile the panel sits at the bottom of the screen; from 1024px it is centred. The dialog itself never scrolls
 * (overflow: clip): the panels scroll inside, so focusing the close button while the panel is still sliding in
 * can't leave the dialog scrolled.
 */
export function DialogShell({ open, onClose, labelledBy, describedBy, breakpoint, placement = "center", children }: DialogShellProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        returnFocusRef.current = document.activeElement as HTMLElement | null;
        dialog.showModal();
        document.documentElement.style.overflow = "hidden";
      }
      // Scheduled on every run, so a dialog mounted already open still fades in when effects run twice (dev).
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
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((item) => item.offsetParent !== null);
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
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      data-breakpoint={breakpoint}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={trapFocus}
      className="fixed inset-0 m-0 size-full max-h-none max-w-none overflow-clip bg-transparent p-0 backdrop:bg-transparent open:flex"
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cx("absolute inset-0 bg-black-alpha-50 transition-opacity duration-300 ease-out motion-reduce:transition-none", visible ? "opacity-100" : "opacity-0")}
      />
      <div
        className={cx(
          "relative flex w-full",
          placement === "top-end" ? "items-start justify-end p-space-6" : "items-end justify-center ui-desktop:items-center ui-desktop:p-space-6",
          "pointer-events-none [&>*]:pointer-events-auto",
        )}
      >
        {children({ visible })}
      </div>
    </dialog>
  );
}

/** Classes for a panel inside DialogShell: slides up from the bottom (mobile) or in from below (desktop). */
export const dialogPanelMotion = (visible: boolean) =>
  cx(
    "transition-[opacity,translate] duration-300 ease-out motion-reduce:transition-none",
    visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 ui-desktop:translate-y-space-12",
  );

type ModalProps = Omit<ModalPanelProps, "headingId" | "bodyId" | "onClose"> & {
  open: boolean;
  onClose: () => void;
};

/** Figma "Modal - Default" opened as a dialog. */
export function Modal({ open, onClose, breakpoint, ...panel }: ModalProps) {
  const id = useId();

  return (
    <DialogShell
      open={open}
      onClose={onClose}
      labelledBy={`${id}-heading`}
      describedBy={panel.body ? `${id}-body` : undefined}
      breakpoint={breakpoint}
    >
      {({ visible }) => (
        <ModalPanel
          {...panel}
          breakpoint={breakpoint}
          onClose={onClose}
          headingId={`${id}-heading`}
          bodyId={`${id}-body`}
          className={cx(
            "max-h-[calc(100dvh-var(--spacing-space-6))] ui-desktop:max-h-[calc(100dvh-var(--spacing-space-12))]",
            dialogPanelMotion(visible),
          )}
        />
      )}
    </DialogShell>
  );
}
