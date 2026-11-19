"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/ui/ProductCard";
import { RichText } from "@/components/ui/RichText";
import { Tag } from "@/components/ui/Tag";
import { cx } from "@/components/ui/shared";
import { metalById } from "@/content/metals";
import { productListContent } from "@/content/product-list";
import { formatPrice, variantName, type FineJewelryCategory, type Product, type ProductVariant } from "@/content/products";
import { addToBag } from "@/lib/bag";
import { BagToast, type BagNotice } from "./BagToast";
import { FilterBar } from "./FilterBar";
import { formatCaratValue } from "./FilterControls";
import { FilterSheet } from "./FilterSheet";
import {
  applyFilters,
  boundsOf,
  EMPTY_FILTERS,
  lengthLabel,
  rangeActive,
  serializeFilters,
  shipDateLabel,
  shipOptions,
  visibleFilters,
  type FilterState,
} from "./filters";
import { QuickView } from "./QuickView";
import { useFilterState } from "./useFilterState";

const content = productListContent;
const { filters: copy } = content;

const noop = () => () => {};
/** True after hydration: ship dates depend on today's date, so they are only written in the browser. */
const useIsClient = () => useSyncExternalStore(noop, () => true, () => false);

type ProductListingProps = {
  category: FineJewelryCategory;
  /** The category's products in "Best Match" order, fetched at build time. */
  products: Product[];
};

type Chip = { key: string; label: string; remove: (state: FilterState) => FilterState };

/**
 * Fine Jewelry product list (Figma desktop 3565:98087, mobile 3587:126753, empty states 4045:50390 and
 * 4142:45968). Filtering, sorting and View More run in the browser over the products fetched at build time;
 * their state lives in the URL query string.
 */
