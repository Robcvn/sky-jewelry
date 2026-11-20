/*
 * Step 2 (choose a stone): filtering, sorting and URL state. Pure functions; the listing runs them in the
 * browser over the stones fetched at build time.
 *
 * URL query, next to the ring's own parameters (setting, metal, shape, start; see ring.ts):
 *   origin=lab-grown          the tab; without it the tab comes from ?start= (natural by default)
 *   shape=round               the ring's centre stone shape, which is also the shape filter
 *   cut=very-good,excellent   grade ranges, lowest and highest: cut, color, clarity, polish, symmetry, fluor
 *   carat=0.50-2.00           number ranges: carat, price, table, depth, ratio
 *   cert=GIA,IGI              certificates (any of)
 *   gemcolor=blue  gem=sapphire  treatment=none,heating     gemstone mode only
 *   ships=5  sort=price-asc  page=2
 */
import { CERTIFICATES, DIAMOND_SCALES, GEM_COLORS, GEM_SCALES, GEM_TREATMENTS, GEM_TYPES, type Option, type StoneKind, type StoneOrigin, type StoneShape } from "@/content/builder";
import type { Stone } from "@/lib/builder";
import { parseShape } from "./ring";

export type Range = [number, number];
/** Lowest and highest grade of a scale, as the scale's values. */
export type GradeSpan = [string, string];

export const GRADE_KEYS = ["cut", "color", "clarity", "polish", "symmetry", "fluor"] as const;
export type GradeKey = (typeof GRADE_KEYS)[number];
export const NUMBER_KEYS = ["carat", "price", "table", "depth", "ratio"] as const;
export type NumberKey = (typeof NUMBER_KEYS)[number];

export type StoneFilterState = {
  origin: StoneOrigin | null;
  shape: StoneShape | null;
  grades: Partial<Record<GradeKey, GradeSpan>>;
  numbers: Partial<Record<NumberKey, Range>>;
  cert: string[];
  gemColor: string | null;
  gem: string | null;
  treatment: string[];
  ships: number | null;
  sort: string;
  page: number;
};

/**
 * gem=all: "All Types" chosen on purpose. Needed because a menu link such as ?start=sapphire preselects a type,
 * so "no gem parameter" there means sapphire, not every type.
 */
export const ALL_GEMS = "all";

export const EMPTY_STONE_FILTERS: StoneFilterState = {
  origin: null,
  shape: null,
  grades: {},
  numbers: {},
  cert: [],
  gemColor: null,
  gem: null,
  treatment: [],
  ships: null,
  sort: "best-match",
  page: 1,
};

/** The grade scales a kind of stone uses. Gemstones have their own cut and clarity scales and no colour grades. */
export function scalesFor(kind: StoneKind): Partial<Record<GradeKey, Option[]>> {
  return kind === "gemstone"
    ? { cut: GEM_SCALES.cut, clarity: GEM_SCALES.clarity }
    : {
        cut: DIAMOND_SCALES.cut,
        color: DIAMOND_SCALES.color,
        clarity: DIAMOND_SCALES.clarity,
        polish: DIAMOND_SCALES.polish,
        symmetry: DIAMOND_SCALES.symmetry,
        fluor: DIAMOND_SCALES.fluorescence,
      };
}

const list = (value: string | null) => (value ? value.split(",").map((item) => item.trim()).filter(Boolean) : []);

function range(value: string | null): Range | null {
  const match = value?.match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const [min, max] = [Number(match[1]), Number(match[2])];
  return min <= max ? [min, max] : [max, min];
}

/** The filter keys this module owns in the query string. Everything else (the ring) passes through untouched. */
const OWN_KEYS = ["origin", "shape", ...GRADE_KEYS, ...NUMBER_KEYS, "cert", "gemcolor", "gem", "treatment", "ships", "sort", "page"];

