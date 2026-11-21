/*
 * The earrings being built, as they live in the URL, and the earrings builder's routes. They mirror the ring
 * builder's (src/components/builder/ring.ts) under /design-your-own/earrings/:
 *   /design-your-own/earrings/                    Step 1: choose a setting (list)
 *   /design-your-own/earrings/setting/<handle>/   Step 1: the setting's page
 *   /design-your-own/earrings/stone/              Step 2: choose a matched pair of diamonds (list)
 *   /design-your-own/earrings/stone/<handle>/     Step 2: the pair's page
 *   /design-your-own/earrings/complete/           Step 3: the complete earrings
 * Query, carried from page to page so the earrings can be linked to and resumed, with the ring's names:
 *   setting=<handle>  metal=14k-yellow-gold  shape=round  stone=<pair handle>
 * There is no size. The ring's parser and serializer are reused; size and start are never set here.
 */
import { EARRINGS_COMPLETE_ROUTE, EARRINGS_ROUTE, EARRINGS_STONES_ROUTE } from "@/content/earrings";
import { parseRing, ringParams, type Ring } from "@/components/builder/ring";

export type Earrings = Pick<Ring, "setting" | "metal" | "shape" | "stone">;

export function parseEarrings(params: URLSearchParams): Earrings {
  const { setting, metal, shape, stone } = parseRing(params);
  return { setting, metal, shape, stone };
}

const params = (earrings: Partial<Earrings>) => ringParams({ setting: earrings.setting, metal: earrings.metal, shape: earrings.shape, stone: earrings.stone });
const withQuery = (path: string, query: URLSearchParams) => (query.size ? `${path}?${query}` : path);

/** Step 1 list. */
export const earringSettingsHref = () => EARRINGS_ROUTE;
/** A setting's page, with the metal chosen so far. */
export const earringSettingHref = (handle: string, earrings: Partial<Earrings> = {}) =>
  withQuery(`${EARRINGS_ROUTE}setting/${handle}/`, params({ metal: earrings.metal, shape: earrings.shape }));
/** Step 2 list for earrings whose setting is chosen. */
export const pairsHref = (earrings: Partial<Earrings>) => withQuery(EARRINGS_STONES_ROUTE, params({ setting: earrings.setting, metal: earrings.metal, shape: earrings.shape }));
/** A pair's page, carrying the earrings. */
export const pairHref = (handle: string, earrings: Partial<Earrings> = {}) =>
  withQuery(`${EARRINGS_STONES_ROUTE}${handle}/`, params({ setting: earrings.setting, metal: earrings.metal, shape: earrings.shape }));
/** Step 3 with the setting and the pair. */
export const earringsCompleteHref = (earrings: Partial<Earrings>) => withQuery(EARRINGS_COMPLETE_ROUTE, params(earrings));
