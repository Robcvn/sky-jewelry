"use client";

import { useRouter } from "next/navigation";
import { pushQuery } from "@/components/builder/useQuery";
import { useId, type FormEvent, type RefObject } from "react";
import { Icon } from "@/components/ui/Icon";
import { cx, withBasePath } from "@/components/ui/shared";
import type { HeaderContent } from "@/content/site";

/** Sends a search to /search/?q= (the results page reads it). Does nothing but focus the field for an empty query. */
export function useSearchSubmit(onDone?: () => void) {
  const router = useRouter();

  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem("q") as HTMLInputElement | null;
    const query = input?.value.trim() ?? "";
    if (!query) {
      input?.focus();
      return;
    }
    onDone?.();
    // Already on the results page: a new history entry the page hears at once (it reads the URL with useQuery).
    if (/\/search\/$/.test(window.location.pathname)) pushQuery(new URLSearchParams({ q: query }));
    else router.push(`/search/?q=${encodeURIComponent(query)}`);
  };
}

type SearchPanelProps = {
  content: HeaderContent["searchPanel"];
  id?: string;
  open?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
  onSubmitted?: () => void;
  /** Render in the flow instead of overlaying the page (the style guide, and the results page's query band). */
  inline?: boolean;
  /** The results page (4931:73092): the query typed in, and Close Large in place of the arrow (Enter still searches). */
  defaultValue?: string;
  onClose?: () => void;
  closeLabel?: string;
  className?: string;
};

/** Figma "Mega Menu / Search": opens from the header search icon. */
export function SearchPanel({ content, id, open = true, inputRef, onSubmitted, inline = false, defaultValue, onClose, closeLabel, className }: SearchPanelProps) {
  const inputId = useId();
  const onSubmit = useSearchSubmit(onSubmitted);

  return (
    <div
      id={id}
      hidden={!open}
      className={cx(
        "bg-secondary-ivory text-primary-leather",
        !inline && "absolute inset-x-0 top-full z-30 transition-opacity duration-200 ease-out starting:opacity-0",
        className,
      )}
    >
      <form
        role="search"
        aria-label={content.label}
        action={withBasePath("/search/")}
        method="get"
        onSubmit={onSubmit}
        className="flex flex-col gap-space-6 px-space-6 pt-space-6 pb-space-10"
      >
        <label htmlFor={inputId} className="type-overline-xs-medium">
          {content.label}
        </label>
        <div className="ui-transition-fast flex items-center justify-between gap-space-6 py-space-2 has-[input:focus-visible]:shadow-[inset_0_-1px_0_var(--color-primary-leather)]">
          <input
            ref={inputRef}
            id={inputId}
            name="q"
            type="search"
            autoComplete="off"
            enterKeyHint="search"
            defaultValue={defaultValue}
            placeholder={content.placeholder}
            className="type-heading-caps-3xl h-space-14 min-w-0 flex-1 bg-transparent text-primary-leather placeholder:text-secondary-gold focus-visible:outline-none [&::-webkit-search-cancel-button]:appearance-none"
          />
          {onClose ? (
            <button type="button" aria-label={closeLabel} onClick={onClose} className="ui-transition-fast flex shrink-0 cursor-pointer text-primary-leather hover:text-black-alpha-60">
              <Icon name="close-large" size={48} />
            </button>
          ) : (
            <button
              type="submit"
              aria-label={content.submitLabel}
              className="ui-transition-fast flex shrink-0 cursor-pointer text-primary-leather hover:text-black-alpha-60"
            >
              <Icon name="arrow-right" size={48} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
