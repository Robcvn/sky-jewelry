"use client";

import { Pagination } from "./Pagination";
import { TextButton } from "./TextButton";
import { cx } from "./shared";

type PaginationRowProps = {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  label: string;
  className?: string;
};

/**
 * Figma's results pagination row (Education Center 6963:54776, Blog List 3565:101751; mobile 7074:91892): "Prev" at
 * the left, the page numbers centred (32px, 24px on mobile), "Next" at the right. Prev and Next are dimmed and inert
 * on the first and last page. Callers hide the row when there is only one page.
 */
export function PaginationRow({ pageCount, currentPage, onPageChange, label, className }: PaginationRowProps) {
  // Figma "Text Button", Size=SM, Type=Caps, with its Disabled state on the first and last page.
  const step = (label: string, icon: "chevron-left" | "chevron-right", page: number, disabled: boolean) => (
    <TextButton
      size="sm"
      variant="caps"
      disabled={disabled}
      onClick={() => onPageChange(page)}
      leadingIcon={icon === "chevron-left" ? icon : undefined}
      trailingIcon={icon === "chevron-right" ? icon : undefined}
    >
      {label}
    </TextButton>
  );
  return (
    <div className={cx("flex items-center justify-between gap-space-4", className)}>
      {step("Prev", "chevron-left", currentPage - 1, currentPage <= 1)}
      <Pagination pageCount={pageCount} currentPage={currentPage} onPageChange={onPageChange} label={label} size="md" className="hidden ui-desktop:block" />
      <Pagination pageCount={pageCount} currentPage={currentPage} onPageChange={onPageChange} label={label} size="sm" className="ui-desktop:hidden" />
      {step("Next", "chevron-right", currentPage + 1, currentPage >= pageCount)}
    </div>
  );
}
