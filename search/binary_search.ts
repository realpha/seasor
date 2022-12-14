import { BoundComparator, Ordering } from "../types/mod.ts";
export function binarySearchBy<T>(comp: BoundComparator<T>) {
  return (
    arr: ReadonlyArray<T>,
    from?: number,
    to?: number,
  ): [item: T | undefined, index: number] => {
    const defaultResult = undefined;
    const defaultIndex = 0;

    let head = from ?? defaultIndex;
    let tail = to ?? arr.length - 1;
    let cursor: number;

    if (arr.length === 0) return [defaultResult, defaultIndex];

    while (head <= tail) {
      cursor = head + ((tail - head) >>> 1);
      const indicator = comp(arr[cursor]);
      if (indicator === Ordering.Less) {
        head = cursor + 1;
      } else if (indicator === Ordering.Greater) {
        tail = cursor - 1;
      } else {
        return [arr[cursor], cursor];
      }
    }

    return [defaultResult, head];
  };
}

//export function binarySearch();
