import {
  BoundComparator,
  BoundPredicate,
  Comparator,
  Ordering,
  Predicate,
} from "./types/mod.ts";
import { binarySearchBy } from "./search/binary_search.ts";

export { binarySearchBy, Ordering };
export type { BoundComparator, BoundPredicate, Comparator, Predicate };

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const len = parseInt(Deno.args[0], 10);
  const arr: Array<{ id: number }> = Array(len)
    .fill(1)
    .map((v, i) => ({ id: Math.floor(Math.random() * 10) * (i + v) }))
    /*.filter(({ id }) => id !== 74);*/
    .sort((a, b) => {
      if (a.id < b.id) return Ordering.Less;
      if (a.id > b.id) return Ordering.Greater;
      return Ordering.Equal;
    });

  const LOOK_FOR = Math.floor(Math.random() * arr.length);
  console.log("Looking for ", LOOK_FOR);

  const bsArray = arr.slice();
  const startBS = new Date().valueOf();
  const binarySearch = binarySearchBy<{ id: number }>(({ id }) => {
    if (id < LOOK_FOR) return Ordering.Less;
    if (id > LOOK_FOR) return Ordering.Greater;
    return Ordering.Equal;
  });
  const result1 = binarySearch(bsArray);
  const endBS = new Date().valueOf();
  console.log("BS: " + (endBS - startBS) + "ms", result1);

  const lsArray = arr.slice();
  const startLS = new Date().valueOf();
  const result2 = lsArray.find(({ id }) => id === LOOK_FOR);
  const endLS = new Date().valueOf();
  console.log("LS: " + (endLS - startLS) + "ms", result2);

  //console.log(arr.slice(72, 76));
  //console.log(arr.length);
  //const remediated = insertAt(arr, result1[1], { id: 74 });
  //console.log(remediated.slice(72, 76));
  //console.log(remediated.length);
}
