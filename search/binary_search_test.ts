import {
  fc,
  generateArray,
  generateEntity,
  HasId,
  isEqualIdFactory,
  idComparatorFactory,
  ascendingById,
} from "../_test_utils/mod.ts";
import { binarySearch } from "./mod.ts";

/*
 * TODO: Split into 3 distinc property tests
 */
Deno.test({
  name: "Binary Search",
  fn: () => {
    fc.assert(
      fc.property(
        generateArray(),
        generateEntity(),
        (arr: Array<HasId>, lookUpValue: HasId) => {
          arr.sort(ascendingById);

          const isEqualId = isEqualIdFactory(lookUpValue);
          const idComparator = idComparatorFactory(lookUpValue);

          const indexFromLinear = arr.findIndex(isEqualId);
          const [found, at] = binarySearch<HasId>(idComparator)(arr);

          if (arr.length === 0) return !found && at === 0;
          if (!found) return indexFromLinear === -1;
          return found.id === arr[indexFromLinear].id && found === arr[at];
        }
      ),
      { numRuns: 1000 }
    );
  },
});
