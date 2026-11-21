"use client";

import { useId, useRef, useState } from "react";
import { useQuery } from "@/components/builder/useQuery";
import { settingHref, settingTitle, stonesHref } from "@/components/builder/ring";
import { PromoCard } from "@/components/builder/PromoCard";
import { SupportFaqs } from "@/components/content/SupportParts";
import { earringSettingHref } from "@/components/earrings/routes";
import { SearchPanel, useSearchSubmit } from "@/components/site/SearchPanel";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Dropdown } from "@/components/ui/Dropdown";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { DialogShell, dialogPanelMotion } from "@/components/ui/Modal";
import { PostCard } from "@/components/ui/PostCard";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductCardSearch } from "@/components/ui/ProductCardSearch";
import { RadioOption } from "@/components/ui/Radio";
import { ResourceCardSmall } from "@/components/ui/ResourceCard";
import { RichText } from "@/components/ui/RichText";
import { ScrollArea } from "@/components/ui/Scrollbar";
import { TextButton } from "@/components/ui/TextButton";
import { cx, withBasePath } from "@/components/ui/shared";
import type { PromoCard as PromoCardContent } from "@/content/builder";
import { builderContent } from "@/content/builder";
import { earringsContent } from "@/content/earrings";
import { productListContent } from "@/content/product-list";
import { formatPrice, productHref, type ProductVariant } from "@/content/products";
import { searchContent as text, type SearchType } from "@/content/search";
import { siteHeader } from "@/content/site";
import { addToBag } from "@/lib/bag";
import { matches, queryWords } from "@/lib/search";
import type { SearchIndex, SearchProduct } from "@/lib/searchIndex";

const TYPES = text.types.map((type) => type.value);
const SORTS = productListContent.sortOptions;
type Sort = (typeof SORTS)[number]["value"];

/** The page's state in the URL, as the product lists keep theirs: ?q=&type=products,faqs&sort=price-asc&more=products:2 */
function parse(search: string) {
  const params = new URLSearchParams(search);
  const q = (params.get("q") ?? "").trim();
  const types = (params.get("type") ?? "").split(",").filter((value): value is SearchType => (TYPES as string[]).includes(value));
  const sort = (SORTS.some((option) => option.value === params.get("sort")) ? params.get("sort") : "best-match") as Sort;
  const more: Partial<Record<SearchType, number>> = {};
  for (const part of (params.get("more") ?? "").split(",")) {
    const [type, count] = part.split(":");
    if ((TYPES as string[]).includes(type) && Number(count) > 1) more[type as SearchType] = Math.floor(Number(count));
  }
  return { q, types, sort, more };
}
type State = ReturnType<typeof parse>;

function serialize(state: State) {
  const params = new URLSearchParams();
  if (state.q) params.set("q", state.q);
  if (state.types.length) params.set("type", TYPES.filter((type) => state.types.includes(type)).join(","));
  if (state.sort !== "best-match") params.set("sort", state.sort);
  const more = TYPES.filter((type) => (state.more[type] ?? 1) > 1).map((type) => `${type}:${state.more[type]}`);
  if (more.length) params.set("more", more.join(","));
  return params;
}

/** How many of a section show: the first block, plus each View More's block. */
const count = (type: SearchType, pages: number, breakpoint: "desktop" | "mobile") =>
  breakpoint === "mobile" ? text.pageSize.mobile[type] * pages : text.pageSize.desktop[type] + text.pageSize.more[type] * (pages - 1);

/**
 * Search Results (Figma desktop 4931:73092, mobile 4979:47760). Searches the build-time index in the browser: every
 * word of the query must appear in an item's title, type, topic, tags or text. Desktop: the header's search panel open
 * with the query (Close Large closes it), the count, the type chips with Clear Filters, Sort by, then Products (with
 * two promo cards), Education, Customer Stories and FAQs, each with View More. Mobile: the search field, the count,
 * Filters and the chosen types, then the same sections with the mobile cards, and View More (added: none is drawn).
 */
