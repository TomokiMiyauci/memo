// Copyright 2023-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import { memo } from "./memo.ts";
import { assertEquals, describe, it } from "./_dev_deps.ts";

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
});
