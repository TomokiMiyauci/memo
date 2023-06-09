import "./polyfill.ts";
import {
  assert,
  assertEquals,
  assertSpyCalls,
  describe,
  it,
  spy,
} from "./_dev_deps.ts";

describe("polyfill", () => {
  it("should has prototype memo", () => {
    assert(Function.prototype.memo);
  });

  it("should return memoized function", () => {
    function test(a: number) {
      return a;
    }
    const $test = test.memo();

    assertEquals($test.name, "memoized test");
    assertEquals($test.length, 1);
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