export function SearchResults({ index, promos }: { index: SearchIndex; promos: PromoCardContent[] }) {
  const [search, setQuery] = useQuery();
  const state = parse(search);
  const set = (patch: Partial<State>) => setQuery(serialize({ ...state, more: {}, ...patch }));
  const [bandOpen, setBandOpen] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // A few hundred items: filtered on each render (the React Compiler memoizes it).
  const words = queryWords(state.q);
  const found = (() => {
    const products = index.products.filter((item) => matches(item.haystack, words));
    if (state.sort !== "best-match") {
      // As the product lists sort: by the price the card shows (its first variant); ties keep their order.
      const price = (item: SearchProduct) => item.product.variants[0].price;
      products.sort((a, b) => (state.sort === "price-asc" ? price(a) - price(b) : price(b) - price(a)));
    }
    return {
      products,
      education: index.education.filter((item) => matches(item.haystack, words)),
      stories: index.stories.filter((item) => matches(item.haystack, words)),
      faqs: index.faqs.filter((item) => matches(item.haystack, words)),
    };
  })();

  const shownTypes = TYPES.filter((type) => (!state.types.length || state.types.includes(type)) && found[type].length > 0);
  const total = TYPES.filter((type) => !state.types.length || state.types.includes(type)).reduce((sum, type) => sum + found[type].length, 0);
  const pages = (type: SearchType) => state.more[type] ?? 1;
  const viewMore = (type: SearchType) => setQuery(serialize({ ...state, more: { ...state.more, [type]: pages(type) + 1 } }));
  const toggle = (type: SearchType) => set({ types: state.types.includes(type) ? state.types.filter((item) => item !== type) : [...state.types, type] });

  const band = (
    <>
      {bandOpen ? (
        <SearchPanel
          key={`d-${state.q}`}
          content={siteHeader.searchPanel}
          inline
          defaultValue={state.q}
          onClose={() => {
            setBandOpen(false);
            headingRef.current?.focus();
          }}
          closeLabel={text.closeLabel}
          className="hidden border-b border-primary-leather ui-desktop:block"
        />
      ) : null}
      <MobileSearchField key={`m-${state.q}`} query={state.q} />
    </>
  );

  if (!words.length || !total) {
    return (
      <>
        {band}
        <div className="site-container flex flex-col gap-space-8 pt-space-11 pb-space-11 text-primary-leather ui-desktop:gap-space-11 ui-desktop:pt-space-15 ui-desktop:pb-space-15">
          {words.length ? (
            <h1 ref={headingRef} tabIndex={-1} className="type-heading-caps-lg text-center">
              <RichText value={text.heading(0, state.q)} emClassName="type-heading-italic-lg" />
            </h1>
          ) : (
            <h1 ref={headingRef} tabIndex={-1} className="sr-only">
              {text.label}
            </h1>
          )}
          <EmptyState message={words.length ? text.empty.noResults(state.q) : text.empty.noQuery} />
        </div>
      </>
    );
  }

  return (
    <>
      {band}
      <div className="site-container pt-space-11 pb-space-11 text-primary-leather ui-desktop:pt-space-15 ui-desktop:pb-space-15">
        <h1 ref={headingRef} tabIndex={-1} aria-live="polite" className="type-heading-caps-lg text-center">
          <RichText value={text.heading(total, state.q)} emClassName="type-heading-italic-lg" />
        </h1>

        {/* Desktop: the four type chips (a chosen one has the leather outline and ×), Clear Filters, and Sort by on the right. */}
        <div className="mt-space-13 hidden items-center justify-between gap-space-6 ui-desktop:flex">
          <div className="flex items-center gap-space-6">
            <div role="group" aria-label="Filter by type" className="flex items-center gap-space-3">
              {text.types.map((type) => {
                const on = state.types.includes(type.value);
                return (
                  <button
                    key={type.value}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(type.value)}
                    className={cx(
                      "type-ui-xs-regular ui-transition-fast inline-flex min-h-space-10 cursor-pointer items-center gap-0.5 rounded-4 border bg-secondary-skin px-space-3",
                      on ? "border-primary-leather" : "border-secondary-gold hover:border-primary-leather",
                    )}
                  >
                    <span className="px-space-1">{type.chip}</span>
                    {on ? <Icon name="close" size={14} /> : null}
                  </button>
                );
              })}
            </div>
            {state.types.length ? (
              <TextButton size="sm" variant="caps" leadingIcon="close" onClick={() => set({ types: [] })}>
                {text.clearFilters}
              </TextButton>
            ) : null}
          </div>
          <Dropdown
            size="sm"
            width="auto"
            label={text.sortLabel}
            valuePrefix={text.sortLabel}
            options={SORTS.map(({ value, shortLabel }) => ({ value, label: shortLabel }))}
            value={state.sort}
            onChange={(sort) => set({ sort: sort as Sort })}
            panelWidth="w-max min-w-full"
            panelAlign="end"
          />
        </div>

        {/* Mobile: Filters (n), opening the filter sheet, then the chosen types as removable Tags. */}
        <div className="mt-space-5 flex flex-col gap-space-2 ui-desktop:hidden">
          <Button variant="secondary" size="sm" leftIcon="filter" aria-haspopup="dialog" onClick={() => setSheetOpen(true)} className="w-full">
            {text.filters}
            {state.types.length ? ` (${state.types.length})` : ""}
          </Button>
          {state.types.length ? (
            <ul className="flex flex-wrap gap-space-2">
              {text.types
                .filter((type) => state.types.includes(type.value))
                .map((type) => (
                  <li key={type.value}>
                    <button
                      type="button"
                      onClick={() => toggle(type.value)}
                      aria-label={`Remove ${type.chip}`}
                      className="type-ui-xs-regular inline-flex min-h-space-8 cursor-pointer items-center gap-0.5 rounded-4 border border-base-black bg-secondary-ivory px-space-3"
                    >
                      <span className="px-space-1">{type.chip}</span>
                      <Icon name="close" size={14} />
                    </button>
                  </li>
                ))}
            </ul>
          ) : null}
        </div>

        <div className="mt-space-10 flex flex-col gap-space-10 ui-desktop:mt-space-6 ui-desktop:gap-space-15">
          {shownTypes.map((type) => (
            <Section key={type} type={type} label={text.types.find((item) => item.value === type)!.heading}>
              {type === "products" ? (
                <Products items={found.products} pages={pages("products")} promos={promos} />
              ) : type === "education" ? (
                <Education items={found.education} pages={pages("education")} />
              ) : type === "stories" ? (
                <Stories items={found.stories} pages={pages("stories")} />
              ) : (
                <Faqs items={found.faqs} pages={pages("faqs")} />
              )}
              {/* View More (the desktop frame's Button, MD, Secondary, 200 wide). The mobile frame draws none; it is added so every result can be reached on a phone (Deviations). */}
              {found[type].length > count(type, pages(type), "desktop") ? (
                <div className="mt-space-10 hidden justify-center ui-desktop:flex">
                  <Button variant="secondary" size="md" onClick={() => viewMore(type)} className="w-50">
                    {text.viewMore}
                  </Button>
                </div>
              ) : null}
              {found[type].length > count(type, pages(type), "mobile") ? (
                <div className="mt-space-6 flex justify-center ui-desktop:hidden">
                  <Button variant="secondary" size="md" onClick={() => viewMore(type)} className="w-50">
                    {text.viewMore}
                  </Button>
                </div>
              ) : null}
            </Section>
          ))}
        </div>
      </div>
      <FilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)} types={state.types} sort={state.sort} onApply={(types, sort) => set({ types, sort })} />
    </>
  );
}

