import { cx } from "./shared";

export type NumberSize = "md" | "sm";

export function paginationNumberClasses(size: NumberSize, active: boolean, tone: "default" | "error" = "default") {
  return cx(
    "ui-transition inline-flex shrink-0 items-center justify-center rounded-full border",
    size === "md" ? "size-space-8 type-ui-xs-medium" : "size-space-6 type-overline-sm-medium",
    tone === "error"
      ? "border-state-error text-state-error"
      : active
        ? "border-primary-leather bg-primary-leather text-base-white"
        : "border-primary-leather text-primary-leather ui-hover:bg-secondary-peach ui-hover:text-base-black",
  );
}
