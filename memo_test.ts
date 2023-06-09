// Copyright 2023-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import { memo } from "./memo.ts";
import {
  assertEquals,
  assertSpyCalls,
  describe,
  it,
  spy,
} from "./_dev_deps.ts";

describe("memo", () => {
  it("should return function that length property is same and name property is memoized + target fn name", () => {
    function nullary() {}
    const $nullary = memo(nullary);

    assertEquals($nullary.name, "memoized nullary");
    assertEquals($nullary.length, 0);

    function ternary(_: string, __: number, ___: boolean) {}
    const $ternary = memo(ternary);

    assertEquals($ternary.name, "memoized ternary");
    assertEquals($ternary.length, 3);
  });

  it("should call once if nullary", () => {
    const test = spy(() => {});

    const $test = memo(test);

    $test();
    $test();
    $test();

    assertSpyCalls(test, 1);
  });

  it("should call once if arguments is same", () => {
    const test = spy((n: number) => n);
    const $test = memo(test);

    assertEquals($test(0), 0);
    assertEquals($test(0), 0);
    assertEquals($test(0), 0);

    assertSpyCalls(test, 1);
  });

  it("should call if the arguments is not same", () => {
    const test = spy((n: number) => n);
    const $test = memo(test);

    assertEquals($test(0), 0);
    assertEquals($test(1), 1);
    assertEquals($test(2), 2);
    assertEquals($test(0), 0);
    assertEquals($test(1), 1);
    assertEquals($test(2), 2);

    assertSpyCalls(test, 3);
  });

  it("should call if the arguments combination is unique", () => {
    const test = spy((a: number, b: number) => a + b);
    const $test = memo(test);

    assertEquals($test(0, 1), 1);
    assertEquals($test(0, 1), 1);

    assertEquals($test(1, 0), 1);
    assertEquals($test(1, 0), 1);

    assertSpyCalls(test, 2);
  });

  it("should override cache", () => {
    const cache = new Map();

    function test(a: number, b: number) {
      return a + b;
    }

    const $test = memo(test, cache);

    $test(0, 1);
    $test(0, 1);
    $test(1, 0);
    $test(1, 0);
    $test(1, 1);
    $test(1, 1);

    assertEquals(cache.size, 3);
    assertEquals([...cache.values()], [1, 1, 2]);
  });

  it("should override keying", () => {
    const test = spy((a: { value: number }) => a.value);

    const keying = spy(([a]) => [a.value]);
    const $test = memo(test, undefined, keying);

    $test({ value: 0 });
    $test({ value: 0 });
    $test({ value: 1 });
    $test({ value: 1 });

    assertSpyCalls(test, 2);
  });
});