/** Each section: a gold rule, then its heading (heading-lg; mobile heading-md) 40 / 24 under it, the cards 40 / 24 under that. */
function Section({ type, label, children }: { type: SearchType; label: string; children: React.ReactNode }) {
  const id = `search-${type}`;
  return (
    <section aria-labelledby={id} data-search-section={type} className="border-t border-secondary-gold pt-space-6 ui-desktop:pt-space-10">
      <h2 id={id} className="type-heading-md ui-desktop:type-heading-lg">
        {label}
      </h2>
      <div className="mt-space-6 ui-desktop:mt-space-10">{children}</div>
    </section>
  );
}

function Products({ items, pages, promos }: { items: SearchProduct[]; pages: number; promos: PromoCardContent[] }) {
  const desktop = items.slice(0, count("products", pages, "desktop"));
  const mobile = items.slice(0, count("products", pages, "mobile"));
  const card = (item: SearchProduct) => {
    if (item.kind === "setting") {
      const note = (variant: ProductVariant) => (item.withStone ? `${builderContent.settings.withStone} ${formatPrice(variant.price + item.withStone)}` : null);
      return {
        title: settingTitle(item.product),
        href: (variant: ProductVariant) => settingHref(item.product.slug, { metal: variant.metal }),
        priceNote: note,
        action: { label: builderContent.settings.chooseSetting, href: (variant: ProductVariant) => stonesHref({ setting: item.product.slug, metal: variant.metal }) },
      };
    }
    if (item.kind === "earring-setting") {
      const href = (variant: ProductVariant) => earringSettingHref(item.product.slug, { metal: variant.metal });
      return { title: settingTitle(item.product), href, priceNote: () => null, action: { label: earringsContent.settings.customize, href } };
    }
    return null;
  };
  return (
    <>
      <ul className="hidden grid-cols-4 gap-space-4 ui-desktop:grid">
        {desktop.map((item, index) => {
          const builder = card(item);
          return (
            <PromoSlot key={item.id} index={index} promos={promos}>
              <li>
                {builder ? (
                  <ProductCard product={item.product} initialVariant={item.product.variants[0]} labels={productListContent.card} builder={builder} />
                ) : (
                  <ProductCard product={item.product} initialVariant={item.product.variants[0]} labels={productListContent.card} onAddToBag={(product, variant) => addToBag(product, variant)} />
                )}
              </li>
            </PromoSlot>
          );
        })}
      </ul>
      <ul className="flex flex-col gap-space-4 ui-desktop:hidden">
        {mobile.map((item) => {
          const builder = card(item);
          return (
            <li key={item.id}>
              <ProductCardSearch product={item.product} title={builder?.title} href={builder ? builder.href : () => productHref(item.product)} priceNote={builder?.priceNote} />
            </li>
          );
        })}
      </ul>
    </>
  );
}

