"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Icon } from "@/components/ui/Icon";
import { RadioButton } from "@/components/ui/Radio";
import { br, RichText } from "@/components/ui/RichText";
import { Tabs } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { TextButton } from "@/components/ui/TextButton";
import { cx } from "@/components/ui/shared";
import { useIsDesktop } from "@/components/ui/useIsDesktop";
import { shipDateLabel } from "@/components/plp/filters";
import { builderContent, GEM_COLORS, GEM_TREATMENTS, GEM_TYPES, shapeIcon, shapeLabel, STONE_SHAPES, type StoneKind, type StoneOrigin } from "@/content/builder";
import { productListContent } from "@/content/product-list";
import type { Product } from "@/content/products";
import type { Stone } from "@/lib/builder";
import { CccModal, type CccTab } from "./CccModal";
import { completeHref, parseRing, settingVariant, startDefaults, stoneHref, type Ring } from "./ring";
import { StoneCard } from "./StoneCard";
import {
  AdvancedPanel,
  CertificateTiles,
  GemSwatch,
  GRADE_LABEL,
  GradeFilter,
  NUMBER_FORMAT,
  NUMBER_LABEL,
  NumberFilter,
  StoneFilterLabel,
  TreatmentChecks,
} from "./StoneFilterControls";
import { StoneFilterSheet } from "./StoneFilterSheet";
import {
  ADVANCED_KEYS,
  ALL_GEMS,
  applyStoneFilters,
  EMPTY_STONE_FILTERS,
  GRADE_KEYS,
  gradeIndexes,
  NUMBER_KEYS,
  numberActive,
  parseStoneFilters,
  scalesFor,
  serializeStoneFilters,
  stoneBounds,
  stoneShipOptions,
  tabStones,
  type GradeKey,
  type NumberKey,
  type StoneFilterState,
} from "./stoneFilters";
import { StoneQuickView } from "./StoneQuickView";
import { useIsClient, useQuery } from "./useQuery";

const copy = builderContent.stones;
const { filters: listCopy, sortOptions } = productListContent;

/** The mobile frame (3587:125351) breaks the heading before "and"; the desktop one keeps it on a line. */
const HEADING = copy.heading.flatMap((part, index) => (index === 3 ? [br(true), part] : [part]));

type Chip = { key: string; label: string; icon?: Parameters<typeof Icon>[0]["name"]; remove: (state: StoneFilterState) => StoneFilterState };

/**
 * Gemstone Color (Figma Builder - Color Dropdown 6659:109856): a Dropdown whose menu lists "All Colors" and the nine
 * colours, each with its 20px swatch. The shared Dropdown's options have no swatch, so the menu is a panel of
 * buttons; choosing one remounts the Dropdown, which closes the menu, and focus goes back to its button.
 */
