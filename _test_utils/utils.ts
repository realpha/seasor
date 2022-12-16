import { fc } from "./deps.ts";
import { Ordering, Predicate } from "../types/mod.ts";

export interface HasId {
  id: number;
}

/**
 * Predicates
 */

function isEqualId(lhs: HasId, rhs: HasId): boolean {
  return lhs.id === rhs.id;
}

export function isEqualIdFactory(rhs: HasId) {
  return (lhs: HasId) => isEqualId(lhs, rhs);
}

/**
 * Comparators
 */

export function ascendingById(lhs: HasId, rhs: HasId): Ordering {
  if (lhs.id < rhs.id) return Ordering.Less;
  if (lhs.id > rhs.id) return Ordering.Greater;
  return Ordering.Equal;
}

export function idComparatorFactory(rhs: HasId): (lhs: HasId) => Ordering {
  return (lhs: HasId) => ascendingById(lhs, rhs);
}

/**
 * fast-check Arbitraries
 */

export function generateArray() {
  return fc.array(generateEntity(), { size: "medium" });
}

export function generateEntity() {
  return fc.record(
    {
      id: fc.nat(),
    },
    { requiredKeys: ["id"] },
  );
}

/**
 * Misc
 */

export type JsType =
  | "bigint"
  | "boolean"
  | "function"
  | "number"
  | "object"
  | "string"
  | "symbol"
  | "undefined";

function isType(type: JsType, value: unknown): boolean {
  if (typeof value === type) return true;
  return false;
}

const generalTypePredicate: Predicate<JsType, unknown> = isType;

export const isNumber = isType.bind(null, "number");

export function applyType(t: JsType) {
  return (v: unknown) => isType(t, v);
}
