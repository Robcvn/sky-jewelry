"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { cx, type PreviewState } from "./shared";
import { useDragScroll } from "./useDragScroll";

type TabSize = "md" | "sm" | "xs";
type TabVariant = "pill" | "line";

const PILL_SIZE = {
  md: { box: "min-h-space-10 px-space-4", label: "px-space-2" },
  sm: { box: "min-h-space-8 px-space-3", label: "px-space-2" },
  xs: { box: "min-h-space-6 px-space-2", label: "" },
};

function tabClasses({
  variant,
  size,
  overlay,
  selected,
}: {
  variant: TabVariant;
  size: TabSize;
  overlay: boolean;
  selected: boolean;
}) {
  const base =
    "ui-transition relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap disabled:cursor-not-allowed";
  const type =
    variant === "pill" && size === "xs"
      ? overlay
        ? "type-ui-2xs-medium"
        : "type-body-2xs-medium"
      : "type-overline-xs-medium";

  if (variant === "line") {
    return cx(
      base,
      type,
      "min-h-space-8 gap-space-1 border-b",
      overlay
        ? cx(
            "ui-focus:outline-base-white disabled:text-white-alpha-60",
            selected ? "border-secondary-gold text-base-white" : "border-transparent text-base-white ui-hover:text-white-alpha-70",
          )
        : cx(
            "disabled:text-black-alpha-40",
            selected ? "border-primary-leather text-primary-leather" : "border-transparent text-primary-leather ui-hover:text-black-alpha-60",
          ),
    );
  }

  return cx(
    base,
    type,
    "rounded-full",
    PILL_SIZE[size].box,
    overlay
      ? cx(
          "ui-focus:outline-base-white disabled:text-white-alpha-60",
          selected ? "bg-secondary-skin text-primary-leather" : "text-base-white ui-hover:text-white-alpha-70",
        )
      : cx(
          "disabled:text-black-alpha-40",
          selected ? "bg-primary-leather text-base-white" : "text-primary-leather ui-hover:text-black-alpha-60",
        ),
  );
}

function TabLabel({
  variant,
  size,
  leadingIcon,
  trailingIcon,
  children,
}: {
  variant: TabVariant;
  size: TabSize;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  children: ReactNode;
}) {
  return (
    <>
      {leadingIcon ? <Icon name={leadingIcon} size={14} /> : null}
      <span className={cx("inline-flex items-center gap-space-1", variant === "pill" && PILL_SIZE[size].label)}>{children}</span>
      {trailingIcon ? <Icon name={trailingIcon} size={14} /> : null}
    </>
  );
}

export type TabItem = {
  id: string;
  label: ReactNode;
  panel?: ReactNode;
  disabled?: boolean;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
};

type TabsProps = {
  /** Accessible name for the tab list. */
  label: string;
  items: TabItem[];
  variant?: TabVariant;
  /** Pill: MD, SM or XS. Line: MD or SM (the spacing between tabs). */
  size?: TabSize;
  overlay?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (id: string) => void;
  /** Line tabs only: centre the tabs over a full-width black-alpha-20 rule (Figma PDP Asset Tabs, mobile). */
  divider?: boolean;
  className?: string;
};

export function Tabs({
  label,
  items,
  variant = "pill",
  size = "md",
  overlay = false,
  defaultValue,
  value,
  onChange,
  divider = false,
  className,
}: TabsProps) {
  const id = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const listRef = useDragScroll<HTMLDivElement>();
  const firstEnabled = items.find((item) => !item.disabled)?.id;
  const [internalValue, setInternalValue] = useState(defaultValue ?? firstEnabled);
  const selected = value ?? internalValue;

  const select = (index: number) => {
    const item = items[index];
    if (!item || item.disabled) return;
    setInternalValue(item.id);
    onChange?.(item.id);
    refs.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const enabled = items.map((item, i) => (item.disabled ? -1 : i)).filter((i) => i >= 0);
    const position = enabled.indexOf(index);
    const target = {
      ArrowRight: enabled[(position + 1) % enabled.length],
      ArrowLeft: enabled[(position - 1 + enabled.length) % enabled.length],
      Home: enabled[0],
      End: enabled[enabled.length - 1],
    }[event.key];
    if (target !== undefined) {
      event.preventDefault();
      select(target);
    }
  };

  const hasPanels = items.some((item) => item.panel !== undefined);

  return (
    <div className={className}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        className={cx(
          "flex max-w-full overflow-x-auto",
          variant === "pill"
            ? cx(
                // Figma's 1px stroke is inside its 4px padding (Tabs 48 / 40 / 32 tall): 3px beside the border.
                "w-fit rounded-full border p-[3px]",
                overlay ? "border-white-alpha-20 bg-white-alpha-10 backdrop-blur-md" : "border-secondary-gold",
              )
            : cx(size === "md" ? "gap-space-10" : "gap-space-6", divider && "w-full justify-center border-b border-black-alpha-20"),
        )}
      >
        {items.map((item, index) => {
          const isSelected = item.id === selected;
          return (
            <button
              key={item.id}
              ref={(node) => {
                refs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${item.id}`}
              aria-selected={isSelected}
              aria-controls={hasPanels ? `${id}-panel-${item.id}` : undefined}
              tabIndex={isSelected ? 0 : -1}
              disabled={item.disabled}
              onClick={() => select(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={tabClasses({ variant, size: variant === "line" ? "sm" : size, overlay, selected: isSelected })}
            >
              <TabLabel variant={variant} size={size} leadingIcon={item.leadingIcon} trailingIcon={item.trailingIcon}>
                {item.label}
              </TabLabel>
            </button>
          );
        })}
      </div>
      {hasPanels
        ? items.map((item) => (
            <div
              key={item.id}
              role="tabpanel"
              id={`${id}-panel-${item.id}`}
              aria-labelledby={`${id}-tab-${item.id}`}
              hidden={item.id !== selected}
              tabIndex={0}
              className="mt-space-6"
            >
              {item.panel}
            </div>
          ))
        : null}
    </div>
  );
}

type TabItemPreviewProps = {
  label: string;
  variant?: TabVariant;
  size?: TabSize;
  overlay?: boolean;
  state?: PreviewState | "active" | "disabled";
  leadingIcon?: IconName;
  trailingIcon?: IconName;
};

/** Style guide only: one Figma "Tab Item" variant, forced into a state. */
export function TabItemPreview({
  label,
  variant = "pill",
  size = "md",
  overlay = false,
  state,
  leadingIcon,
  trailingIcon,
}: TabItemPreviewProps) {
  const selected = state === "active";
  return (
    <div role="tablist" aria-label={`${label} preview`} className="inline-flex">
      <button
        type="button"
        role="tab"
        aria-selected={selected}
        disabled={state === "disabled"}
        data-state={state === "hover" || state === "focus" ? state : undefined}
        className={tabClasses({ variant, size, overlay, selected })}
      >
        <TabLabel variant={variant} size={size} leadingIcon={leadingIcon} trailingIcon={trailingIcon}>
          {label}
        </TabLabel>
      </button>
    </div>
  );
}
