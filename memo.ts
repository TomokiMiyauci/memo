// Copyright 2023-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

// deno-lint-ignore-file ban-types

import { compositeKey } from "./deps.ts";

/** Create a new function that calls the original function at most once for each given arguments.
 * @example
 * ```ts
 * import { memo } from "https://deno.land/x/memoization@$VERSION/memo.ts";
 *
 * function f(x: number): number {
 *  console.log(x);
 *  return x * 2;
 * }
 *
 * const fMemo = memo(f);
 * fMemo(3); // Prints 3 and returns 6.
 * fMemo(3); // Does not print anything. Returns 6.
 * fMemo(2); // Prints 2 and returns 4.
 * fMemo(2); // Does not print anything. Returns 4.
 * fMemo(3); // Does not print anything. Returns 6.
 * ```
 *
 * Either version would work with recursive functions:
 *
 * @example
 * ```ts
 * import { memo } from "https://deno.land/x/memoization@$VERSION/memo.ts";
 *
 * const fib = memo((num: number): number => {
 *  if (num < 2) return num;
 *
 *  return fib(num - 1) + fib(num - 2);
 * });
 *
 * fib(1000);
 * ```
 */
export function memo<T, A extends unknown[], R>(
  fn: T & ((...args: A) => R),
  cache: MapLike<object, R> = new WeakMap<object, R>(),
  /** Keying for cache key. */
  keying?: (args: A) => unknown[],
): T {
  const proxy = new Proxy(fn, {
    apply(target, thisArg, args: A) {
      const key = compositeKey(target, ...keying ? keying(args) : args);

      if (cache.has(key)) return cache.get(key)!;

      const value = target.apply(thisArg, args);

      cache.set(key, value);

      return value;
    },
  });

  return proxy;
}

/** {@link Map} like object. */
export interface MapLike<K, V> {
  /** Returns a specified element. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it. */
  get(key: K): V | undefined;

  /** Whether an element with the specified key exists or not. */
  has(key: K): boolean;

  /** Adds a new element with a specified key and value. */
  set(key: K, value: V): void;
}
