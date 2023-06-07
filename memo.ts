// Copyright 2023-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

// deno-lint-ignore-file ban-types

import { compositeKey } from "./composite_key.ts";

export function memo<T, Args extends unknown[], R>(
  fn: (this: T, ...args: Args) => R,
  cache: MapLike<object, R> = new WeakMap<object, R>(),
  /** Filter arguments for cache keys. */
  keys?: (args: Args) => unknown[],
): (this: T, ...args: Args) => R {
  return function memoized(this: T, ...args: Args): R {
    const key = compositeKey(fn, this, new.target, ...keys ? keys(args) : args);

    if (cache.has(key)) return cache.get(key)!;

    const value = fn.apply(this, args);

    cache.set(key, value);

    return value;
  };
}

export interface MapLike<K, V> {
  get(key: K): V | undefined;

  has(key: K): boolean;

  /** Adds a new element with a specified key and value. */
  set(key: K, value: V): void;
}
