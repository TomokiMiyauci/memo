// From [proposal-richer-keys, compositeKey, test](https://github.com/tc39/proposal-richer-keys/blob/master/compositeKey/test.js)

import { compositeKey, compositeSymbol } from "./composite_key.ts";
import {
  assert,
  assertEquals,
  assertFalse,
  assertThrows,
  describe,
  it,
} from "./_dev_deps.ts";

describe("compositeKey", () => {
  it("should pass all suites", () => {
    suite(compositeKey, "object");
  });

  it("should throw error", () => {
    assertThrows(() => compositeKey(null));
    assertThrows(() => compositeKey(1));
    assertThrows(() => compositeKey(true));
    assertThrows(() => compositeKey(""));
    assertThrows(() => compositeKey(Symbol()));
    assertThrows(() => compositeKey(undefined));

    for (const _ of [null, 1, true, "", Symbol()]) {
      assertThrows(() => compositeKey(null, _));
      assertThrows(() => compositeKey(Symbol(), _));
      assertThrows(() => compositeKey(_, 1));
      assertThrows(() => compositeKey(_, undefined));
      assertThrows(() => compositeKey(_, true, _));
      assertThrows(() => compositeKey(_, "", _));
    }
  });
});

describe("compositeSymbol", () => {
  it("should pass all suites", () => {
    suite(compositeSymbol, "symbol");

    assertEquals(typeof compositeSymbol(1), "symbol");
    assertEquals(compositeSymbol("x"), Symbol.for("x"));
  });
});

// deno-lint-ignore ban-types
const suite = (fn: Function, type: "object" | "symbol") => {
  const a = {};
  const b: unknown[] = [];

  assert(fn(a) === fn(a));
  assert(fn(b) === fn(b));
  assert(fn(a, b) === fn(a, b));
  assert(fn(b, a) === fn(b, a));
  assert(fn(a, 0) === fn(a, 0));
  assertEquals(typeof fn(a), type);

  assertFalse(fn(a, b) === fn(b, a));
  assertFalse(fn(a, 0) === fn(a, 1));
  assertFalse(fn(a, 0) === fn(0, a));
  assertFalse(fn(a, 0) === fn(1, a));
};
