import { BoundComparator, Ordering } from "../types/mod.ts";

export type SearchResult<T> = [found: T | undefined, at: number];

export function binarySearch<T>(comp: BoundComparator<T>) {
  return (arr: ReadonlyArray<T>): SearchResult<T> => {
    const defaultResult = undefined;
    const defaultIndex = 0;

    let head = defaultIndex;
    let tail = arr.length - 1;
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
