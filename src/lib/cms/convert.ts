/**
 * Converting the site's editorial content to Sanity documents and back. The content files are already shaped like
 * Sanity documents (a _type and _key on most things), so the two directions only cover what Sanity requires on top:
 *
 * To Sanity (the import file, scripts/build-sanity-import.mjs):
 *  - every object in an array gets a _key (from its slug, value or id, else its position) and a _type (the array's
 *    item type, "<field>Item", as the studio's models name it) when the content has none;
 *  - arrays of arrays (table rows) become arrays of { _type: "row", cells };
 *  - "span" (the rich text pieces) is "textSpan" in Sanity, whose own "span" type is reserved;
 *  - undefined values are left out.
 *
 * From Sanity (the build, src/lib/content.ts): the reverse, guided by the local version of the same document (or, for
 * a document that only exists in Sanity, a local document of the same type): Sanity's own fields (_rev, _createdAt...)
 * and any _id, _key or _type the local shape doesn't have are removed, rows become arrays again, and keys keep the local
 * order (an object's key order shows in the page payload). So a document imported unchanged comes back exactly as the
 * content file has it, and an edited one comes back in the same shape with the editor's values.
 */

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
type Obj = Record<string, unknown>;

/** Item types for arrays whose objects have no _type in the content files: the studio's models use the same names. */
export const arrayItemType = (field: string) => `${field}Item`;
export const ROW_TYPE = "row";
const TO_SANITY_TYPE: Record<string, string> = { span: "textSpan" };
const FROM_SANITY_TYPE = Object.fromEntries(Object.entries(TO_SANITY_TYPE).map(([local, sanity]) => [sanity, local]));
const SANITY_FIELDS = new Set(["_rev", "_createdAt", "_updatedAt", "_originalId", "_system"]);

const isObject = (value: unknown): value is Obj => Boolean(value) && typeof value === "object" && !Array.isArray(value);

function keyFor(item: Obj, index: number) {
  for (const field of ["_key", "slug", "value", "id", "_id"]) if (typeof item[field] === "string" && item[field]) return item[field] as string;
  return String(index);
}

/** The local content as Sanity stores it. `field` is the name of the field the value sits in. */
export function toSanity(value: unknown, field = ""): Json | undefined {
  if (value === undefined || typeof value === "function") return undefined;
  if (Array.isArray(value)) {
    if (value.some(Array.isArray)) {
      return value.map((cells, index) => ({ _type: ROW_TYPE, _key: `row-${index}`, cells: toSanity(cells, "cells") as Json }));
    }
    const keys = value.map((item, index) => (isObject(item) ? keyFor(item, index) : ""));
    const unique = new Set(keys).size === keys.length;
    return value.map((item, index) => {
      if (!isObject(item)) return toSanity(item, field) as Json;
      const converted = toSanity(item, field) as { [key: string]: Json };
      return {
        ...(item._type === undefined ? { _type: arrayItemType(field) } : {}),
        ...(item._key === undefined ? { _key: unique ? keys[index] : `${keys[index]}-${index}` } : {}),
        ...converted,
      };
    });
  }
  if (isObject(value)) {
    const out: { [key: string]: Json } = {};
    for (const [key, entry] of Object.entries(value)) {
      const converted = toSanity(entry, key);
      if (converted === undefined) continue;
      out[key] = key === "_type" && typeof converted === "string" ? (TO_SANITY_TYPE[converted] ?? converted) : converted;
    }
    return out;
  }
  return value as Json;
}

/** The template for one array item: the local item with the same _key, else the same position, else the first. */
function itemTemplate(item: unknown, index: number, template: unknown[]): unknown {
  if (!template.length) return undefined;
  if (isObject(item)) {
    const localType = typeof item._type === "string" ? (FROM_SANITY_TYPE[item._type] ?? item._type) : undefined;
    const sameKey = template.find((candidate) => isObject(candidate) && candidate._key !== undefined && candidate._key === item._key);
    if (sameKey) return sameKey;
    const sameType = (candidate: unknown) => !isObject(candidate) || candidate._type === undefined || candidate._type === localType;
    if (sameType(template[index])) return template[index] ?? template.find(sameType);
    return template.find(sameType) ?? template[0];
  }
  return template[index] ?? template[0];
}

/** A Sanity value back in the local shape, with `template` (the local value at the same place) as the guide. */
export function fromSanity(value: unknown, template: unknown): unknown {
  if (Array.isArray(value)) {
    const local = Array.isArray(template) ? template : [];
    // Rows of a table: back to arrays of cells.
    if (local.some(Array.isArray) || value.every((item) => isObject(item) && item._type === ROW_TYPE)) {
      return value.map((row, index) => fromSanity(isObject(row) ? row.cells : row, local[index] ?? local[0] ?? []));
    }
    return value.map((item, index) => fromSanity(item, itemTemplate(item, index, local)));
  }
  if (!isObject(value)) return value;
  const shape = isObject(template) ? template : undefined;
  const out: Obj = {};
  const keep = (key: string) => {
    if (SANITY_FIELDS.has(key)) return false;
    if (key === "_key" || key === "_type" || key === "_id") {
      if (shape) return key in shape;
      // Nothing to compare with (a new kind of item): keep the content's own _type, drop Sanity's item types.
      return key === "_type" ? !(String(value._type).endsWith("Item") || value._type === ROW_TYPE) : true;
    }
    return true;
  };
  // The local key order first (including keys the local version holds as undefined), then any new keys.
  const order = [...(shape ? Object.keys(shape) : []), ...Object.keys(value).filter((key) => !shape || !(key in shape))];
  for (const key of order) {
    if (key in value) {
      if (!keep(key)) continue;
      const entry = value[key];
      out[key] = key === "_type" && typeof entry === "string" ? (FROM_SANITY_TYPE[entry] ?? entry) : fromSanity(entry, shape?.[key]);
    } else if (shape && key in shape && shape[key] === undefined) {
      out[key] = undefined;
    }
  }
  return out;
}

/** Deep equality for checks: undefined-valued keys count as absent, key order is ignored. */
export function sameContent(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) || Array.isArray(b)) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((item, index) => sameContent(item, b[index]));
  }
  if (isObject(a) && isObject(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)].filter((key) => a[key] !== undefined || b[key] !== undefined));
    return [...keys].every((key) => sameContent(a[key], b[key]));
  }
  return a === b;
}
