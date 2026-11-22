"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { MetalTiles, PanelBody, PriceRange } from "@/components/plp/FilterControls";
import { shipDateLabel } from "@/components/plp/filters";
import { settingTitle } from "@/components/builder/ring";
import { SettingFilterSheet } from "@/components/builder/SettingFilterSheet";
import {
  applySettingFilters,
  EMPTY_SETTING_FILTERS,
  parseSettingFilters,
  rangeActive,
  serializeSettingFilters,
  settingPriceBounds,
  settingShipOptions,
  type SettingFilterState,
} from "@/components/builder/settingFilters";
import { SettingQuickView } from "@/components/builder/SettingQuickView";
import { useIsClient, useQuery } from "@/components/builder/useQuery";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/ui/ProductCard";
import { RichText } from "@/components/ui/RichText";
import { Tag } from "@/components/ui/Tag";
import { TextButton } from "@/components/ui/TextButton";
import { useIsDesktop } from "@/components/ui/useIsDesktop";
import { builderContent } from "@/content/builder";
import { earringsContent } from "@/content/earrings";
import { metalById, type MetalId } from "@/content/metals";
import { productListContent } from "@/content/product-list";
import { formatPrice, type ProductVariant } from "@/content/products";
import type { EarringSetting } from "@/lib/earrings";
import { earringSettingHref } from "./routes";

const text = earringsContent.settings;
const { filters: copy, sortOptions, card: cardLabels } = productListContent;

type Chip = { key: string; label: string; remove: (state: SettingFilterState) => SettingFilterState };

/** Cards before View More: the desktop frame draws 24, the mobile frame 16. */
const PAGE_SIZE = { desktop: 24, mobile: 16 };

/**
 * Earrings builder Step 1, choose a setting (Figma desktop Custom Earrings - Setting 3565:98137, mobile 3587:126808).
 * Desktop: "Design your own Earrings" over "Select your Perfect Piece", a gold rule, the filter row (Metal and
 * Price; Ships by and Sort by on the right) and the 4-column grid. Mobile: the heading, Filters / Ships by / Sort by,
 * the active filters as chips, and a 2-column grid; Metal and Price are in the Filters sheet ("Product List /
 * Filters" 3587:127002). Built from the ring builder's Step 1 parts: its filters, URL state, cards and quick view.
 * Only the metals a setting comes in are offered. Info and Customize both open the setting's page, as the
 * prototype links the hover card's button group.
 */
