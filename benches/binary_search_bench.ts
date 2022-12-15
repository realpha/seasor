import {
  binarySearchBy,
  Ordering,
  BoundComparator,
  Comparator,
  BoundPredicate,
} from "../mod.ts";
import { BinarySearchTree } from "../_test_utils/deps.ts";
import { orderByIdComperator } from "../_test_utils/mod.ts";

interface HasId {
  id: number;
}

function getSimpelComperator(n: number) {
  return ({ id }: HasId) => id === n;
}

function getComperator(n: number) {
  return ({ id }: HasId) => {
    if (id < n) return Ordering.Less;
    if (id > n) return Ordering.Greater;
    return Ordering.Equal;
  };
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
  predicate: BoundPredicate<T>
): () => void {
  return () => {
    arr.find(predicate);
  };
}

function setupBinaryTreeSearch<T>(
  arr: Array<T>,
  comparator: Comparator<T>,
  value: T
): () => void {
  const tree = BinarySearchTree.from<T>(arr, { compare: comparator });
  return () => {
    tree.find(value);
  };
}

function generateRandomSortedArray(len: number): Array<HasId> {
  return (
    Array(len)
      .fill(1)
      .map((v, i) => ({ id: Math.floor(Math.random() * 10) * (i + v) }))
      /*.filter(({ id }) => id !== 74);*/
      .sort(orderByIdComperator)
  );
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
    binarySearch: setupBinarySearch<HasId>(arr, getComperator(lookUpValue)),
    linearSearch: setupLinearSearch<HasId>(
      arr,
      getSimpelComperator(lookUpValue)
    ),
    treeSearch: setupBinaryTreeSearch<HasId>(arr, orderByIdComperator, {
      id: lookUpValue,
    }),
  };
}

const [TINY_ARRAY, TINY_LOOK_UP_VALUE] = generateDataSetup(10);
const [SMALL_ARRAY, SMALL_LOOK_UP_VALUE] = generateDataSetup(100);
const [SMEDIUM_ARRAY, SMEDIUM_LOOK_UP_VALUE] = generateDataSetup(1_000);
const [MEDIUM_ARRAY, MEDIUM_LOOK_UP_VALUE] = generateDataSetup(10_000);
const [LARGE_ARRAY, LARGE_LOOK_UP_VALUE] = generateDataSetup(100_000);
const [XLARGE_ARRAY, XLARGE_LOOK_UP_VALUE] = generateDataSetup(1_000_00);

const TINY = generateSearchSetup(TINY_ARRAY, TINY_LOOK_UP_VALUE);
const SMALL = generateSearchSetup(SMALL_ARRAY, SMALL_LOOK_UP_VALUE);
const SMEDIUM = generateSearchSetup(SMEDIUM_ARRAY, SMEDIUM_LOOK_UP_VALUE);
const MEDIUM = generateSearchSetup(MEDIUM_ARRAY, MEDIUM_LOOK_UP_VALUE);
const LARGE = generateSearchSetup(LARGE_ARRAY, LARGE_LOOK_UP_VALUE);
const XLARGE = generateSearchSetup(XLARGE_ARRAY, XLARGE_LOOK_UP_VALUE);

Deno.bench({
  name: "TINY(10) - LinearSearch",
  group: "TINY",
  fn: TINY.linearSearch,
});

Deno.bench({
  name: "TINY(10) - TreeSearch",
  group: "TINY",
  fn: TINY.treeSearch,
});

Deno.bench({
  name: "TINY(10) - BinarySearch",
  group: "TINY",
  baseline: true,
  fn: TINY.binarySearch,
});

Deno.bench({
  name: "SMALL(100) - LinearSearch",
  group: "SMALL",
  fn: SMALL.linearSearch,
});

Deno.bench({
  name: "SMALL(100) - TreeSearch",
  group: "SMALL",
  fn: SMALL.treeSearch,
});

Deno.bench({
  name: "SMALL(100) - BinarySearch",
  group: "SMALL",
  baseline: true,
  fn: SMALL.binarySearch,
});

Deno.bench({
  name: "SMEDIUM(1_000) - LinearSearch",
  group: "SMEDIUM",
  fn: SMEDIUM.linearSearch,
});

Deno.bench({
  name: "SMEDIUM(1_000) - TreeSearch",
  group: "SMEDIUM",
  fn: SMEDIUM.treeSearch,
});

Deno.bench({
  name: "SMEDIUM(1_000) - BinarySearch",
  group: "SMEDIUM",
  baseline: true,
  fn: SMEDIUM.binarySearch,
});

Deno.bench({
  name: "MEDIUM(10_000) - LinearSearch",
  group: "MEDIUM",
  fn: MEDIUM.linearSearch,
});

Deno.bench({
  name: "MEDIUM(10_000) - TreeSearch",
  group: "MEDIUM",
  fn: MEDIUM.treeSearch,
});

Deno.bench({
  name: "MEDIUM(10_000) - BinarySearch",
  group: "MEDIUM",
  baseline: true,
  fn: MEDIUM.binarySearch,
});

Deno.bench({
  name: "LARGE(100_000) - LinearSearch",
  group: "LARGE",
  fn: LARGE.linearSearch,
});

Deno.bench({
  name: "LARGE(100_000) - TreeSearch",
  group: "LARGE",
  fn: LARGE.treeSearch,
});

Deno.bench({
  name: "LARGE(100_000) - BinarySearch",
  group: "LARGE",
  baseline: true,
  fn: LARGE.binarySearch,
});

Deno.bench({
  name: "XLARGE(1_000_00) - LinearSearch",
  group: "XLARGE",
  fn: XLARGE.linearSearch,
});

Deno.bench({
  name: "XLARGE(1_000_00) - TreeSearch",
  group: "XLARGE",
  fn: XLARGE.treeSearch,
});

Deno.bench({
  name: "XLARGE(1_000_00) - BinarySearch",
  group: "XLARGE",
  baseline: true,
  fn: XLARGE.binarySearch,
});
