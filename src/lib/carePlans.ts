"use client";

/**
 * Care plans chosen in the bag, kept in this browser only (localStorage), keyed by bag line. They are mock: the
 * plans and prices live in src/content/bag.ts, not in Shopify, and nothing is sent anywhere.
 * A saved plan that is no longer offered shows Figma's "This care plan is no longer available" state.
 */
import { useSyncExternalStore } from "react";
import { bagContent, bagFeatures, type CarePlan, type CarePlanId } from "@/content/bag";
import { isFineJewelry } from "@/content/products";
import type { BagLine } from "./bag";

const KEY = "sky-care-plans";
type Saved = Record<string, string>;

let saved: Saved = {};
let loaded = false;
const listeners = new Set<() => void>();
const EMPTY: Saved = {};

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
    saved = parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    saved = {};
  }
}

function save(next: Saved) {
  saved = next;
  try {
    if (Object.keys(next).length) window.localStorage.setItem(KEY, JSON.stringify(next));
    else window.localStorage.removeItem(KEY);
  } catch {
    // Storage blocked: the plan holds for this page view only.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Saved plan ids by bag line id. */
export function useCarePlans() {
  return useSyncExternalStore(
    subscribe,
    () => saved,
    () => EMPTY,
  );
}

export function setCarePlan(lineId: string, plan: CarePlanId | null) {
  load();
  const next = { ...saved };
  if (plan) next[lineId] = plan;
  else delete next[lineId];
  save(next);
}

/**
 * Every Fine Jewelry piece can take a care plan (the plan's coverage lists rings, clasps, earring posts and pearls), and
 * so can a built ring: Figma's ring rows draw one care plan row per ring, kept on the ring's setting line.
 */
export const carePlanEligible = (line: Pick<BagLine, "category" | "ring">) =>
  bagFeatures.carePlans && (isFineJewelry(line.category) || line.ring?.role === "setting");

export type CarePlanState = { status: "none" } | { status: "added"; plan: CarePlan } | { status: "unavailable"; id: string };

export function carePlanState(lineId: string, plans: Saved): CarePlanState {
  const id = plans[lineId];
  if (!id) return { status: "none" };
  const plan = bagContent.carePlan.plans.find((item) => item._key === id);
  return plan ? { status: "added", plan } : { status: "unavailable", id };
}

/** Care Plans line of the Order Price panel: each added plan once per piece. Plans for lines no longer in the bag don't count. */
export function carePlansTotal(lines: BagLine[], plans: Saved) {
  return lines.reduce((sum, line) => {
    const state = carePlanState(line.id, plans);
    return state.status === "added" ? sum + state.plan.price * line.quantity : sum;
  }, 0);
}
