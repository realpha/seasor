export type Predicate<L, R = L> = (lhs: L, rhs: R) => boolean;
export type BoundPredicate<L> = (lhs: L) => boolean;
