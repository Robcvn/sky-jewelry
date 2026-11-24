"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { cx, type PreviewState } from "./shared";

/** `group`: options that share one are listed under it (Figma "Menu Group Label"), in their order of first appearance. */
export type DropdownOption = { value: string; label: string; icon?: IconName; group?: string };

type DropdownSize = "md" | "sm" | "xs";

type DropdownProps = {
  /** Accessible name. Figma keeps this label hidden on the control. */
  label: string;
  placeholder?: ReactNode;
  options?: DropdownOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Heading above the options, from Figma "Menu Group Label". */
  groupLabel?: string;
  /** Replaces the option list, for example with Radio Buttons. */
  panel?: ReactNode;
  panelLabel?: string;
  /** Text shown on the control. Defaults to the selected option. */
  displayValue?: string;
  /** Figma Selected=True: shows the clear button and divider. */
  clearable?: boolean;
  onClear?: () => void;
  size?: DropdownSize;
  overlay?: boolean;
  error?: boolean;
  disabled?: boolean;
  leadingIcon?: IconName;
  defaultOpen?: boolean;
  previewState?: PreviewState;
  /** Shown before the value in regular weight, e.g. "Sort by" gives "Sort by:  Best Match" (value in medium). */
  valuePrefix?: string;
  /**
   * The Education and Blog frames' dropdowns (3565:101629, 3565:101703, 6963:54748): the whole "Topic: All Topics" in
   * Regular with one space after the colon, the gold border kept while open, and the panel up to 360px tall (Task 30).
   */
  plain?: boolean;
  /** "auto" sizes the control to its text, as the filter bar's dropdowns do. */
  width?: "full" | "auto";
  /** Panel width class (default: the control's width, at least 280px), border tone and alignment. */
  panelWidth?: string;
  panelTone?: "gold" | "leather";
  panelAlign?: "start" | "end";
  /** Called when the panel opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Marks the control as required for assistive technology (aria-required). */
  required?: boolean;
  /** Id of a message about the control, e.g. its error (aria-describedby). */
  describedBy?: string;
  className?: string;
};

const SIZE = {
  md: { box: "min-h-space-12 gap-space-2 px-space-4", clearGap: "gap-space-3", text: "type-ui-sm-regular px-space-1", icon: 24, chevron: 16, clear: 20, rule: "h-space-5" },
  sm: { box: "min-h-space-10 gap-space-1 px-space-3", clearGap: "gap-space-2", text: "type-ui-xs-regular px-space-1", icon: 20, chevron: 16, clear: 16, rule: "h-space-4" },
  xs: { box: "min-h-space-8 gap-space-1 px-space-2", clearGap: "gap-1.5", text: "type-ui-xs-regular px-0.5", icon: 12, chevron: 12, clear: 12, rule: "h-space-3" },
};

const OVERLAY_XS = { box: "min-h-space-8 gap-space-1 px-space-3", clearGap: "gap-1.5", text: "type-ui-xs-regular px-space-1", icon: 16, chevron: 16, clear: 12, rule: "h-space-3" };

function shellColors(overlay: boolean, error: boolean, disabled: boolean, plain = false) {
  if (overlay) {
    if (disabled) return "border-white-alpha-20 bg-white-alpha-0 text-white-alpha-50 [--dropdown-icon:var(--color-white-alpha-50)]";
    return cx(
      "bg-white-alpha-2 text-secondary-skin [--dropdown-icon:var(--color-secondary-gold)]",
      error ? "border-state-error" : "border-secondary-gold ui-hover:border-white-alpha-50 ui-active:border-secondary-skin",
    );
  }
  if (disabled) return "border-black-alpha-20 bg-secondary-skin text-black-alpha-50 [--dropdown-icon:var(--color-black-alpha-50)]";
  return cx(
    "bg-secondary-skin text-primary-leather [--dropdown-icon:var(--color-primary-leather)]",
    error
      ? "border-state-error"
      : plain
        ? "border-secondary-gold ui-hover:border-black-alpha-50"
        : "border-secondary-gold ui-hover:border-black-alpha-50 ui-active:border-primary-leather data-[open=true]:border-primary-leather",
  );
}

