// Copyright © 2023 Tomoki Miyauchi. All rights reserved. MIT license.

import "./polyfill.ts";
import { assert, assertSpyCalls, describe, it, spy } from "./_dev_deps.ts";

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