/** The builder's promo cards at the frame's places: the single one before the fourth product, the wide one before the eighth. */
function PromoSlot({ index, promos, children }: { index: number; promos: PromoCardContent[]; children: React.ReactNode }) {
  const here = text.promos.filter((slot) => slot.after === index).map((slot) => promos.find((promo) => promo._key === slot.key)).filter((promo): promo is PromoCardContent => Boolean(promo));
  return (
    <>
      {here.map((promo) => (
        <li key={promo._key} className={promo.width.desktop === "wide" ? "col-span-2" : undefined}>
          <PromoCard promo={promo} breakpoint="desktop" className="flex" />
        </li>
      ))}
      {children}
    </>
  );
}

function Education({ items, pages }: { items: SearchIndex["education"]; pages: number }) {
  return (
    <>
      <ul className="hidden grid-cols-3 gap-space-6 ui-desktop:grid">
        {items.slice(0, count("education", pages, "desktop")).map((item) => (
          <li key={item.id}>
            <PostCard
              variant={item.kind === "resource" ? "resource" : "post"}
              title={item.title}
              excerpt={item.excerpt}
              topic={item.topic}
              date={item.kind === "post" ? item.date : undefined}
              readTime={item.readTime ?? undefined}
              href={item.href}
              image={item.image}
              sizes={{ desktop: "(width >= 90rem) 25rem, 28vw", mobile: "calc(100vw - 40px)" }}
            />
          </li>
        ))}
      </ul>
      <ul className="flex flex-col gap-space-4 ui-desktop:hidden">
        {items.slice(0, count("education", pages, "mobile")).map((item) => (
          <li key={item.id}>
            <ResourceCardSmall topic={item.topic} title={item.title} href={item.href} image={item.square} sizes={{ desktop: "128px", mobile: "104px" }} />
          </li>
        ))}
      </ul>
    </>
  );
}

