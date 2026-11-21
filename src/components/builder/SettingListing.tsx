"use client";

import { Fragment, useEffect, useId, useMemo, useRef, useState } from "react";
import { MetalTiles, PanelBody, PriceRange } from "@/components/plp/FilterControls";
import { shipDateLabel } from "@/components/plp/filters";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Icon } from "@/components/ui/Icon";
import { OptionTile } from "@/components/ui/OptionTile";
import { ProductCard } from "@/components/ui/ProductCard";
import { RadioButton } from "@/components/ui/Radio";
import { RichText } from "@/components/ui/RichText";
import { Tag } from "@/components/ui/Tag";
import { TextButton } from "@/components/ui/TextButton";
import { useIsDesktop } from "@/components/ui/useIsDesktop";
import type { IconName } from "@/components/ui/Icon";
import { builderContent, SETTING_STYLES, shapeIcon, shapeLabel, STONE_SHAPES, styleIcon, styleLabel } from "@/content/builder";
import { metalById } from "@/content/metals";
import { productListContent } from "@/content/product-list";
import { formatPrice, type ProductVariant } from "@/content/products";
import type { RingSetting } from "@/lib/builder";
import { PromoCard } from "./PromoCard";
import { settingHref, settingTitle, stonesHref } from "./ring";
import { SettingFilterSheet } from "./SettingFilterSheet";
import {
  applySettingFilters,
  EMPTY_SETTING_FILTERS,
  parseSettingFilters,
  rangeActive,
  serializeSettingFilters,
  settingPriceBounds,
  settingShipOptions,
  type SettingFilterState,
} from "./settingFilters";
import { SettingQuickView } from "./SettingQuickView";
import { useIsClient, useQuery } from "./useQuery";

const { settings: text } = builderContent;
const { filters: copy, sortOptions, card: cardLabels } = productListContent;

type SettingListingProps = {
  settings: RingSetting[];
  /** The lowest stone price for each shape, and "any" for every shape: the "with stone" note adds it to the setting's price. */
  stoneFrom: Record<string, number>;
};

type Chip = { key: string; label: string; icon?: IconName; remove: (state: SettingFilterState) => SettingFilterState };

/**
 * Ring builder Step 1, choose a setting (Figma desktop Builder 1 - Setting 3565:101274, mobile 3587:125289).
 * Desktop: the heading, the nine style tiles, a gold rule, then the filter row (Set with, Metal, Price, Clear
 * Filters; Ships by and Sort by on the right) and the 4-column grid with promo cards at Figma's positions.
 * Mobile: the heading, Filters / Ships by / Sort by, the active filters as chips, and a 2-column grid; the style,
 * shape, metal and price controls are in the Filters sheet. Filtering, sorting and View More run in the browser;
 * their state lives in the URL query string, next to the ring's.
 */
