// Copyright 2023-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

// deno-lint-ignore-file ban-types

import { compositeKey } from "./composite_key.ts";
import { setFunctionLength, setFunctionName } from "./utils.ts";

export function memo<A extends unknown[], R>(
  fn: (...args: A) => R,
  cache: MapLike<object, R> = new WeakMap<object, R>(),
  /** Filter arguments for cache keys. */
  keys?: (args: A) => unknown[],
): (...args: A) => R {
  function memoized(...args: A): R {
    const key = compositeKey(fn, new.target, ...keys ? keys(args) : args);

    if (cache.has(key)) return cache.get(key)!;

    const value = fn.apply(null, args);

    cache.set(key, value);

    return value;
  }

  setFunctionLength(memoized, fn.length);
  setFunctionName(memoized, fn.name, "memoized");

  return memoized;
}

export interface MapLike<K, V> {
  get(key: K): V | undefined;

  has(key: K): boolean;

  /** Adds a new element with a specified key and value. */
  set(key: K, value: V): void;
}