function Stories({ items, pages }: { items: SearchIndex["stories"]; pages: number }) {
  const card = (item: SearchIndex["stories"][number]) => (
    <FeatureCard title={item.title} body={item.excerpt} ctaLabel={text.storyCta} href={item.href} image={item.image} sizes={{ desktop: "(width >= 90rem) 25rem, 28vw", mobile: "288px" }} className="aspect-[4/5] w-full" />
  );
  return (
    <>
      <ul className="hidden grid-cols-3 gap-space-6 ui-desktop:grid">
        {items.slice(0, count("stories", pages, "desktop")).map((item) => (
          <li key={item.id}>{card(item)}</li>
        ))}
      </ul>
      {/* Mobile: a swipe row of 288px cards with the scrollbar 24 under it, as Home's Customer Stories. */}
      <ScrollArea label="Customer Stories" className="ui-desktop:hidden" scrollbarClassName="mt-space-6">
        <ul className="flex gap-space-4">
          {items.slice(0, count("stories", pages, "mobile")).map((item) => (
            <li key={item.id} className="w-[18rem] shrink-0 snap-start">
              {card(item)}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </>
  );
}

function Faqs({ items, pages }: { items: SearchIndex["faqs"]; pages: number }) {
  return (
    <>
      <div className="hidden ui-desktop:block">
        <SupportFaqs items={items.slice(0, count("faqs", pages, "desktop")).map((item) => ({ _key: item.id, question: item.question, answer: item.answer }))} openOnDesktop={1} />
      </div>
      <div className="ui-desktop:hidden">
        <SupportFaqs items={items.slice(0, count("faqs", pages, "mobile")).map((item) => ({ _key: item.id, question: item.question, answer: item.answer }))} openOnDesktop={-1} />
      </div>
    </>
  );
}

/** Mobile: the search screen's field (4979:47688) with the query; its × clears the field, Search runs it. */
function MobileSearchField({ query }: { query: string }) {
  const id = useId();
  const onSubmit = useSearchSubmit();
  const ref = useRef<HTMLInputElement>(null);
  return (
    <form role="search" aria-label={text.label} action={withBasePath("/search/")} method="get" onSubmit={onSubmit} className="ui-desktop:hidden">
      <label htmlFor={id} className="sr-only">
        {text.label}
      </label>
      <Input
        ref={ref}
        id={id}
        name="q"
        type="search"
        label={siteHeader.searchPanel.mobilePlaceholder}
        defaultValue={query}
        enterKeyHint="search"
        autoComplete="off"
        rightIcon="close"
        rightIconLabel={text.clearLabel}
        onRightIconClick={() => {
          if (ref.current) {
            ref.current.value = "";
            ref.current.focus();
          }
        }}
        className="[&>div]:rounded-none [&>div]:border-x-0 [&>div]:border-t-0"
      />
    </form>
  );
}

/** No query, or nothing found: the product list's empty state (4045:50390) with the five popular searches. */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-space-5 rounded-4 border border-secondary-gold px-space-8 py-space-10 text-center text-primary-leather ui-desktop:gap-space-8 ui-desktop:px-space-15 ui-desktop:py-space-13">
      <p className="type-heading-sm max-w-[24.875rem] ui-desktop:type-heading-md">{message}</p>
      <div className="flex flex-col items-center gap-space-4">
        <h2 className="type-overline-xs-medium">{text.empty.popularHeading}</h2>
        <ul className="flex flex-col items-center gap-space-4">
          {text.empty.popular.map((term) => (
            <li key={term}>
              <ButtonLink href={`/search/?q=${encodeURIComponent(term)}`} variant="secondary" size="sm">
                {term}
              </ButtonLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Mobile filter sheet, opened by Filters (n). Figma draws the button and the chosen types, not the sheet, so it follows
 * the product list's Filters sheet (5746:89744) as a bottom sheet: Type (the four sections) and Sort by, then Clear and
 * Apply (an inference, Deviations).
 */
function FilterSheet({ open, onClose, types, sort, onApply }: { open: boolean; onClose: () => void; types: SearchType[]; sort: Sort; onApply: (types: SearchType[], sort: Sort) => void }) {
  const id = useId();
  const [draft, setDraft] = useState({ types, sort });
  const [lastOpen, setLastOpen] = useState(open);
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) setDraft({ types, sort });
  }
  return (
    <DialogShell open={open} onClose={onClose} labelledBy={`${id}-title`}>
      {({ visible }) => (
        <div className={cx("flex max-h-[calc(100dvh-var(--spacing-space-6))] w-full flex-col overflow-y-auto rounded-t-8 bg-secondary-skin text-primary-leather shadow-lg ui-desktop:hidden", dialogPanelMotion(visible))}>
          <div className="flex items-center justify-between border-b border-black-alpha-10 px-space-5 py-space-4">
            <h2 id={`${id}-title`} className="type-heading-sm">
              {text.filtersHeading}
            </h2>
            <button type="button" aria-label="Close" onClick={onClose} className="-m-space-1 cursor-pointer p-space-1">
              <Icon name="close" size={24} />
            </button>
          </div>
          <fieldset className="flex flex-col gap-space-3 border-b border-black-alpha-10 px-space-5 py-space-5">
            <legend className="type-overline-xs-medium mb-space-3">{text.typeLabel}</legend>
            {text.types.map((type) => (
              <Checkbox
                key={type.value}
                label={type.chip}
                checked={draft.types.includes(type.value)}
                onChange={() => setDraft((current) => ({ ...current, types: current.types.includes(type.value) ? current.types.filter((item) => item !== type.value) : [...current.types, type.value] }))}
              />
            ))}
          </fieldset>
          <fieldset className="flex flex-col gap-space-3 px-space-5 py-space-5">
            <legend className="type-overline-xs-medium mb-space-3">{text.sortLabel}</legend>
            {SORTS.map((option) => (
              <RadioOption key={option.value} name={`${id}-sort`} checked={draft.sort === option.value} onChange={() => setDraft((current) => ({ ...current, sort: option.value }))} heading={option.label}>
                {null}
              </RadioOption>
            ))}
          </fieldset>
          <div className="mt-auto flex gap-space-3 border-t border-black-alpha-10 px-space-5 py-space-4">
            <Button variant="secondary" size="sm" className="flex-1" onClick={() => setDraft({ types: [], sort: "best-match" })}>
              {text.clearFilters}
            </Button>
            <Button size="sm" className="flex-1" onClick={() => { onApply(draft.types, draft.sort); onClose(); }}>
              {text.apply}
            </Button>
          </div>
        </div>
      )}
    </DialogShell>
  );
}
