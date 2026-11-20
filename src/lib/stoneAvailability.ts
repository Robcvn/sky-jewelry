"use client";

/**
 * A loose stone's availability, read in the browser from the Storefront API (read only: no cart is created).
 * The static pages carry each stone's availability as it was at build time; a stone sold since then is only known
 * here. Step 3 uses it to show Figma's "Stone Unavailable" state. One request per stone per page load.
 * Without Shopify (the local seed, or no store configured) the build-time value stands.
 */
import { useEffect, useState } from "react";
import { getStoneAvailability, shopifyConfig } from "@/lib/shopify";

const checks = new Map<string, Promise<boolean | null>>();

function check(handle: string) {
  let request = checks.get(handle);
  if (!request) {
    // A failed read leaves the build-time value in place (null), so a network problem never blocks the ring.
    request = getStoneAvailability(handle).catch(() => null);
    checks.set(handle, request);
  }
  return request;
}

/**
 * The stone's availability: the build-time value until the Storefront API answers, then the store's.
 * Pass null when there is no stone. Stones that only exist in the local seed (no variant id) are not checked.
 */
export function useStoneAvailable(stone: { handle: string; variantId: string | null; available: boolean } | null) {
  const handle = stone?.handle ?? null;
  const checkable = Boolean(stone?.variantId) && shopifyConfig() !== null;
  const [live, setLive] = useState<{ handle: string; available: boolean } | null>(null);

  useEffect(() => {
    if (!handle || !checkable) return;
    let current = true;
    void check(handle).then((available) => {
      if (current && available !== null) setLive({ handle, available });
    });
    return () => {
      current = false;
    };
  }, [handle, checkable]);

  if (!stone) return true;
  return live && live.handle === stone.handle ? live.available : stone.available;
}
