// Copyright © 2023 Tomoki Miyauchi. All rights reserved. MIT license.

import "../src/polyfill.ts";
import { describe, it } from "@std/testing/bdd";
import { assertSpyCalls, spy } from "@std/testing/mock";
import { assert } from "@std/assert";

describe("polyfill", () => {
  it("should has prototype memo", () => {
    assert(Function.prototype.memo);
  });

  it("should call once", () => {
    const test = spy((a: number) => a);
    const $test = test.memo();

    $test(0);
    $test(0);
    $test(1);
    $test(1);

    assertSpyCalls(test, 2);
  });
});
