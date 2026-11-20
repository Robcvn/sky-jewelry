"use client";

/**
 * The address book: the mock customer's addresses plus any added with "Add Address", kept in this browser only
 * (localStorage). "Set as default address" moves the Default badge. Editing and removing aren't drawn beyond their
 * links, so there is no way to change or delete an address (Held for review). Nothing is sent anywhere.
 */
import { useSyncExternalStore } from "react";
import { customer, type AccountAddress } from "@/content/account";

const KEY = "sky-account-addresses";
type Saved = { added: AccountAddress[]; defaultAddress: string | null };
export type AddressBook = { addresses: AccountAddress[]; defaultAddress: string };

const EMPTY: Saved = { added: [], defaultAddress: null };
const SERVER: AddressBook = { addresses: customer.addresses, defaultAddress: customer.defaultAddress };

let saved: Saved = EMPTY;
let book: AddressBook = SERVER;
let loaded = false;
const listeners = new Set<() => void>();

const toBook = (next: Saved): AddressBook => {
  const addresses = [...customer.addresses, ...next.added];
  const preferred = next.defaultAddress && addresses.some((address) => address._key === next.defaultAddress) ? next.defaultAddress : null;
  return { addresses, defaultAddress: preferred ?? customer.defaultAddress };
};

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "null");
    if (parsed && Array.isArray(parsed.added)) saved = { added: parsed.added, defaultAddress: parsed.defaultAddress ?? null };
  } catch {
    saved = EMPTY;
  }
  book = toBook(saved);
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAddressBook() {
  return useSyncExternalStore(
    subscribe,
    () => book,
    () => SERVER,
  );
}

/** Adds an address to this browser's address book; returns its key. */
export function addAddress(address: Omit<AccountAddress, "_key">, makeDefault: boolean) {
  load();
  const key = `added-${Date.now().toString(36)}`;
  saved = { added: [...saved.added, { ...address, _key: key }], defaultAddress: makeDefault ? key : saved.defaultAddress };
  book = toBook(saved);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(saved));
  } catch {
    // Storage blocked: the address holds for this page view only.
  }
  listeners.forEach((listener) => listener());
  return key;
}