export function SettingListing({ settings, stoneFrom }: SettingListingProps) {
  const id = useId();
  const isClient = useIsClient();
  const isDesktop = useIsDesktop();
  const [search, setQuery] = useQuery();
  const state = useMemo(() => (search ? parseSettingFilters(new URLSearchParams(search)) : EMPTY_SETTING_FILTERS), [search]);
  const setState = (next: SettingFilterState) => setQuery(serializeSettingFilters(next));
  const set = (patch: Partial<SettingFilterState>) => setState({ ...state, ...patch, page: 1 });

  const [sheetOpen, setSheetOpen] = useState(false);
  const [quickView, setQuickView] = useState<{ setting: RingSetting; variant: ProductVariant; open: boolean } | null>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const focusFrom = useRef<string | null>(null);

  // Only styles that have a setting get a tile (desktop) or a sheet tile (mobile).
  const styles = useMemo(() => SETTING_STYLES.filter((style) => settings.some((setting) => setting.style === style.value)), [settings]);
  const bounds = useMemo(() => settingPriceBounds(settings), [settings]);
  const matches = useMemo(() => applySettingFilters(settings, state, bounds), [settings, state, bounds]);
  const pageSize = isDesktop ? builderContent.settingsPageSize.desktop : builderContent.settingsPageSize.mobile;
  const shown = matches.slice(0, pageSize * state.page);
  const priceOn = rangeActive(state.price, bounds);

  const ring = { shape: state.shape, start: state.start };
  const withStone = (variant: ProductVariant) => {
    const stone = stoneFrom[state.shape ?? "any"] ?? stoneFrom.any;
    return stone ? `${text.withStone} ${formatPrice(variant.price + stone)}` : null;
  };
  const infoHref = (setting: RingSetting) => (variant: ProductVariant) => settingHref(setting.handle, { ...ring, metal: variant.metal });
  const chooseHref = (setting: RingSetting) => (variant: ProductVariant) => stonesHref({ ...ring, setting: setting.handle, metal: variant.metal });

  const shipChoices = [
    { value: "", label: copy.anyDate },
    ...(isClient ? settingShipOptions(settings).map((days) => ({ value: String(days), label: shipDateLabel(days) })) : []),
  ];

  const chips: Chip[] = [
    ...(state.style ? [{ key: "style", label: styleLabel(state.style), icon: styleIcon(state.style), remove: (s: SettingFilterState) => ({ ...s, style: null }) }] : []),
    ...(state.shape ? [{ key: "shape", label: shapeLabel(state.shape), icon: shapeIcon(state.shape), remove: (s: SettingFilterState) => ({ ...s, shape: null }) }] : []),
    ...state.metals.map((metal) => ({ key: metal, label: metalById(metal).label, remove: (s: SettingFilterState) => ({ ...s, metals: s.metals.filter((m) => m !== metal) }) })),
    ...(priceOn ? [{ key: "price", label: `${formatPrice(state.price![0])}–${formatPrice(state.price![1])}`, remove: (s: SettingFilterState) => ({ ...s, price: null }) }] : []),
    ...(state.ships && isClient ? [{ key: "ships", label: `${copy.shipsBy} ${shipDateLabel(state.ships)}`, remove: (s: SettingFilterState) => ({ ...s, ships: null }) }] : []),
  ];
  const activeCount = chips.length;
  const clearAll = () => setState({ ...EMPTY_SETTING_FILTERS, sort: state.sort, start: state.start });

  // After View More, move focus to the first newly shown card so keyboard users continue from there.
  useEffect(() => {
    if (!focusFrom.current) return;
    const first = gridRef.current?.querySelector<HTMLElement>(`[data-setting="${focusFrom.current}"] a[href], [data-setting="${focusFrom.current}"] button`);
    focusFrom.current = null;
    first?.focus();
  }, [state.page]);

  const counted = (label: string, count: number) => (count ? `${label} (${count})` : label);
  const panelProps = { size: "sm" as const, width: "auto" as const, panelTone: "leather" as const };

  return (
    <div className="site-container flex flex-col gap-space-5 pt-space-11 pb-space-11 ui-desktop:gap-space-10 ui-desktop:pt-space-15 ui-desktop:pb-space-15">
      <div className="flex flex-col gap-space-5 ui-desktop:gap-space-6">
        <h1 className="type-heading-caps-md text-center text-primary-leather ui-desktop:type-heading-caps-lg">
          <RichText value={text.heading} emClassName="type-heading-italic-md ui-desktop:type-heading-italic-lg" />
        </h1>

        {/*
          Desktop style tiles: Figma "Radio Button" MD, 104 wide, 16px apart. A style with no settings is left out: the
          Design System's Radio Button (Radio 588:1170) draws Inactive, Hover and Active only, no disabled state. On
          narrow screens the gaps close first, then the tiles narrow. Choosing the selected tile again clears it.
          The shared Radio Button draws its border outside Figma's 90px, so the row is 2px taller; -my-px keeps what
          follows on Figma's lines.
        */}
        <fieldset className="hidden min-w-0 ui-desktop:block">
          <legend className="sr-only">{text.styleLegend}</legend>
          <div className="-my-px flex justify-center" style={{ columnGap: `clamp(0px, calc((100% - ${styles.length} * 6.5rem) / ${Math.max(1, styles.length - 1)}), 1rem)` }}>
            {styles.map((style) => (
              <RadioButton
                key={style.value}
                name={`${id}-style`}
                icon={style.icon}
                checked={state.style === style.value}
                onChange={() => set({ style: style.value })}
                onClick={() => state.style === style.value && set({ style: null })}
                className="w-26! min-w-0 shrink"
              >
                {style.label}
              </RadioButton>
            ))}
          </div>
        </fieldset>

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
                  <Tag color="secondary" leadingIcon={chip.icon} onRemove={() => setState({ ...chip.remove(state), page: 1 })} removeLabel={`Remove ${chip.label}`}>
                    {chip.label}
                  </Tag>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-space-5 ui-desktop:gap-space-6">
        {/* Desktop filter row, under a gold rule. Only the Price panel is drawn open in Figma (on the product list); the others reuse its look. */}
        <div className="hidden items-center justify-between gap-space-4 border-t border-secondary-gold pt-[calc(var(--spacing-space-6)-1px)] ui-desktop:flex">
          <div className="flex flex-wrap items-center gap-2.5">
            <Dropdown
              {...panelProps}
              label={text.shapePanel}
              displayValue={state.shape ? `${text.setWith} ${shapeLabel(state.shape)}` : text.shape}
              clearable={Boolean(state.shape)}
              onClear={() => set({ shape: null })}
              panelWidth="w-80"
              panel={
                <PanelBody label={text.shapePanel} id={`${id}-shape`}>
                  <div role="radiogroup" aria-labelledby={`${id}-shape`} className="grid grid-cols-3 gap-space-2 pt-space-2">
                    {STONE_SHAPES.map((shape) => (
                      <OptionTile
                        key={shape.value}
                        type="radio"
                        shape="fill"
                        name={`${id}-shape`}
                        icon={shape.icon}
                        checked={state.shape === shape.value}
                        onChange={() => set({ shape: shape.value })}
                      >
                        {shape.label}
                      </OptionTile>
                    ))}
                  </div>
                </PanelBody>
              }
            />
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
                    <MetalTiles value={state.metals} onChange={(metals) => set({ metals })} labelledBy={`${id}-metal`} wrap />
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
          <ul ref={gridRef} className="grid grid-cols-2 gap-x-space-2 gap-y-space-4 ui-desktop:grid-cols-4 ui-desktop:gap-space-4">
            {shown.map(({ setting, variant }, index) => (
              <Fragment key={`${setting.handle}-${variant.metal}`}>
                {/* Promo cards go in before the card they precede in each frame; each breakpoint has its own copy at its own place. */}
                {text.promos.map((promo) => (
                  <Fragment key={promo._key}>
                    {promo.after.desktop === index ? (
                      <li className={`hidden ui-desktop:block ${promo.width.desktop === "wide" ? "col-span-2" : ""}`}>
                        <PromoCard promo={promo} breakpoint="desktop" className="flex" />
                      </li>
                    ) : null}
                    {promo.after.mobile === index ? (
                      <li className={`ui-desktop:hidden ${promo.width.mobile === "wide" ? "col-span-2" : ""}`}>
                        <PromoCard promo={promo} breakpoint="mobile" className="flex" />
                      </li>
                    ) : null}
                  </Fragment>
                ))}
                <li data-setting={setting.handle}>
                  <ProductCard
                    product={setting.product}
                    initialVariant={variant}
                    labels={cardLabels}
                    onQuickView={(_, chosen) => setQuickView({ setting, variant: chosen, open: true })}
                    builder={{
                      title: settingTitle(setting.product),
                      href: infoHref(setting),
                      priceNote: withStone,
                      action: { label: text.chooseSetting, href: chooseHref(setting) },
                      hint360: true,
                    }}
                  />
                </li>
              </Fragment>
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
        styles={styles.map((style) => style.value)}
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
          shape={state.shape}
          open={quickView.open}
          onClose={() => setQuickView({ ...quickView, open: false })}
          priceNote={withStone}
          infoHref={infoHref(quickView.setting)}
          addHref={chooseHref(quickView.setting)}
        />
      ) : null}
    </div>
  );
}