export function Dropdown({
  label,
  placeholder = "Select an option",
  options = [],
  value,
  defaultValue,
  onChange,
  groupLabel,
  panel,
  panelLabel,
  displayValue,
  clearable = false,
  onClear,
  size = "md",
  overlay = false,
  error = false,
  disabled = false,
  leadingIcon,
  defaultOpen = false,
  previewState,
  valuePrefix,
  plain = false,
  width = "full",
  panelWidth,
  panelTone = "gold",
  panelAlign = "start",
  onOpenChange,
  required,
  describedBy,
  className,
}: DropdownProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const typeahead = useRef({ text: "", time: 0 });
  const [open, setOpenState] = useState(defaultOpen);
  const onOpenChangeRef = useRef(onOpenChange);
  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  });
  const setOpen = useCallback(
    (next: boolean | ((current: boolean) => boolean)) =>
      setOpenState((current) => {
        const value = typeof next === "function" ? next(current) : next;
        if (value !== current) onOpenChangeRef.current?.(value);
        return value;
      }),
    [],
  );
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = value ?? internalValue;
  const selectedIndex = options.findIndex((option) => option.value === selectedValue);
  const [activeIndex, setActiveIndex] = useState(Math.max(selectedIndex, 0));

  const spec = overlay && size === "xs" ? OVERLAY_XS : SIZE[size];
  const labelId = `${id}-label`;
  const panelId = `${id}-panel`;
  const optionId = (index: number) => `${id}-option-${index}`;
  const selectedLabel = displayValue ?? options[selectedIndex]?.label;
  // Figma's overlay XS Selected=True frame is broken. It follows the SM and MD divider pattern instead.
  const showClear = clearable;

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, [open, setOpen]);

  // Escape closes an open list or panel wherever focus is, and returns focus to the trigger. The trigger (list) and the
  // panel handle it themselves when they have focus; this catches the rest: a panel's trigger right after a click, and
  // Safari, which doesn't focus a button it clicks. Calling preventDefault keeps a dialog around the dropdown open.
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open, setOpen]);

  useEffect(() => {
    if (open && !panel) document.getElementById(`${id}-option-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [open, panel, activeIndex, id]);

  const openMenu = (index = Math.max(selectedIndex, 0)) => {
    setActiveIndex(index);
    setOpen(true);
  };

  const choose = (index: number) => {
    const option = options[index];
    if (!option) return;
    setInternalValue(option.value);
    onChange?.(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const moveByTypeahead = (character: string, now: number) => {
    const text = now - typeahead.current.time > 500 ? character : typeahead.current.text + character;
    typeahead.current = { text, time: now };
    const start = open ? activeIndex + (text.length === 1 ? 1 : 0) : Math.max(selectedIndex, 0);
    const ordered = options.map((_, index) => (start + index) % options.length);
    const match = ordered.find((index) => options[index].label.toLowerCase().startsWith(text.toLowerCase()));
    if (match !== undefined) openMenu(match);
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Tab") {
      if (open) choose(activeIndex);
      return;
    }
    if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        setOpen(false);
      }
      return;
    }
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openMenu();
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        openMenu(event.key === "Home" ? 0 : options.length - 1);
      } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        moveByTypeahead(event.key, event.timeStamp);
      }
      return;
    }
    const moves: Record<string, number> = {
      ArrowDown: Math.min(activeIndex + 1, options.length - 1),
      ArrowUp: Math.max(activeIndex - 1, 0),
      Home: 0,
      End: options.length - 1,
    };
    if (event.key in moves) {
      event.preventDefault();
      setActiveIndex(moves[event.key]);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(activeIndex);
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      moveByTypeahead(event.key, event.timeStamp);
    }
  };

  const onPanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  const triggerProps = panel
    ? {
        "aria-haspopup": "dialog" as const,
        "aria-expanded": open,
        "aria-controls": open ? panelId : undefined,
        onClick: () => setOpen((current) => !current),
      }
    : {
        role: "combobox" as const,
        "aria-haspopup": "listbox" as const,
        "aria-expanded": open,
        "aria-controls": panelId,
        "aria-activedescendant": open ? optionId(activeIndex) : undefined,
        "aria-invalid": error || undefined,
        "aria-required": required || undefined,
        "aria-describedby": describedBy,
        onClick: () => (open ? setOpen(false) : openMenu()),
        onKeyDown: onListKeyDown,
      };

  const renderOption = (option: DropdownOption, index: number, Tag: "li" | "div") => (
    <Tag
      key={option.value}
      id={optionId(index)}
      role="option"
      aria-selected={option.value === selectedValue}
      onPointerMove={() => setActiveIndex(index)}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => choose(index)}
      className={cx(
        "ui-transition type-ui-sm-medium flex cursor-pointer items-center gap-0.5 rounded-4 py-space-2 pr-space-4 pl-space-2 text-primary-leather",
        // The chosen option is shaded; the keyboard position only while the keyboard is in use, so a menu opened with a
        // click shows no shaded option, as Figma draws it (Task 30, edudd-1440-2). The pointer's option shades on hover.
        option.value === selectedValue
          ? "bg-secondary-ivory"
          : cx("ui-hover:bg-secondary-ivory", index === activeIndex && "[:root[data-input=keyboard]_&]:bg-secondary-ivory"),
      )}
    >
      {option.icon ? <Icon name={option.icon} size={20} /> : null}
      <span className="min-w-0 flex-1 px-space-1">{option.label}</span>
    </Tag>
  );

  return (
    <div
      ref={rootRef}
      className={cx("relative", width === "full" ? "w-full" : "w-max", className)}
      onBlur={(event) => {
        // Mouse presses outside are handled by the pointerdown listener. Here, close only when
        // keyboard focus moves to another element outside the dropdown. Focus moving to an
        // ancestor (such as <main tabindex="-1">, after a click inside the panel) is not leaving.
        const next = event.relatedTarget;
        const root = event.currentTarget;
        if (next && !root.contains(next) && !next.contains(root)) setOpen(false);
      }}
    >
      <span id={labelId} className="sr-only">
        {label}
      </span>
      <div
        data-state={previewState}
        data-open={open}
        className={cx(
          "ui-transition relative flex items-center rounded-4 border has-[[data-trigger]:focus-visible]:outline-2 has-[[data-trigger]:focus-visible]:outline-offset-2",
          overlay ? "has-[[data-trigger]:focus-visible]:outline-base-white" : "has-[[data-trigger]:focus-visible]:outline-primary-leather",
          spec.box,
          showClear && spec.clearGap,
          shellColors(overlay, error, disabled, plain),
        )}
      >
        {showClear ? (
          <>
            <button
              type="button"
              disabled={disabled}
              aria-label={`Clear ${label}`}
              onClick={() => {
                setInternalValue(undefined);
                onClear?.();
                triggerRef.current?.focus();
              }}
              className="relative z-10 inline-flex cursor-pointer rounded-4 text-(--dropdown-icon) disabled:cursor-not-allowed"
            >
              <Icon name={overlay ? "close-large" : "close"} size={spec.clear} />
            </button>
            <span aria-hidden="true" className={cx("w-px shrink-0", spec.rule, overlay ? "bg-white-alpha-20" : "bg-black-alpha-20")} />
          </>
        ) : null}
        <button
          ref={triggerRef}
          type="button"
          data-trigger=""
          disabled={disabled}
          aria-labelledby={`${labelId} ${id}-value`}
          className={cx(
            "flex min-w-0 flex-1 cursor-pointer items-center text-left after:absolute after:inset-0 focus-visible:outline-none disabled:cursor-not-allowed",
            size === "md" ? "gap-space-2" : "gap-space-1",
          )}
          {...triggerProps}
        >
          {leadingIcon && !showClear ? <Icon name={leadingIcon} size={spec.icon} className="text-(--dropdown-icon)" /> : null}
          <span id={`${id}-value`} className={cx("min-w-0 flex-1 truncate", spec.text)}>
            {valuePrefix && plain ? (
              `${valuePrefix}: ${selectedLabel ?? placeholder}`
            ) : valuePrefix ? (
              <>
                {valuePrefix}:{"\u00a0 "}
                <span className="font-medium tracking-[-0.01em]">{selectedLabel ?? placeholder}</span>
              </>
            ) : (
              (selectedLabel ?? placeholder)
            )}
          </span>
          <Icon name="chevron-down" size={spec.chevron} className="text-(--dropdown-icon)" />
        </button>
      </div>

      {panel ? (
        open ? (
          <div
            id={panelId}
            role="group"
            aria-label={panelLabel ?? label}
            onKeyDown={onPanelKeyDown}
            className={cx(
              "absolute top-full z-30 mt-space-2 overflow-hidden rounded-4 border bg-secondary-skin shadow-lg",
              panelWidth ?? "inset-x-0 min-w-70",
              panelWidth && (panelAlign === "end" ? "right-0" : "left-0"),
              panelTone === "leather" ? "border-primary-leather" : "border-secondary-gold",
            )}
          >
            {groupLabel ? (
              <div className="border-b border-black-alpha-10 p-space-2">
                <p className="type-overline-xs-medium px-space-3 py-space-2 text-primary-hazel">{groupLabel}</p>
                {panel}
              </div>
            ) : (
              panel
            )}
          </div>
        ) : null
      ) : (
        <div
          hidden={!open}
          className={cx(
            "absolute top-full z-30 mt-space-2 overflow-y-auto rounded-4 border border-secondary-gold bg-secondary-skin shadow-lg",
            plain ? "max-h-90" : "max-h-80",
            panelWidth ? cx(panelWidth, panelAlign === "end" ? "right-0" : "left-0") : "inset-x-0",
          )}
        >
          {options.some((option) => option.group) ? (
            // Grouped (Figma Education Center - Dropdown 6963:54748): one listbox, a labelled group per heading, a rule between groups.
            <div id={panelId} role="listbox" aria-labelledby={labelId}>
              {[...new Set(options.map((option) => option.group ?? ""))].map((group, groupIndex) => (
                <div key={group} role="group" aria-labelledby={`${id}-group-${groupIndex}`} className="border-b border-black-alpha-10 p-space-2 last:border-b-0">
                  <p id={`${id}-group-${groupIndex}`} className="type-overline-xs-medium px-space-3 py-space-2 text-primary-hazel">
                    {group}
                  </p>
                  {options.map((option, index) => ((option.group ?? "") === group ? renderOption(option, index, "div") : null))}
                </div>
              ))}
            </div>
          ) : (
            <div className="border-b border-black-alpha-10 p-space-2">
              {groupLabel ? (
                <p id={`${id}-group`} className="type-overline-xs-medium px-space-3 py-space-2 text-primary-hazel">
                  {groupLabel}
                </p>
              ) : null}
              <ul id={panelId} role="listbox" aria-labelledby={groupLabel ? `${labelId} ${id}-group` : labelId}>
                {options.map((option, index) => renderOption(option, index, "li"))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