export function EarringSettingListing({ settings }: { settings: EarringSetting[] }) {
  const id = useId();
  const isClient = useIsClient();
  const isDesktop = useIsDesktop();
  const [search, setQuery] = useQuery();
  const state = useMemo(() => (search ? parseSettingFilters(new URLSearchParams(search)) : EMPTY_SETTING_FILTERS), [search]);
  const setState = (next: SettingFilterState) => setQuery(serializeSettingFilters({ ...next, style: null, shape: null, start: null }));
  const set = (patch: Partial<SettingFilterState>) => setState({ ...state, ...patch, page: 1 });

  const [sheetOpen, setSheetOpen] = useState(false);
  const [quickView, setQuickView] = useState<{ setting: EarringSetting; variant: ProductVariant; open: boolean } | null>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const focusFrom = useRef<string | null>(null);

  const metals = useMemo(() => [...new Set(settings.flatMap((setting) => setting.product.variants.map((variant) => variant.metal)))] as MetalId[], [settings]);
  const bounds = useMemo(() => settingPriceBounds(settings), [settings]);
  const matches = useMemo(() => applySettingFilters(settings, { ...state, style: null, shape: null }, bounds), [settings, state, bounds]);
  const pageSize = isDesktop ? PAGE_SIZE.desktop : PAGE_SIZE.mobile;
  const shown = matches.slice(0, pageSize * state.page);
  const priceOn = rangeActive(state.price, bounds);

  const infoHref = (setting: EarringSetting) => (variant: ProductVariant) => earringSettingHref(setting.handle, { metal: variant.metal });

  const shipChoices = [{ value: "", label: copy.anyDate }, ...(isClient ? settingShipOptions(settings).map((days) => ({ value: String(days), label: shipDateLabel(days) })) : [])];

  const chips: Chip[] = [
    ...state.metals.map((metal) => ({ key: metal, label: metalById(metal).label, remove: (s: SettingFilterState) => ({ ...s, metals: s.metals.filter((m) => m !== metal) }) })),
    ...(priceOn ? [{ key: "price", label: `${formatPrice(state.price![0])}–${formatPrice(state.price![1])}`, remove: (s: SettingFilterState) => ({ ...s, price: null }) }] : []),
    ...(state.ships && isClient ? [{ key: "ships", label: `${copy.shipsBy} ${shipDateLabel(state.ships)}`, remove: (s: SettingFilterState) => ({ ...s, ships: null }) }] : []),
  ];
  const activeCount = chips.length;
  const clearAll = () => setState({ ...EMPTY_SETTING_FILTERS, sort: state.sort });

  useEffect(() => {
    if (!focusFrom.current) return;
    const first = gridRef.current?.querySelector<HTMLElement>(`[data-setting="${focusFrom.current}"] a[href], [data-setting="${focusFrom.current}"] button`);
    focusFrom.current = null;
    first?.focus();
  }, [state.page]);

  const counted = (label: string, count: number) => (count ? `${label} (${count})` : label);
  const panelProps = { size: "sm" as const, width: "auto" as const, panelTone: "leather" as const };

  return (
    <div className="site-container flex flex-col gap-space-5 py-space-11 ui-desktop:gap-space-10">
      <header className="flex flex-col gap-space-5">
        <div className="flex flex-col items-center gap-space-2 text-center text-primary-leather ui-desktop:gap-space-4">
          <p className="type-overline-xs-medium">{text.overline}</p>
          <h1 className="type-heading-caps-md ui-desktop:type-heading-caps-lg">
            <RichText value={text.heading} emClassName="type-heading-italic-md ui-desktop:type-heading-italic-lg" />
          </h1>
        </div>

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
            <Dropdown size="xs" label={copy.shipsBy} options={shipChoices} value={state.ships ? String(state.ships) : ""} onChange={(value) => set({ ships: value ? Number(value) : null })} />
            <Dropdown
              size="xs"
              label={copy.sortBy}
              options={sortOptions.map(({ value, shortLabel }) => ({ value, label: shortLabel }))}
              value={state.sort}
              onChange={(sort) => set({ sort })}
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
      </header>

      <div className="flex flex-col gap-space-5 ui-desktop:gap-space-10">
        {/* Desktop filter row under a gold rule: Metal and Price (Figma draws Price twice: built once), Ships by and Sort by. */}
        <div className="hidden items-center justify-between gap-space-4 border-t border-secondary-gold pt-[calc(var(--spacing-space-6)-1px)] ui-desktop:flex">
          <div className="flex flex-wrap items-center gap-2.5">
            <Dropdown
              {...panelProps}
              label={copy.metal}
              displayValue={counted(copy.metal, state.metals.length)}
              clearable={state.metals.length > 0}
              onClear={() => set({ metals: [] })}
              panelWidth="w-80"
              panel={
                <PanelBody label={copy.metalPanel} id={`${id}-metal`}>
                  <div className="pt-space-2">
                    <MetalTiles value={state.metals} onChange={(next) => set({ metals: next })} labelledBy={`${id}-metal`} wrap metals={metals} />
                  </div>
                </PanelBody>
              }
            />
            <Dropdown
              {...panelProps}
              label={copy.price}
              displayValue={counted(copy.price, priceOn ? 1 : 0)}
              clearable={priceOn}
              onClear={() => set({ price: null })}
              panelWidth="w-80"
              panel={
                <PanelBody label={copy.price} id={`${id}-price`}>
                  <PriceRange bounds={bounds} value={state.price} onChange={(price) => set({ price })} />
                </PanelBody>
              }
            />
            {activeCount ? (
              <TextButton variant="caps" size="sm" leadingIcon="close" className="ml-3.5" onClick={clearAll}>
                {copy.clearFilters}
              </TextButton>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-space-4">
            <Dropdown
              size="sm"
              width="auto"
              label={copy.shipsBy}
              valuePrefix={copy.shipsBy}
              options={shipChoices}
              value={state.ships ? String(state.ships) : ""}
              onChange={(value) => set({ ships: value ? Number(value) : null })}
              panelWidth="w-full min-w-44"
              panelAlign="end"
            />
            <Dropdown
              size="sm"
              width="auto"
              label={copy.sortBy}
              valuePrefix={copy.sortBy}
              options={sortOptions.map(({ value, label }) => ({ value, label }))}
              value={state.sort}
              onChange={(sort) => set({ sort })}
              panelWidth="w-full min-w-48"
              panelAlign="end"
            />
          </div>
        </div>

        <h2 className="sr-only">Settings</h2>
        <p role="status" className="sr-only">
          {isClient ? `Showing ${shown.length} of ${matches.length} ${matches.length === 1 ? "setting" : "settings"}.` : ""}
        </p>

        {shown.length ? (
          <ul ref={gridRef} data-earring-settings className="grid grid-cols-2 gap-x-space-2 gap-y-space-4 ui-desktop:grid-cols-4 ui-desktop:gap-space-4">
            {shown.map(({ setting, variant }) => (
              <li key={setting.handle} data-setting={setting.handle}>
                <ProductCard
                  product={setting.product}
                  initialVariant={variant}
                  labels={cardLabels}
                  metalFilter={state.metals}
                  onQuickView={(_, chosen) => setQuickView({ setting, variant: chosen, open: true })}
                  builder={{ title: settingTitle(setting.product), href: infoHref(setting), priceNote: () => null, action: { label: text.customize, href: infoHref(setting) } }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-space-5 rounded-4 border border-secondary-gold px-space-8 py-space-10 text-center text-primary-leather ui-desktop:gap-space-8 ui-desktop:px-space-15 ui-desktop:py-space-13">
            <p className="type-heading-sm max-w-[24.875rem] ui-desktop:type-heading-md">{text.empty}</p>
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
              focusFrom.current = matches[shown.length]?.setting.handle ?? null;
              setState({ ...state, page: state.page + 1 });
            }}
          >
            {builderContent.viewMore}
          </Button>
        </div>
      ) : null}

      <SettingFilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        state={state}
        priceBounds={bounds}
        styles={[]}
        sections={{ shape: false, style: false, metals }}
        onApply={(next) => {
          setSheetOpen(false);
          setState(next);
        }}
      />

      {quickView ? (
        <SettingQuickView
          key={`${quickView.setting.handle}-${quickView.variant.metal}`}
          setting={quickView.setting}
          initialVariant={quickView.variant}
          shape={null}
          open={quickView.open}
          onClose={() => setQuickView({ ...quickView, open: false })}
          priceNote={() => null}
          infoHref={infoHref(quickView.setting)}
          addHref={infoHref(quickView.setting)}
          metalFilter={state.metals}
          actionLabel={text.customize}
          stoneTile={false}
          hint360={false}
        />
      ) : null}
    </div>
  );
}
