// Copyright © 2023 Tomoki Miyauchi. All rights reserved. MIT license.

import { memo } from "../src/memo.ts";
import { describe, it } from "@std/testing/bdd";
import { assertSpyCalls, spy } from "@std/testing/mock";
import { assert, assertEquals } from "@std/assert";

describe("memo", () => {
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

    const keying = spy((_: unknown, [a]) => [a.value]);
    const $test = memo(test, undefined, keying);

    $test({ value: 0 });
    $test({ value: 0 });
    $test({ value: 1 });
    $test({ value: 1 });

    assertSpyCalls(test, 2);
  });

  it("should contain this in keying", () => {
    const test = spy(function (this: { a: string }, a: { value: number }) {
      return this.a + a.value;
    });

    const $test = memo(test, undefined);

    $test.call({ a: "a" }, { value: 0 });
    $test.call({ a: "a" }, { value: 0 });
    $test.call({ a: "b" }, { value: 1 });
    $test.call({ a: "b" }, { value: 1 });

    assertSpyCalls(test, 4);
  });

  it("should override keying with this", () => {
    const test = spy(function (this: { a: string }, a: { value: number }) {
      return this.a + a.value;
    });

    const $test = memo(test, undefined, (thisArg, args) => {
      return [thisArg.a, args[0].value];
    });

    $test.call({ a: "a" }, { value: 0 });
    $test.call({ a: "a" }, { value: 0 });
    $test.call({ a: "b" }, { value: 1 });
    $test.call({ a: "b" }, { value: 1 });

    assertSpyCalls(test, 2);
  });

  it("should memoize with this context", () => {
    interface Context {
      x: string;
    }
    function f(this: Context, arg: number) {
      return this.x + arg;
    }
    const $f = memo(spy(f));

    const t1: Context = { x: "a" };
    const t2: Context = { x: "b" };

    assertEquals($f.call(t1, 0), "a0");
    assertEquals($f.call(t1, 1), "a1");
    assertEquals($f.call(t2, 0), "b0");
    assertEquals($f.call(t2, 1), "b1");

    assertSpyCalls($f, 4);

    $f.call(t1, 0);
    $f.call(t1, 1);
    $f.call(t2, 0);
    $f.call(t2, 1);

    assertSpyCalls($f, 4);
  });

  it("should memoize URL constructor", () => {
    const url = "https://test.test";

    assert(new URL(url) !== new URL(url));

    const $URL = memo(URL);

    assert(new $URL(url) === new $URL(url));
  });

  it("should customize keying for constructor", () => {
    const url = "https://test.test";

    assert(new URL(url) !== new URL(url));

    const $URL = memo(
      URL,
      undefined,
      (
        _,
        [url, base],
        newTarget,
      ) => [url.toString(), base?.toString(), newTarget],
    );

    assert(new $URL(new URL(url)) === new $URL(new URL(url)));
  });

  it("should memoize Error constructor", () => {
    const $Error = memo(Error);
    const options = {};

    assert(new Error() !== new Error());

    assert(new $Error() === new $Error());
    assert(new $Error("a") === new $Error("a"));
    assert(new $Error("a", options) === new $Error("a", options));

    assert(new $Error("") !== new $Error());
    assert(new $Error("a") !== new $Error("b"));
    assert(new $Error() !== $Error());
    assert(new $Error("a") !== $Error("a"));
  });

  it("should customize keying for constructor", () => {
    const $Error = memo(Error, undefined, () => []);
    const options = {};

    assert(new Error() !== new Error());

    assert(new $Error() === new $Error());
    assert(new $Error("a") === new $Error("a"));
    assert(new $Error("a", options) === new $Error("a", options));
    assert(new $Error("") === new $Error());
    assert(new $Error("a") === new $Error("b"));
  });
});
