import { applyType, fc, isNumber } from "../_test_utils/mod.ts";

fc.configureGlobal({
  numRuns: 10000,
  seed: 98761234,
});

const isNumberApplied = applyType("number");

Deno.bench({
  name: "Partially Applied - Integers",
  group: "Bound Predicates - Integers",
  fn: () => {
    fc.check(fc.property(fc.integer(), isNumberApplied));
  },
});

Deno.bench({
  name: "Bound - Integers",
  group: "Bound Predicates - Integers",
  fn: () => {
    fc.check(fc.property(fc.integer(), isNumber));
  },
});

Deno.bench({
  name: "Bound - Mixed Primitives",
  group: "Bound Predicates - Mixed Primitives",
  fn: () => {
    fc.check(
      fc.property(
        fc.oneof(fc.string(), fc.integer(), fc.bigInt(), fc.boolean()),
        isNumber,
      ),
    );
  },
});

Deno.bench({
  name: "Partially Applied - Mixed Primitives",
  group: "Bound Predicates - Mixed Primitives",
  fn: () => {
    fc.check(
      fc.property(
        fc.oneof(fc.string(), fc.integer(), fc.bigInt(), fc.boolean()),
        isNumberApplied,
      ),
    );
  },
});