function GemColorDropdown({ value, onChange }: { value: string | null; onChange: (value: string | null) => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const chosen = useRef(false);
  useEffect(() => {
    if (!chosen.current) return;
    chosen.current = false;
    wrap.current?.querySelector<HTMLElement>("[data-trigger]")?.focus();
  }, [value]);
  const choose = (next: string | null) => {
    chosen.current = true;
    onChange(next);
  };
  const item = "ui-transition type-ui-sm-medium flex w-full cursor-pointer items-center gap-0.5 rounded-4 py-space-2 pr-space-4 pl-space-2 text-left text-primary-leather hover:bg-secondary-ivory aria-pressed:bg-secondary-ivory";
  return (
    <div ref={wrap} data-gem-color="">
      <Dropdown
        key={value ?? "all"}
        size="sm"
        label={copy.color}
        displayValue={GEM_COLORS.find((color) => color.value === value)?.label ?? copy.allColors}
        panelLabel={`${copy.color} options`}
        panel={
          <ul className="max-h-[16.625rem] overflow-y-auto border-b border-black-alpha-10 p-space-2">
            <li>
              <button type="button" aria-pressed={value === null} onClick={() => choose(null)} className={item}>
                <span className="px-space-1">{copy.allColors}</span>
              </button>
            </li>
            {GEM_COLORS.map((color) => (
              <li key={color.value}>
                <button type="button" aria-pressed={value === color.value} onClick={() => choose(color.value)} className={item}>
                  <GemSwatch color={color.value} />
                  <span className="px-space-1">{color.label}</span>
                </button>
              </li>
            ))}
          </ul>
        }
      />
    </div>
  );
}

/** What the earrings builder's Step 2 changes: its page size, cards and quick view (diamonds only). */
export type StoneListingVariant = {
  /** Replaces the heading; without it the ring's heading is used ("Select your stone shape and Quality"). */
  header?: ReactNode;
  pageSize: { desktop: number; mobile: number };
  gridClassName: string;
  resultsLabel: string;
  emptyText: string;
  card: (stone: Stone, context: { ring: Ring; settingPrice: number | null; onQuickView: (stone: Stone) => void }) => ReactNode;
  /** The earrings frame draws Advanced Filters open, and pads the page 48px top and bottom on desktop too. */
  advancedOpen: boolean;
  containerClassName: string;
  /** Its open Advanced Filters row sits 16px under the toggle, and the grid 24px under the results row (the ring's frame: 24 and 40). */
  advancedClassName: string;
  resultsClassName: string;
  quickView: (stone: Stone, context: { ring: Ring; settingPrice: number | null; open: boolean; onClose: () => void }) => ReactNode;
};

type StoneListingProps = {
  /** Every loose stone, in catalogue order, fetched at build time. */
  stones: Stone[];
  /** The settings' products, to price "with setting" for the one the URL names. */
  settings: Product[];
  /** The earrings builder's Step 2 (its pairs are passed as stones: see src/lib/earrings.ts). */
  variant?: StoneListingVariant;
};

/**
 * Ring builder Step 2, choose a stone (Figma desktop Builder 2 - Stone 3565:101144, Builder - Gemstone 6659:72885,
 * Builder - Color Dropdown 6659:109856; mobile 3587:125351). Filtering, sorting and View More run in the browser
 * over the stones fetched at build time; their state lives in the URL next to the ring's (see stoneFilters.ts).
 * Diamonds or gemstones comes from the menu link the shopper started with (?start=): Figma draws no switch between them.
 */
export function StoneListing({ stones, settings, variant }: StoneListingProps) {
  const id = useId();
  const isClient = useIsClient();
  const isDesktop = useIsDesktop();
  const [search, setQuery] = useQuery();
  const params = new URLSearchParams(search);
  const ring = parseRing(params);
  const defaults = startDefaults(ring.start);
  const parsed = parseStoneFilters(params);
  const kind: StoneKind = defaults.kind;
  const origin: StoneOrigin = parsed.origin ?? defaults.origin;
  const pool = tabStones(stones, kind, origin);
  // A gemstone type with no stones in this tab is not offered (moissanite under Natural), and is dropped if preselected.
  const gemTypes = GEM_TYPES.filter((type) => pool.some((stone) => stone.gem === type.value));
  const offered = (value: string | null) => (value === null || value === ALL_GEMS || gemTypes.some((type) => type.value === value) ? value : null);
  // A menu link that names a gemstone (?start=sapphire) preselects its type until the shopper picks another.
  const state: StoneFilterState = { ...parsed, gem: kind === "gemstone" ? offered(parsed.gem ?? defaults.gem) : null };
  const setState = (next: StoneFilterState) => setQuery(serializeStoneFilters({ ...next, gem: next.gem === null && defaults.gem ? ALL_GEMS : next.gem }, params));
  const set = (patch: Partial<StoneFilterState>) => setState({ ...state, ...patch, page: 1 });

  const [sheetOpen, setSheetOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(variant?.advancedOpen ?? false);
  const [help, setHelp] = useState<{ open: boolean; tab: CccTab }>({ open: false, tab: "cut" });
  const [quickView, setQuickView] = useState<{ stone: Stone; open: boolean } | null>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const focusFrom = useRef<number | null>(null);

  const bounds = stoneBounds(pool);
  const matches = applyStoneFilters(pool, state, kind, bounds);
  const pageSize = variant ? (isDesktop ? variant.pageSize.desktop : variant.pageSize.mobile) : builderContent.pageSize;
  const shown = matches.slice(0, pageSize * state.page);
  const scales = scalesFor(kind);
  const gem = kind === "gemstone";

  const setting = settings.find((product) => product.slug === ring.setting);
  const settingPrice = setting ? settingVariant(setting, ring.metal).price : null;

  const shipChoices = [{ value: "", label: listCopy.anyDate }, ...(isClient ? stoneShipOptions(pool).map((days) => ({ value: String(days), label: shipDateLabel(days) })) : [])];

  const gradeOn = (key: GradeKey) => gradeIndexes(state.grades[key], scales[key]) !== null;
  const numberOn = (key: NumberKey) => numberActive(state.numbers[key], bounds[key]);
  const gradeText = (key: GradeKey) => {
    const indexes = gradeIndexes(state.grades[key], scales[key])!;
    const scale = scales[key]!;
    return indexes[0] === indexes[1] ? scale[indexes[0]].label : `${scale[indexes[0]].label}–${scale[indexes[1]].label}`;
  };
  const without = <K extends "grades" | "numbers">(group: K, key: string) => (current: StoneFilterState): StoneFilterState => {
    const next = { ...current[group] } as Record<string, unknown>;
    delete next[key];
    return { ...current, [group]: next };
  };

  const chips: Chip[] = [
    ...(state.shape ? [{ key: "shape", label: shapeLabel(state.shape), icon: shapeIcon(state.shape), remove: (s: StoneFilterState) => ({ ...s, shape: null }) }] : []),
    ...(gem && state.gemColor ? [{ key: "gemcolor", label: GEM_COLORS.find((color) => color.value === state.gemColor)?.label ?? state.gemColor, remove: (s: StoneFilterState) => ({ ...s, gemColor: null }) }] : []),
    ...(gem && state.gem && state.gem !== ALL_GEMS ? [{ key: "gem", label: GEM_TYPES.find((type) => type.value === state.gem)?.label ?? state.gem, remove: (s: StoneFilterState) => ({ ...s, gem: null }) }] : []),
    ...GRADE_KEYS.filter(gradeOn).map((key) => ({ key, label: `${GRADE_LABEL[key]}: ${gradeText(key)}`, remove: without("grades", key) })),
    ...NUMBER_KEYS.filter(numberOn).map((key) => ({
      key,
      label: `${NUMBER_LABEL[key]}: ${NUMBER_FORMAT[key](state.numbers[key]![0])}–${NUMBER_FORMAT[key](state.numbers[key]![1])}`,
      remove: without("numbers", key),
    })),
    ...state.cert.map((lab) => ({ key: `cert-${lab}`, label: lab, remove: (s: StoneFilterState) => ({ ...s, cert: s.cert.filter((item) => item !== lab) }) })),
    ...(gem
      ? state.treatment.map((value) => ({
          key: `treatment-${value}`,
          label: `${copy.treatment}: ${GEM_TREATMENTS.find((item) => item.value === value)?.label ?? value}`,
          remove: (s: StoneFilterState) => ({ ...s, treatment: s.treatment.filter((item) => item !== value) }),
        }))
      : []),
    ...(state.ships && isClient ? [{ key: "ships", label: `${listCopy.shipsBy} ${shipDateLabel(state.ships)}`, remove: (s: StoneFilterState) => ({ ...s, ships: null }) }] : []),
  ];
  const activeCount = chips.length;
  const advancedCount = ADVANCED_KEYS[kind].filter((key) =>
    key === "treatment" ? state.treatment.length > 0 : key === "cert" ? state.cert.length > 0 : (GRADE_KEYS as readonly string[]).includes(key) ? gradeOn(key as GradeKey) : numberOn(key as NumberKey),
  ).length;
  const clearAll = () => setState({ ...EMPTY_STONE_FILTERS, origin: state.origin, sort: state.sort });

  // After View More, move focus to the first newly shown card so keyboard users continue from there.
  useEffect(() => {
    if (focusFrom.current === null) return;
    const first = gridRef.current?.children[focusFrom.current]?.querySelector<HTMLElement>("a[href], button");
    focusFrom.current = null;
    first?.focus();
  }, [state.page]);

  const filter = { state, onChange: set };
  const openHelp = (tab: CccTab) => setHelp({ open: true, tab });
  const counted = (label: string, on: boolean) => (on ? `${label} (1)` : label);
  const panelProps = { size: "sm" as const, width: "auto" as const, panelTone: "leather" as const, panelWidth: "w-80" };

  const advancedDropdown = (key: (typeof ADVANCED_KEYS)[StoneKind][number]): ReactNode => {
    if (key === "treatment")
      return (
        <Dropdown
          key={key}
          {...panelProps}
          label={copy.treatment}
          displayValue={state.treatment.length ? `${copy.treatment} (${state.treatment.length})` : copy.treatment}
          clearable={state.treatment.length > 0}
          onClear={() => set({ treatment: [] })}
          panel={
            <AdvancedPanel className="flex flex-col gap-space-3">
              <StoneFilterLabel id={`${id}-treatment`} label={copy.treatment} />
              <TreatmentChecks {...filter} labelledBy={`${id}-treatment`} />
            </AdvancedPanel>
          }
        />
      );
    if (key === "cert")
      return (
        <Dropdown
          key={key}
          {...panelProps}
          label={copy.certificate}
          displayValue={state.cert.length ? `${copy.certificate} (${state.cert.length})` : copy.certificate}
          clearable={state.cert.length > 0}
          onClear={() => set({ cert: [] })}
          panel={
            <AdvancedPanel className="flex flex-col gap-space-3">
              <StoneFilterLabel id={`${id}-cert-panel`} label={copy.certificate} />
              <CertificateTiles {...filter} labelledBy={`${id}-cert-panel`} />
            </AdvancedPanel>
          }
        />
      );
    if ((GRADE_KEYS as readonly string[]).includes(key)) {
      const gradeKey = key as GradeKey;
      return (
        <Dropdown
          key={key}
          {...panelProps}
          label={GRADE_LABEL[gradeKey]}
          displayValue={counted(GRADE_LABEL[gradeKey], gradeOn(gradeKey))}
          clearable={gradeOn(gradeKey)}
          onClear={() => setState({ ...without("grades", gradeKey)(state), page: 1 })}
          panel={
            <AdvancedPanel>
              <GradeFilter kind={kind} gradeKey={gradeKey} {...filter} />
            </AdvancedPanel>
          }
        />
      );
    }
    const numberKey = key as NumberKey;
    return (
      <Dropdown
        key={key}
        {...panelProps}
        label={NUMBER_LABEL[numberKey]}
        displayValue={counted(NUMBER_LABEL[numberKey], numberOn(numberKey))}
        clearable={numberOn(numberKey)}
        onClear={() => setState({ ...without("numbers", numberKey)(state), page: 1 })}
        panel={
          <AdvancedPanel>
            <NumberFilter numberKey={numberKey} bounds={bounds} {...filter} />
          </AdvancedPanel>
        }
      />
    );
  };

  return (
    <div className={cx("site-container flex flex-col gap-space-5 text-primary-leather ui-desktop:gap-space-10", variant ? variant.containerClassName : "pt-space-11 pb-space-11 ui-desktop:pt-space-15 ui-desktop:pb-space-15")}>
      <header className="flex flex-col items-center gap-space-5 ui-desktop:gap-space-6">
        {variant?.header ?? (
          <h1 className="type-heading-caps-md text-center ui-desktop:type-heading-caps-lg">
            <RichText value={HEADING} emClassName="type-heading-italic-md ui-desktop:type-heading-italic-lg" />
          </h1>
        )}

        {/* Natural / Lab-Grown: Figma "Tabs" (pill), 40px tabs on desktop and 32px on mobile. */}
        {(["md", "sm"] as const).map((size) => (
          <Tabs
            key={size}
            label="Stone origin"
            size={size}
            value={origin}
            onChange={(next) => setState({ ...state, origin: next as StoneOrigin, numbers: {}, page: 1 })}
            items={copy.origins.map((item) => ({ id: item.value, label: item.label }))}
            // The shared Tabs draw their border outside Figma's 48px box (50 tall); -my-px keeps what follows on Figma's lines.
            className={size === "md" ? "-my-px hidden ui-desktop:block" : "-my-px ui-desktop:hidden"}
          />
        ))}

        {/* Desktop shape tiles: Figma "Radio Button" MD, 104 x 90, 8px apart. A second press on the chosen shape clears it. */}
        {/* -my-px: the shared Radio Button is 92 tall for Figma's 90 (its border sits outside the padding). */}
        <fieldset className="-my-px hidden w-full min-w-0 ui-desktop:block">
          <legend className="sr-only">{copy.shapeLegend}</legend>
          {/* 104px tiles at 1440; below about 1300 the ten share the row and narrow instead of overflowing. */}
          <div className="flex justify-center gap-space-2">
            {STONE_SHAPES.map((shape) => (
              <RadioButton
                key={shape.value}
                name={`${id}-shape`}
                icon={shape.icon}
                checked={state.shape === shape.value}
                onChange={() => set({ shape: shape.value })}
                onClick={() => state.shape === shape.value && set({ shape: null })}
                className="w-26 min-w-0 shrink"
              >
                {shape.label}
              </RadioButton>
            ))}
          </div>
        </fieldset>

        {/* Mobile controls: Filters, Ships by and Sort by, then the active filters as removable chips (3587:125351). */}
        <div className="flex w-full flex-col gap-space-2 ui-desktop:hidden">
          <div className="grid grid-cols-3 gap-space-2">
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => setSheetOpen(true)}
              className="ui-transition type-ui-xs-regular flex min-h-space-8 cursor-pointer items-center justify-center gap-1.5 rounded-4 border border-secondary-gold bg-secondary-skin px-space-3 text-primary-leather hover:border-black-alpha-50"
            >
              <Icon name="filter" size={16} />
              {activeCount ? `${listCopy.title} (${activeCount})` : listCopy.title}
            </button>
            <Dropdown size="xs" label={listCopy.shipsBy} options={shipChoices} value={state.ships ? String(state.ships) : ""} onChange={(value) => set({ ships: value ? Number(value) : null })} />
            <Dropdown
              size="xs"
              label={listCopy.sortBy}
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
      </header>

      {/* Desktop filters: a gold rule, two rows of three 400px columns, the Advanced Filters divider and the results row. */}
      <div data-stone-filters={kind} className="hidden flex-col gap-space-6 border-t border-secondary-gold pt-[calc(var(--spacing-space-6)-1px)] ui-desktop:flex">
        <div className="grid grid-cols-3 gap-space-6">
          {gem ? (
            <>
              <div data-filter="gemcolor" className="flex flex-col gap-space-2">
                <StoneFilterLabel label={copy.color} />
                <GemColorDropdown value={state.gemColor} onChange={(gemColor) => set({ gemColor })} />
              </div>
              <div data-filter="gem" className="flex flex-col gap-space-2">
                <StoneFilterLabel label={copy.type} />
                <Dropdown
                  size="sm"
                  label={copy.type}
                  options={[{ value: ALL_GEMS, label: copy.allTypes }, ...gemTypes]}
                  value={state.gem ?? ALL_GEMS}
                  onChange={(value) => set({ gem: value === ALL_GEMS ? null : value })}
                />
              </div>
              <GradeFilter kind={kind} gradeKey="cut" {...filter} />
            </>
          ) : (
            <>
              <GradeFilter kind={kind} gradeKey="cut" {...filter} onHelp={() => openHelp("cut")} />
              <GradeFilter kind={kind} gradeKey="color" {...filter} onHelp={() => openHelp("color")} />
              <GradeFilter kind={kind} gradeKey="clarity" {...filter} onHelp={() => openHelp("clarity")} />
            </>
          )}
        </div>
        <div className="grid grid-cols-3 gap-space-6">
          {gem ? <GradeFilter kind={kind} gradeKey="clarity" {...filter} /> : null}
          <NumberFilter numberKey="carat" bounds={bounds} {...filter} compact />
          <NumberFilter numberKey="price" bounds={bounds} {...filter} compact />
          {gem ? null : (
            <div data-filter="cert" className="flex flex-col gap-space-2">
              <StoneFilterLabel id={`${id}-cert`} label={copy.certificate} />
              <CertificateTiles {...filter} labelledBy={`${id}-cert`} tall />
            </div>
          )}
        </div>

        {/* Figma "Advanced Filters": a centred toggle between two gold rules; open, it shows a count and a close mark. */}
        <div className={cx("flex flex-col", variant ? variant.advancedClassName : "gap-space-6")}>
          <div className="flex items-center gap-space-2">
            <span aria-hidden="true" className="h-px flex-1 bg-secondary-gold" />
            <button
              type="button"
              aria-expanded={advancedOpen}
              aria-controls={`${id}-advanced`}
              onClick={() => setAdvancedOpen((current) => !current)}
              className="ui-transition type-ui-xs-medium flex cursor-pointer items-center gap-space-1 rounded-4 text-primary-leather ui-hover:text-black-alpha-60"
            >
              {advancedCount ? (
                <span className="type-ui-2xs-medium mr-space-1 flex size-space-4 items-center justify-center rounded-full bg-primary-leather text-base-white">
                  {advancedCount}
                  <span className="sr-only"> active:</span>
                </span>
              ) : null}
              {copy.advanced}
              <Icon name={advancedOpen ? "close" : "plus"} size={16} />
            </button>
            <span aria-hidden="true" className="h-px flex-1 bg-secondary-gold" />
          </div>
          <div id={`${id}-advanced`} hidden={!advancedOpen} className={cx("items-center justify-between gap-space-4", advancedOpen && "flex")}>
            <div className="flex flex-wrap items-center gap-2.5">{ADVANCED_KEYS[kind].map(advancedDropdown)}</div>
            {activeCount ? (
              <TextButton variant="caps" size="sm" leadingIcon="close" onClick={clearAll}>
                {listCopy.clearFilters}
              </TextButton>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-between gap-space-4">
          <p className="type-ui-xs-regular" data-stone-count="">
            {copy.showing} <span className="font-medium">{shown.length ? `1-${shown.length}` : "0"}</span> {copy.of} <span className="font-medium">{matches.length}</span>
          </p>
          <div className="flex shrink-0 items-center gap-space-4">
            <Dropdown
              size="sm"
              width="auto"
              label={listCopy.shipsBy}
              valuePrefix={listCopy.shipsBy}
              options={shipChoices}
              value={state.ships ? String(state.ships) : ""}
              onChange={(value) => set({ ships: value ? Number(value) : null })}
              panelWidth="w-full min-w-44"
              panelAlign="end"
            />
            <Dropdown
              size="sm"
              width="auto"
              label={listCopy.sortBy}
              valuePrefix={listCopy.sortBy}
              options={sortOptions.map(({ value, label }) => ({ value, label }))}
              value={state.sort}
              onChange={(sort) => set({ sort })}
              panelWidth="w-full min-w-48"
              panelAlign="end"
            />
          </div>
        </div>
      </div>

      <div className={cx("flex flex-col", variant?.resultsClassName)}>
        <h2 className="sr-only">{variant ? variant.resultsLabel : gem ? "Gemstones" : "Diamonds"}</h2>
        <p role="status" className="sr-only">
          {isClient ? `Showing ${shown.length} of ${matches.length} ${variant ? variant.resultsLabel.toLowerCase() : matches.length === 1 ? "stone" : "stones"}.` : ""}
        </p>
        {shown.length ? (
          <ul ref={gridRef} className={variant ? variant.gridClassName : "grid grid-cols-2 gap-x-space-2 gap-y-space-4 ui-desktop:grid-cols-4 ui-desktop:gap-space-4"}>
            {shown.map((stone) => (
              <li key={stone.handle}>
                {variant ? (
                  variant.card(stone, { ring, settingPrice, onQuickView: (item) => setQuickView({ stone: item, open: true }) })
                ) : (
                  <StoneCard
                    stone={stone}
                    href={stoneHref(stone.handle, ring)}
                    completeHref={completeHref({ ...ring, stone: stone.handle })}
                    settingPrice={settingPrice}
                    onQuickView={(item) => setQuickView({ stone: item, open: true })}
                  />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-space-5 rounded-4 border border-secondary-gold px-space-8 py-space-10 text-center ui-desktop:gap-space-8 ui-desktop:px-space-15 ui-desktop:py-space-13">
            <p className="type-heading-sm max-w-[24.875rem] ui-desktop:type-heading-md">{variant ? variant.emptyText : copy.empty}</p>
            <Button size="sm" variant="secondary" leftIcon="arrow-counter-clockwise" onClick={clearAll}>
              {listCopy.clearFilters}
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
            {builderContent.viewMore}
          </Button>
        </div>
      ) : null}

      <StoneFilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        kind={kind}
        state={state}
        bounds={bounds}
        onApply={(next) => {
          setSheetOpen(false);
          setState(next);
        }}
        onHelp={openHelp}
      />
      <CccModal open={help.open} onClose={() => setHelp((current) => ({ ...current, open: false }))} tab={help.tab} onTabChange={(tab) => setHelp({ open: true, tab })} />
      {quickView && variant
        ? variant.quickView(quickView.stone, { ring, settingPrice, open: quickView.open, onClose: () => setQuickView({ ...quickView, open: false }) })
        : null}
      {quickView && !variant ? (
        <StoneQuickView
          key={quickView.stone.handle}
          stone={quickView.stone}
          open={quickView.open}
          onClose={() => setQuickView({ ...quickView, open: false })}
          href={stoneHref(quickView.stone.handle, ring)}
          completeHref={completeHref({ ...ring, stone: quickView.stone.handle })}
          settingPrice={settingPrice}
        />
      ) : null}
    </div>
  );
}