export function parseStoneFilters(params: URLSearchParams): StoneFilterState {
  const origin = params.get("origin");
  const ships = Number(params.get("ships"));
  const page = Number(params.get("page"));
  const sort = params.get("sort");
  const grades: StoneFilterState["grades"] = {};
  for (const key of GRADE_KEYS) {
    const [min, max] = list(params.get(key));
    if (min && max) grades[key] = [min, max];
  }
  const numbers: StoneFilterState["numbers"] = {};
  for (const key of NUMBER_KEYS) {
    const value = range(params.get(key));
    if (value) numbers[key] = value;
  }
  const gemColor = params.get("gemcolor");
  const gem = params.get("gem");
  return {
    origin: origin === "natural" || origin === "lab-grown" ? origin : null,
    shape: parseShape(params.get("shape")),
    grades,
    numbers,
    cert: list(params.get("cert")).filter((value) => (CERTIFICATES as readonly string[]).includes(value)),
    gemColor: GEM_COLORS.some((color) => color.value === gemColor) ? gemColor : null,
    gem: gem === ALL_GEMS || GEM_TYPES.some((type) => type.value === gem) ? gem : null,
    treatment: list(params.get("treatment")).filter((value) => GEM_TREATMENTS.some((item) => item.value === value)),
    ships: Number.isInteger(ships) && ships > 0 ? ships : null,
    sort: sort === "price-asc" || sort === "price-desc" ? sort : "best-match",
    page: Number.isInteger(page) && page > 1 ? page : 1,
  };
}

const DECIMALS: Record<NumberKey, number> = { carat: 2, price: 0, table: 1, depth: 1, ratio: 2 };

/** The whole query string for a state: the current one with this module's keys replaced. */
export function serializeStoneFilters(state: StoneFilterState, current: URLSearchParams) {
  const params = new URLSearchParams(current);
  for (const key of OWN_KEYS) params.delete(key);
  if (state.shape) params.set("shape", state.shape);
  if (state.origin) params.set("origin", state.origin);
  for (const key of GRADE_KEYS) if (state.grades[key]) params.set(key, state.grades[key]!.join(","));
  for (const key of NUMBER_KEYS) if (state.numbers[key]) params.set(key, state.numbers[key]!.map((value) => value.toFixed(DECIMALS[key])).join("-"));
  if (state.cert.length) params.set("cert", state.cert.join(","));
  if (state.gemColor) params.set("gemcolor", state.gemColor);
  if (state.gem) params.set("gem", state.gem);
  if (state.treatment.length) params.set("treatment", state.treatment.join(","));
  if (state.ships) params.set("ships", String(state.ships));
  if (state.sort !== "best-match") params.set("sort", state.sort);
  if (state.page > 1) params.set("page", String(state.page));
  return params;
}

export type StoneBounds = Record<NumberKey, Range>;

const STEP: Record<NumberKey, number> = { carat: 0.05, price: 100, table: 0.5, depth: 0.5, ratio: 0.05 };
export const stepOf = (key: NumberKey) => STEP[key];

const VALUE: Record<NumberKey, (stone: Stone) => number> = {
  carat: (stone) => stone.carat,
  price: (stone) => stone.price,
  table: (stone) => stone.table,
  depth: (stone) => stone.depth,
  ratio: (stone) => stone.ratio,
};

/** Slider bounds for a set of stones (one tab), rounded outwards to each slider's step. */
export function stoneBounds(stones: Stone[]): StoneBounds {
  const bound = (key: NumberKey): Range => {
    const values = stones.map(VALUE[key]);
    if (!values.length) return [0, 0];
    const step = STEP[key];
    const decimals = (String(step).split(".")[1] ?? "").length;
    return [Number((Math.floor(Math.min(...values) / step + 1e-9) * step).toFixed(decimals)), Number((Math.ceil(Math.max(...values) / step - 1e-9) * step).toFixed(decimals))];
  };
  return { carat: bound("carat"), price: bound("price"), table: bound("table"), depth: bound("depth"), ratio: bound("ratio") };
}

