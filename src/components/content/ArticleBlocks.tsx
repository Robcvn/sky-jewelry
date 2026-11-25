"use client";

import { useEffect, useId, useState } from "react";
import { CccPanel, GradePicker, type CccTab } from "@/components/builder/CccModal";
import { Button, ButtonLink, ButtonText } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { DialogShell, dialogPanelMotion } from "@/components/ui/Modal";
import { Picture, type ImageRef } from "@/components/ui/Picture";
import { ProductCard } from "@/components/ui/ProductCard";
import { ScrollArea } from "@/components/ui/Scrollbar";
import { cx } from "@/components/ui/shared";
import type { ArticleBlock } from "@/content/article";
import { productListContent } from "@/content/product-list";
import type { Product } from "@/content/products";
import { openingVariant } from "@/lib/swatches";

type GradeScaleBlock = Extract<ArticleBlock, { _type: "gradeScale" }>;

/**
 * Resource Detail's "Choose a Clarity Grade" and "Choose a Carat Weight" (3565:101773, mobile 3587:129748): the photo
 * (with the round 310 / 132 loupe on the clarity one), the label, Figma's "Slider Option" row and a line about the chosen
 * grade. The row is the builder's grade picker (native radios; arrow keys move between grades).
 */
export function GradeScale({ block }: { block: GradeScaleBlock }) {
  const id = useId();
  const [value, setValue] = useState(block.initial);
  const chosen = block.options.find((option) => option.value === value);
  return (
    <div className="flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden rounded-4 bg-secondary-ivory">
        <Picture image={block.image} sizes={{ desktop: "(width > 90rem) min(calc(66.05vw - 127px), 1141px), (width >= 90rem) 51.5rem, 57vw", mobile: "calc(100vw - 40px)" }} className="absolute inset-0 size-full object-cover" />
        {/* Figma's loupe ring is faint: a 4px #fcfcfa stroke at 10% (res-1440-6; Task 30). */}
        {block.loupe ? (
          // Figma: 310 at (124, 73) on the 824 x 618 photo; 132 at (53, 31) on the 350 x 263 one: the same place, larger on desktop.
          <span className="absolute top-[11.8%] left-[15.1%] block aspect-square w-[37.7%] overflow-hidden rounded-full border-4 border-white-alpha-10 shadow-lg ui-desktop:left-[15%] ui-desktop:w-[37.6%]">
            <Picture image={block.loupe} sizes={{ desktop: "(width > 90rem) min(calc(24.8vw - 55px), 421px), 310px", mobile: "132px" }} className="size-full object-cover" />
          </span>
        ) : null}
      </div>
      <p id={`${id}-label`} className="type-body-sm-medium mt-space-3 ui-desktop:type-body-md-medium ui-desktop:mt-space-4">
        {block.label}
      </p>
      {/* The picker's row starts 8px into it: 20px (mobile) and 24px (desktop) from the label to the slider line. */}
      <div className="mt-space-3 ui-desktop:mt-space-4">
        <GradePicker name={`${id}-grade`} legend={block.label} scale={block.options.map(({ value: v, label }) => ({ value: v, label }))} value={value} onChange={setValue} />
      </div>
      {/* The picker is 44px tall; the mobile options are 32 (+8), so its last 4px already make Figma's 4px gap. */}
      <p aria-live="polite" className="type-body-xs-regular ui-desktop:type-body-sm-regular ui-desktop:mt-space-2">
        {chosen?.description}
      </p>
    </div>
  );
}

/**
 * Post Detail's "Button - Overlay" on a photo (MD on desktop, XS on mobile, 24 / 16 in from the bottom-left corner).
 * With products it opens the Featured Product Flyout (desktop 4142:56821: a 400px panel at the top right; mobile
 * 4142:71912: a sheet from the bottom with the cards in a swipe row). With `href` it is a link ("Customize this ring" goes
 * to the ring builder's first step, an inference: Figma gives it no destination). With neither it is drawn but inert.
 */
/**
 * `trailing`: the customer story frame (6287:176402) puts the link's icon after the label, where Post Detail's frame
 * puts it before; each page follows its own frame (Open questions; Task 30, cstory-1440-7). Desktop only: there is no
 * mobile story frame.
 */
