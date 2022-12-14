import { Ordering } from "./ordering.ts";

export type Comparator<T> = (lhs: T, rhs: T) => Ordering;
export type BoundComparator<T> = (lhs: T) => Ordering;