/** A range only filters when it is narrower than the slider's bounds. */
export const numberActive = (value: Range | undefined, bounds: Range) => Boolean(value && (value[0] > bounds[0] || value[1] < bounds[1]));

/** A grade span as indexes into its scale, or null when it covers the whole scale (or names unknown grades). */
export function gradeIndexes(span: GradeSpan | undefined, scale: Option[] | undefined): [number, number] | null {
  if (!span || !scale) return null;
  const a = scale.findIndex((item) => item.value === span[0]);
  const b = scale.findIndex((item) => item.value === span[1]);
  if (a < 0 || b < 0) return null;
  const [min, max] = a <= b ? [a, b] : [b, a];
  return min === 0 && max === scale.length - 1 ? null : [min, max];
}

const GRADE: Record<GradeKey, (stone: Stone) => string> = {
  cut: (stone) => stone.cut,
  color: (stone) => stone.color,
  clarity: (stone) => stone.clarity,
  polish: (stone) => stone.polish,
  symmetry: (stone) => stone.symmetry,
  fluor: (stone) => stone.fluorescence,
};

const inRange = (value: number, [min, max]: Range) => value >= min - 1e-9 && value <= max + 1e-9;

/** The stones of one tab: diamonds or gemstones, natural or lab-grown. */
export const tabStones = (stones: Stone[], kind: StoneKind, origin: StoneOrigin) => stones.filter((stone) => stone.kind === kind && stone.origin === origin);

/** Filters and sorts one tab's stones. */
export function applyStoneFilters(pool: Stone[], state: StoneFilterState, kind: StoneKind, bounds: StoneBounds): Stone[] {
  const scales = scalesFor(kind);
  const grades = GRADE_KEYS.flatMap((key) => {
    const indexes = gradeIndexes(state.grades[key], scales[key]);
    return indexes ? [{ key, indexes, scale: scales[key]! }] : [];
  });
  const numbers = NUMBER_KEYS.filter((key) => numberActive(state.numbers[key], bounds[key]));

  const matches = pool.filter((stone) => {
    if (state.shape && stone.shape !== state.shape) return false;
    if (state.cert.length && !state.cert.includes(stone.certificate)) return false;
    if (state.ships && stone.shipsInDays > state.ships) return false;
    if (kind === "gemstone") {
      if (state.gemColor && stone.color !== state.gemColor) return false;
      if (state.gem && state.gem !== ALL_GEMS && stone.gem !== state.gem) return false;
      if (state.treatment.length && !state.treatment.includes(stone.treatment ?? "none")) return false;
    }
    for (const { key, indexes, scale } of grades) {
      const index = scale.findIndex((item) => item.value === GRADE[key](stone));
      if (index < indexes[0] || index > indexes[1]) return false;
    }
    return numbers.every((key) => inRange(VALUE[key](stone), state.numbers[key]!));
  });

  if (state.sort === "price-asc") return [...matches].sort((a, b) => a.price - b.price);
  if (state.sort === "price-desc") return [...matches].sort((a, b) => b.price - a.price);
  return matches;
}

/** Ship-by choices: one per lead time among the stones. */
export const stoneShipOptions = (stones: Stone[]) => [...new Set(stones.map((stone) => stone.shipsInDays))].sort((a, b) => a - b);

/** The stone's colour as the cards show it: the grade for a diamond, the colour's name for a gemstone. */
export const stoneColorLabel = (stone: Pick<Stone, "kind" | "color">) =>
  stone.kind === "gemstone" ? (GEM_COLORS.find((color) => color.value === stone.color)?.label ?? stone.color) : stone.color;

/** Which filters count as "advanced" for each kind (the row behind Advanced Filters, and the sheet's group). */
export const ADVANCED_KEYS: Record<StoneKind, Array<GradeKey | NumberKey | "treatment" | "cert">> = {
  diamond: ["polish", "symmetry", "fluor", "table", "depth", "ratio"],
  gemstone: ["treatment", "ratio", "cert"],
};