export function FigureAction({ label, icon, products, href, trailing = false }: { label: string; icon: "plus" | "sparkle"; products?: Product[]; href?: string; trailing?: boolean }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const place = "absolute bottom-space-4 left-space-4 ui-desktop:bottom-space-6 ui-desktop:left-space-6";
  if (href) {
    return (
      <span className={place}>
        <span className="flex ui-desktop:hidden">
          <ButtonLink href={href} overlay size="xs" leftIcon={icon}>
            {label}
          </ButtonLink>
        </span>
        <span className="hidden ui-desktop:flex">
          <ButtonLink href={href} overlay size="md" leftIcon={trailing ? undefined : icon} rightIcon={trailing ? icon : undefined}>
            {label}
          </ButtonLink>
        </span>
      </span>
    );
  }
  if (!products?.length) {
    return (
      <span className={place}>
        <span className="flex ui-desktop:hidden">
          <ButtonText overlay size="xs" leftIcon={icon}>
            {label}
          </ButtonText>
        </span>
        <span className="hidden ui-desktop:flex">
          <ButtonText overlay size="md" leftIcon={icon}>
            {label}
          </ButtonText>
        </span>
      </span>
    );
  }
  return (
    <>
      <span className={place}>
        <span className="flex ui-desktop:hidden">
          <Button overlay size="xs" rightIcon={icon} aria-haspopup="dialog" onClick={() => setOpen(true)}>
            {label}
          </Button>
        </span>
        <span className="hidden ui-desktop:flex">
          <Button overlay size="md" rightIcon={icon} aria-haspopup="dialog" onClick={() => setOpen(true)}>
            {label}
          </Button>
        </span>
      </span>
      <DialogShell open={open} onClose={() => setOpen(false)} labelledBy={`${id}-title`} placement="top-end">
        {({ visible }) => (
          <div
            data-flyout
            className={cx(
              // Mobile: a sheet pinned to the bottom (the shell pads 24 round it on every side, so it is pulled out to the edges).
              "flex max-h-[calc(100dvh-var(--spacing-space-6))] w-[calc(100%+var(--spacing-space-12))] flex-col gap-space-6 self-end overflow-y-auto overscroll-contain rounded-t-8 bg-secondary-skin pt-space-5 pb-space-8 text-primary-leather shadow-lg -m-space-6 ui-desktop:m-0",
              "ui-desktop:max-h-[calc(100dvh-var(--spacing-space-12))] ui-desktop:w-[25rem] ui-desktop:self-start ui-desktop:rounded-8 ui-desktop:px-space-8 ui-desktop:pt-space-6 ui-desktop:pb-space-8",
              dialogPanelMotion(visible),
            )}
          >
            <div className="flex items-start justify-between gap-space-4 px-space-5 ui-desktop:px-0">
              <h2 id={`${id}-title`} className="type-heading-md">
                {label}
              </h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="ui-transition-fast -m-space-1 cursor-pointer rounded-4 p-space-1 text-black-alpha-50 hover:text-primary-leather">
                <Icon name="close" size={24} />
              </button>
            </div>
            {/* Desktop: the cards stacked. Mobile: a swipe row of 290px cards with the scrollbar under it. */}
            <ul className="hidden flex-col gap-space-8 ui-desktop:flex">
              {products.map((product) => (
                <li key={product.slug}>
                  <ProductCard plain product={product} initialVariant={openingVariant(product)} labels={productListContent.card} size="carousel" />
                </li>
              ))}
            </ul>
            {/* The scrollbar is inset 20px each side (w-auto: the Scrollbar's own w-full plus these margins would run 20px past the sheet). */}
            <ScrollArea label={label} className="ui-desktop:hidden" regionClassName="px-space-5 scroll-px-space-5" scrollbarClassName="mx-space-5 mt-space-8 w-auto!">
              <ul className="flex gap-space-4">
                {products.map((product) => (
                  <li key={product.slug} className="w-[18.125rem] shrink-0 snap-start">
                    <ProductCard plain product={product} initialVariant={openingVariant(product)} labels={productListContent.card} size="carousel" />
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}
      </DialogShell>
    </>
  );
}

/** "Your Diamond's Qualities" (3565:101773, desktop only): the builder's cut, color and clarity explainer as a card in the article. */
export function Qualities({ heading }: { heading: string }) {
  const [tab, setTab] = useState<CccTab>("cut");
  const id = useId();
  return (
    <section aria-labelledby={id} className="hidden flex-col gap-space-11 ui-desktop:flex">
      <h2 id={id} className="type-heading-2xl">
        {heading}
      </h2>
      <div className="flex flex-col gap-space-6 rounded-8 border border-black-alpha-15 bg-base-white p-[calc(var(--spacing-space-8)-1px)] text-primary-leather">
        {/* The card's 16:9 frame is 427.5 tall where the modal's is 234; the drawings keep the modal's size. */}
        <CccPanel tab={tab} onTabChange={setTab} drawingScale={234 / 427.5} />
      </div>
    </section>
  );
}

export type ArticleSection = { id: string; label: string; nav: string };

/**
 * The article's sections. Desktop: the label ("The 4C's") and a "Menu Item" per section in the left column, sticky
 * under the header, the one being read marked Active. Mobile (4142:57639, menu 4142:72011): a Dropdown floating at
 * the bottom right ("The 4C's: Diamond Cut") that opens the same list above it.
 */
export function SectionNav({ label, sections, floating = true }: { label: string; sections: ArticleSection[]; floating?: boolean }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const targets = sections.map((section) => document.getElementById(section.id)).filter((node): node is HTMLElement => Boolean(node));
    const update = () => {
      // The section whose heading is the last one above a line a third of the way down the screen.
      const line = window.innerHeight / 3;
      let current = targets[0]?.id ?? "";
      for (const node of targets) if (node.getBoundingClientRect().top <= line) current = node.id;
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sections]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const onClick = (event: MouseEvent) => !(event.target as HTMLElement).closest("[data-section-nav]") && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  const current = sections.find((section) => section.id === active) ?? sections[0];
  const item = (section: ArticleSection, mobile: boolean) => (
    <li key={section.id}>
      <a
        href={`#${section.id}`}
        aria-current={section.id === active ? "location" : undefined}
        onClick={() => setOpen(false)}
        className={cx(
          // Figma "Menu Item": 34 tall, 16 / 8 padding, ui-sm-medium; Active has the ivory fill.
          "ui-transition type-ui-sm-medium flex rounded-4 py-space-2 pr-space-4 pl-space-3 text-primary-leather hover:bg-secondary-ivory",
          section.id === active && "bg-secondary-ivory",
          mobile && "py-space-2",
        )}
      >
        {/* Figma: the desktop list names the sections briefly ("Cut"); the mobile menu uses the headings ("Diamond Cut"). */}
        {mobile ? section.label : section.nav}
      </a>
    </li>
  );

  return (
    <>
      {/* Figma: the label 8px below the article's first heading, the items 16px under it, 8px apart. */}
      <nav aria-label={label} className="sticky top-[calc(var(--sticky-header-height)+var(--spacing-space-6))] hidden flex-col gap-space-4 pt-space-2 ui-desktop:flex">
        <p className="type-overline-xs-medium px-space-4 text-primary-hazel">{label}</p>
        <ul className="flex flex-col gap-space-2">{sections.map((section) => item(section, false))}</ul>
      </nav>
      <div data-section-nav className={cx("fixed right-space-4 bottom-space-4 z-30 ui-desktop:hidden", !floating && "hidden")}>
        {open ? (
          <div id={menuId} className="absolute right-0 bottom-full mb-space-2 w-70 rounded-4 border border-secondary-gold bg-secondary-skin p-space-2 shadow-lg">
            <p className="type-overline-xs-medium px-space-3 py-space-2 text-primary-hazel">{label}</p>
            <ul className="flex flex-col">{sections.map((section) => item(section, true))}</ul>
          </div>
        ) : null}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
          className="ui-transition type-ui-xs-regular flex min-h-space-10 cursor-pointer items-center gap-space-1 rounded-4 border border-secondary-gold bg-secondary-skin px-space-3 text-primary-leather shadow-lg"
        >
          <span className="px-space-1">
            {/* Figma (4142:57639): one Regular run, "The 4C's: Diamond Cut", and a Chevron Up on the closed button, whose
                menu opens upwards (Task 30, ressub-390-1 / -2). */}
            {label}: {current?.label}
          </span>
          <Icon name={open ? "chevron-down" : "chevron-up"} size={16} />
        </button>
      </div>
    </>
  );
}


/** The three colour samples: a row of three on desktop, a swipe row of 289px photos with a scrollbar on mobile. */
export function Gallery({ items, label }: { items: Array<{ _key: string; image: ImageRef; caption: string }>; label: string }) {
  return (
    <ScrollArea label={label} regionClassName="ui-desktop:overflow-visible" scrollbarClassName="mt-space-6 ui-desktop:hidden">
      <ul className="flex gap-space-4 ui-desktop:grid ui-desktop:w-full ui-desktop:grid-cols-3 ui-desktop:gap-space-6">
        {items.map((item) => (
          <li key={item._key} className="flex w-[18.0625rem] shrink-0 snap-start flex-col gap-space-3 ui-desktop:w-auto ui-desktop:gap-space-4">
            <span className="relative block aspect-[4/3] overflow-hidden rounded-4 bg-secondary-ivory">
              <Picture image={item.image} sizes={{ desktop: "(width > 90rem) min(calc(22.09vw - 59px), 365px), 259px", mobile: "289px" }} className="absolute inset-0 size-full object-cover" />
            </span>
            <span className="type-body-sm-medium ui-desktop:type-body-md-medium">{item.caption}</span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
