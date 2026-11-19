"use client";

import { useState, type KeyboardEvent } from "react";
import { Icon } from "./Icon";
import { cx } from "./shared";

type NumberFieldProps = {
  /** Accessible name, e.g. "Minimum carat weight". Figma shows no visible label. */
  label: string;
  value: number;
  /** Called with a valid, clamped, stepped value: on Enter, on blur, on the arrow keys and on the stepper. */
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  /** Text shown in the field, e.g. (500) => "$500". Defaults to the number. */
  format?: (value: number) => string;
  /** Figma "Quantity Selector" with its up/down column (the Carat inputs). The Price inputs have none. */
  stepper?: boolean;
  className?: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Figma "Quantity Selector" (LG): a 96 x 48 white field with a gold border. Type a value and press Enter or
 * leave the field; ArrowUp/ArrowDown step it. With `stepper`, the chevron buttons step it too (they are left
 * out of the tab order because the arrow keys do the same).
 */
export function NumberField({ label, value, onChange, min, max, step, format = String, stepper = false, className }: NumberFieldProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const decimals = (String(step).split(".")[1] ?? "").length;
  const tidy = (raw: number) => Number(clamp(raw, min, max).toFixed(decimals));

  const commit = (text: string) => {
    setDraft(null);
    const parsed = Number(text.replace(/[^0-9.]/g, ""));
    if (text.trim() !== "" && Number.isFinite(parsed)) {
      const next = tidy(parsed);
      if (next !== value) onChange(next);
    }
  };

  const nudge = (direction: 1 | -1) => {
    setDraft(null);
    const next = tidy(value + direction * step);
    if (next !== value) onChange(next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") commit(event.currentTarget.value);
    else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      nudge(event.key === "ArrowUp" ? 1 : -1);
    }
  };

  return (
    <div
      className={cx(
        "ui-transition flex h-space-12 w-24 overflow-hidden rounded-4 border border-secondary-gold bg-base-white text-primary-leather has-[input:focus-visible]:border-primary-leather has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-primary-leather",
        className,
      )}
    >
      <input
        type="text"
        inputMode="decimal"
        role="spinbutton"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={format(value)}
        value={draft ?? format(value)}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={(event) => commit(event.target.value)}
        onKeyDown={onKeyDown}
        className="type-ui-xs-regular min-w-0 flex-1 bg-transparent px-space-3 focus:outline-none"
      />
      {stepper ? (
        <span className="flex w-space-6 shrink-0 flex-col border-l border-secondary-gold">
          {([1, -1] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              tabIndex={-1}
              aria-label={`${direction > 0 ? "Increase" : "Decrease"} ${label.toLowerCase()}`}
              disabled={direction > 0 ? value >= max : value <= min}
              onClick={() => nudge(direction)}
              className={cx(
                "ui-transition-fast flex flex-1 cursor-pointer items-center justify-center hover:bg-secondary-ivory disabled:cursor-not-allowed disabled:opacity-40",
                direction > 0 && "border-b border-secondary-gold",
              )}
            >
              <Icon name={direction > 0 ? "chevron-up" : "chevron-down"} size={10} />
            </button>
          ))}
        </span>
      ) : null}
    </div>
  );
}