export function ProductListing({ category, products }: ProductListingProps) {
  const router = useRouter();
  const isClient = useIsClient();
  const [state, setState] = useFilterState();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [quickView, setQuickView] = useState<{ product: Product; variant: ProductVariant; open: boolean } | null>(null);
  const [notice, setNotice] = useState<BagNotice | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const focusFrom = useRef<number | null>(null);

  const pool = useMemo(() => (state.type ? products.filter((product) => product.styles.includes(state.type!)) : products), [products, state.type]);
  const filters = useMemo(() => visibleFilters(category, pool), [category, pool]);
  const bounds = useMemo(() => boundsOf(pool), [pool]);
  const matches = useMemo(() => applyFilters(products, state, bounds), [products, state, bounds]);
  const shown = matches.slice(0, content.pageSize * state.page);
  const lengths = content.lengths[category] ?? [];
  const lengthTitle = category === "necklaces" ? copy.chainLength : copy.length;

  const shipChoices = [
    { value: "", label: copy.anyDate },
    ...(isClient ? shipOptions(products).map((days) => ({ value: String(days), label: shipDateLabel(days) })) : []),
  ];

  const chips: Chip[] = [
    ...(state.type ? [{ key: "type", label: content.styleLabels[state.type] ?? state.type, remove: (s: FilterState) => ({ ...s, type: null }) }] : []),
    ...state.metals.map((metal) => ({ key: metal, label: metalById(metal).label, remove: (s: FilterState) => ({ ...s, metals: s.metals.filter((m) => m !== metal) }) })),
    ...state.diamond.map((type) => ({
      key: type,
      label: copy.diamondTypes.find((option) => option.value === type)?.label ?? type,
      remove: (s: FilterState) => ({ ...s, diamond: s.diamond.filter((d) => d !== type) }),
    })),
    ...(rangeActive(state.carat, bounds.carat)
      ? [{ key: "carat", label: `${copy.caratShort}: ${formatCaratValue(state.carat![0])}–${formatCaratValue(state.carat![1])}`, remove: (s: FilterState) => ({ ...s, carat: null }) }]
      : []),
    ...state.length.map((length) => ({ key: length, label: lengthLabel(length), remove: (s: FilterState) => ({ ...s, length: s.length.filter((l) => l !== length) }) })),
    ...(rangeActive(state.price, bounds.price)
      ? [{ key: "price", label: `${formatPrice(state.price![0])}–${formatPrice(state.price![1])}`, remove: (s: FilterState) => ({ ...s, price: null }) }]
      : []),
    ...(state.ships && isClient
      ? [{ key: "ships", label: `${copy.shipsBy} ${shipDateLabel(state.ships)}`, remove: (s: FilterState) => ({ ...s, ships: null }) }]
      : []),
  ];
  const activeCount = chips.length;
  const clearAll = () => setState({ ...EMPTY_FILTERS, sort: state.sort });

  // After View More, move focus to the first newly shown card so keyboard users continue from there.
  useEffect(() => {
    if (focusFrom.current === null) return;
    const first = gridRef.current?.children[focusFrom.current]?.querySelector<HTMLElement>("a[href], button");
    focusFrom.current = null;
    first?.focus();
  }, [state.page]);

  const onAddToBag = useCallback(async (product: Product, variant: ProductVariant) => {
    const name = variantName(product, variant);
    setBusy(product.slug);
    const result = await addToBag(variant.id);
    setBusy(null);
    setNotice({
      id: Date.now(),
      tone: result.ok ? "success" : "error",
      text: result.ok ? `Added to bag: ${name}` : `Couldn't add ${name} to the bag. Please try again.`,
    });
  }, []);
  const dismissNotice = useCallback(() => setNotice(null), []);

  const sortOptions = content.sortOptions;

  return (
    <div className="site-container flex flex-col gap-space-5 pt-space-11 pb-space-11 ui-desktop:gap-space-10 ui-desktop:pt-space-15 ui-desktop:pb-space-15">
      <header className="flex flex-col items-center gap-space-4 text-center text-primary-leather">
        <p className="type-overline-xs-medium hidden ui-desktop:block">{content.overline}</p>
        <h1 className="type-heading-caps-md ui-desktop:type-heading-caps-lg">
          <RichText value={content.heading} emClassName="type-heading-italic-md ui-desktop:type-heading-italic-lg" />
        </h1>
      </header>

      {/* Desktop category tabs: Figma "Radio Button" MD tiles, here links to each category page. */}
      <nav aria-label="Fine Jewelry categories" className="hidden justify-center ui-desktop:flex">
        <ul className="flex gap-space-2">
          {content.categories.map((item) => {
            const current = item._key === category;
            return (
              <li key={item._key}>
                <Link
                  href={`/fine-jewelry/${item._key}/`}
                  aria-current={current ? "page" : undefined}
                  className={cx(
                    "ui-transition flex w-40 flex-col items-center gap-space-1 rounded-4 border bg-secondary-skin px-space-2 py-space-3 text-primary-leather",
                    current ? "border-primary-leather" : "border-transparent hover:bg-secondary-ivory",
                  )}
                >
                  <Icon name={item.icon} size={48} />
                  <span className="type-overline-xs-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex flex-col gap-space-5 ui-desktop:gap-space-6">
        {/* Mobile controls: Filters, Ships by and Sort by, then the active filters as removable chips. */}
        <div className="flex flex-col gap-space-2 ui-desktop:hidden">
          <div className="grid grid-cols-3 gap-space-2">
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => setSheetOpen(true)}
              className="ui-transition type-ui-xs-regular flex min-h-space-8 cursor-pointer items-center justify-center gap-1.5 rounded-4 border border-secondary-gold bg-secondary-skin px-space-3 text-primary-leather hover:border-black-alpha-50"
            >
              <Icon name="filter" size={16} />
              {activeCount ? `${copy.title} (${activeCount})` : copy.title}
            </button>
            <Dropdown
              size="xs"
              label={copy.shipsBy}
              options={shipChoices}
              value={state.ships ? String(state.ships) : ""}
              onChange={(value) => setState({ ...state, ships: value ? Number(value) : null, page: 1 })}
            />
            <Dropdown
              size="xs"
              label={copy.sortBy}
              options={sortOptions.map(({ value, shortLabel }) => ({ value, label: shortLabel }))}
              value={state.sort}
              onChange={(sort) => setState({ ...state, sort, page: 1 })}
              panelWidth="w-max min-w-full"
              panelAlign="end"
            />
          </div>
          {chips.length ? (
            <ul aria-label="Active filters" className="flex flex-wrap gap-space-2">
              {chips.map((chip) => (
                <li key={chip.key}>
                  <Tag color="secondary" onRemove={() => setState({ ...chip.remove(state), page: 1 })} removeLabel={`Remove ${chip.label}`}>
                    {chip.label}
                  </Tag>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <FilterBar
          state={state}
          onChange={setState}
          filters={filters}
          bounds={bounds}
          lengths={lengths}
          lengthLabel={lengthTitle}
          shipChoices={shipChoices}
          activeCount={activeCount}
        />

        {/* Desktop: the menu's sub-type (e.g. Diamond Rings) has no control in the bar, so it shows as a chip. */}
        {state.type ? (
          <div className="hidden ui-desktop:flex">
            <Tag color="secondary" onRemove={() => setState({ ...state, type: null, page: 1 })} removeLabel={`Remove ${content.styleLabels[state.type] ?? state.type}`}>
              {content.styleLabels[state.type] ?? state.type}
            </Tag>
          </div>
        ) : null}

        <h2 className="sr-only">{content.categories.find((item) => item._key === category)?.title}</h2>
        <p role="status" className="sr-only">
          {isClient ? `Showing ${shown.length} of ${matches.length} ${matches.length === 1 ? "product" : "products"}.` : ""}
        </p>

        {shown.length ? (
          <ul ref={gridRef} className="grid grid-cols-2 gap-x-space-2 gap-y-space-4 ui-desktop:grid-cols-4 ui-desktop:gap-space-4">
            {shown.map(({ product, variant }) => (
              <li key={`${product.slug}-${variant.metal}-${variant.carat ?? ""}`}>
                <ProductCard
                  product={product}
                  initialVariant={variant}
                  labels={content.card}
                  busy={busy === product.slug}
                  onAddToBag={onAddToBag}
                  onQuickView={(item, chosen) => setQuickView({ product: item, variant: chosen, open: true })}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-space-5 rounded-4 border border-secondary-gold px-space-8 py-space-10 text-center text-primary-leather ui-desktop:gap-space-8 ui-desktop:px-space-15 ui-desktop:py-space-13">
            <p className="type-heading-sm max-w-[38.75rem] ui-desktop:type-heading-md">{content.empty}</p>
            <Button size="sm" variant="secondary" leftIcon="arrow-counter-clockwise" onClick={clearAll}>
              {copy.clearFilters}
            </Button>
          </div>
        )}
      </div>

      {matches.length > shown.length ? (
        <div className="flex justify-center">
          <Button
            size="responsive"
            variant="secondary"
            className="min-w-40 ui-desktop:min-w-50"
            onClick={() => {
              focusFrom.current = shown.length;
              setState({ ...state, page: state.page + 1 });
            }}
          >
            {content.viewMore}
          </Button>
        </div>
      ) : null}

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        category={category}
        state={state}
        filters={filters}
        bounds={bounds}
        lengths={lengths}
        lengthLabel={lengthTitle}
        onApply={(next, nextCategory) => {
          setSheetOpen(false);
          if (nextCategory === category) setState(next);
          else {
            const query = serializeFilters(next);
            router.push(`/fine-jewelry/${nextCategory}/${query ? `?${query}` : ""}`);
          }
        }}
      />

      {quickView ? (
        <QuickView
          key={`${quickView.product.slug}-${quickView.variant.metal}-${quickView.variant.carat}`}
          product={quickView.product}
          initialVariant={quickView.variant}
          open={quickView.open}
          onClose={() => setQuickView({ ...quickView, open: false })}
          onAddToBag={onAddToBag}
          busy={busy === quickView.product.slug}
          labels={{ ...content.card, close: "Close" }}
        />
      ) : null}

      <BagToast notice={notice} onDismiss={dismissNotice} />
    </div>
  );
}
