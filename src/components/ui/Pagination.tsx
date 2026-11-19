"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { paginationNumberClasses, type NumberSize } from "./paginationStyles";
import { cx, type PreviewState } from "./shared";

type PaginationNumberProps = {
  page: number;
  size?: NumberSize;
  active?: boolean;
  href?: string;
  onSelect?: (page: number) => void;
  previewState?: PreviewState;
};

/** Figma "Pagination Number". */
export function PaginationNumber({ page, size = "md", active = false, href, onSelect, previewState }: PaginationNumberProps) {
  const className = cx(paginationNumberClasses(size, active), "cursor-pointer");
  const content = (
    <>
      <span className="sr-only">Page </span>
      {page}
    </>
  );

  return href ? (
    <Link href={href} aria-current={active ? "page" : undefined} data-state={previewState} className={className}>
      {content}
    </Link>
  ) : (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      data-state={previewState}
      onClick={() => onSelect?.(page)}
      className={className}
    >
      {content}
    </button>
  );
}

type PaginationProps = {
  pageCount: number;
  currentPage: number;
  /** Builds a link for each page. Use this for page-based lists. */
  hrefForPage?: (page: number) => string;
  onPageChange?: (page: number) => void;
  size?: NumberSize;
  label?: string;
  className?: string;
};

export function Pagination({
  pageCount,
  currentPage,
  hrefForPage,
  onPageChange,
  size = "md",
  label = "Pagination",
  className,
}: PaginationProps) {
  return (
    <nav aria-label={label} className={className}>
      <ul className="flex flex-wrap items-center gap-space-2">
        {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
          <li key={page}>
            <PaginationNumber
              page={page}
              size={size}
              active={page === currentPage}
              href={hrefForPage?.(page)}
              onSelect={onPageChange}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

type PaginationDotsProps = {
  count: number;
  current: number;
  onSelect?: (index: number) => void;
  /** Accessible name, for example "Product images". */
  label: string;
  itemLabel?: (index: number) => string;
  overlay?: boolean;
  className?: string;
};

/** Figma "Pagination Dots" for carousels. Indexes start at 0. */
export function PaginationDots({
  count,
  current,
  onSelect,
  label,
  itemLabel = (index) => `Slide ${index + 1}`,
  overlay = false,
  className,
}: PaginationDotsProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-space-3 py-space-2 backdrop-blur-md",
        overlay ? "border-white-alpha-10 bg-white-alpha-10" : "border-black-alpha-5 bg-black-alpha-2",
        className,
      )}
    >
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={itemLabel(index)}
          aria-current={index === current ? "true" : undefined}
          onClick={() => onSelect?.(index)}
          className={cx(
            "ui-transition relative size-space-2 cursor-pointer rounded-full after:absolute after:-inset-x-[3px] after:-inset-y-space-2",
            overlay
              ? cx("ui-focus:outline-base-white", index === current ? "bg-secondary-skin" : "bg-white-alpha-30")
              : index === current
                ? "bg-primary-leather"
                : "bg-black-alpha-20",
          )}
        />
      ))}
    </div>
  );
}

export function PaginationGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-space-2">{children}</div>;
}
