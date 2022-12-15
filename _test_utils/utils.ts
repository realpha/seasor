import { fc } from "./deps.ts";
import { binarySearchBy } from "../mod.ts";
import { BoundComparator, Ordering, Predicate } from "../types/mod.ts";

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

function isEqualIdPredicate(v: HasId, n: number): boolean {
  return v.id === n;
}

export function isEqualIdFactory(idValue: number) {
  return (v: HasId) => isEqualIdPredicate(v, idValue);
}

export function generateArray() {
  return fc.array(generateHasIdElement(), { size: "medium" });
}

export function generateHasIdElement() {
  return fc.record(
    {
      id: fc.nat(),
    },
    { requiredKeys: ["id"] }
  );
}

export interface HasId {
  id: number;
}

export function getIsEqualIdComperator(n: number): (v: HasId) => Ordering {
  return ({ id }: HasId) => {
    if (id < n) return Ordering.Less;
    if (id > n) return Ordering.Greater;
    return Ordering.Equal;
  };
}

export function orderByIdComperator(a: HasId, b: HasId): Ordering {
  if (a.id < b.id) return Ordering.Less;
  if (a.id > b.id) return Ordering.Greater;
  return Ordering.Equal;
}

function setupBinarySearch<T>(
  arr: Array<T>,
  comperator: BoundComparator<T>
): () => void {
  return () => {
    binarySearchBy<T>(comperator)(arr);
  };
}

function setupLinearSearch<T>(
  arr: Array<T>,
  comperator: (v: T) => boolean
): () => void {
  return () => {
    arr.find(comperator);
  };
}

function generateRandomSortedArray(len: number): Array<HasId> {
  return Array(len)
    .fill(1)
    .map((v, i) => ({ id: Math.floor(Math.random() * 10) * (i + v) }))
    .sort((a, b) => {
      if (a.id < b.id) return Ordering.Less;
      if (a.id > b.id) return Ordering.Greater;
      return Ordering.Equal;
    });
}

function generateRandomLookUpValue(len: number): number {
  return Math.floor(Math.random() * len);
}

function generateDataSetup(len: number): [Array<HasId>, number] {
  const arr = generateRandomSortedArray(len);
  return [arr, arr[generateRandomLookUpValue(len)].id];
}

function generateSearchSetup(arr: Array<HasId>, lookUpValue: number) {
  return {
    binarySearch: setupBinarySearch<HasId>(
      arr,
      getIsEqualIdComperator(lookUpValue)
    ),
    linearSearch: setupLinearSearch<HasId>(arr, isEqualIdFactory(lookUpValue)),
  };
}

const [TINY_ARRAY, TINY_LOOK_UP_VALUE] = generateDataSetup(10);
const [SMALL_ARRAY, SMALL_LOOK_UP_VALUE] = generateDataSetup(100);
const [MEDIUM_ARRAY, MEDIUM_LOOK_UP_VALUE] = generateDataSetup(1_000);
const [LARGE_ARRAY, LARGE_LOOK_UP_VALUE] = generateDataSetup(100_000);
const [XLARGE_ARRAY, XLARGE_LOOK_UP_VALUE] = generateDataSetup(10_000_00);

const TINY = generateSearchSetup(TINY_ARRAY, TINY_LOOK_UP_VALUE);
const SMALL = generateSearchSetup(SMALL_ARRAY, SMALL_LOOK_UP_VALUE);
const MEDIUM = generateSearchSetup(MEDIUM_ARRAY, MEDIUM_LOOK_UP_VALUE);
const LARGE = generateSearchSetup(LARGE_ARRAY, LARGE_LOOK_UP_VALUE);
const XLARGE = generateSearchSetup(XLARGE_ARRAY, XLARGE_LOOK_UP_VALUE);
