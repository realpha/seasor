import {
  fc,
  generateArray,
  HasId,
  isEqualIdFactory,
  orderByIdComperator,
} from "../_test_utils/mod.ts";
import { binarySearchBy } from "./mod.ts";
import { Ordering } from "../types/ordering.ts";

function getComparator(n: number) {
  return ({ id }: HasId) => {
    if (id < n) return Ordering.Less;
    if (id > n) return Ordering.Greater;
    return Ordering.Equal;
  };
}

/*
 * TODO: Split into 3 distinc property tests
 */
Deno.test({
  name: "Binary Search",
  fn: () => {
    fc.assert(
      fc.property(
        generateArray(),
        fc.integer(),
        (arr: Array<HasId>, lookUpValue: number) => {
          arr.sort(orderByIdComperator);

          const isEqualId = isEqualIdFactory(lookUpValue);
          const indexFromLinear = arr.findIndex(isEqualId);

          const [found, index] = binarySearchBy<HasId>(
            getComparator(lookUpValue),
          )(arr);

          if (arr.length === 0) return !found && index === 0;
          if (!found) return indexFromLinear === -1;
          return found.id >= arr[index].id && index === indexFromLinear;
        },
      ),
      { numRuns: 1000 },
    );
  },
});
