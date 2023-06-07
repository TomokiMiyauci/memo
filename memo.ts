// Copyright 2023-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

// deno-lint-ignore-file ban-types

import { createCompositeKey, Node } from "./composite_key.ts";

export function memo<T, Args extends unknown[], R>(
  fn: (this: T, ...args: Args) => R,
  cache: Entity<object, R> = new WeakMap<object, R>(),
  /** Filter arguments for cache keys. */
  keys?: (args: Args) => unknown[],
): (this: T, ...args: Args) => R {
  const node = new Node();
  const compositeKey = createCompositeKey(node);

  return function memoized(this: T, ...args: Args): R {
    const key = compositeKey(this, new.target, ...keys ? keys(args) : args);

    if (cache.has(key)) return cache.get(key)!;

    const value = fn.apply(this, args);

    cache.set(key, value);

    return value;
  };
}

export interface Entity<K, V> {
  get(key: K): V | undefined;

  has(key: K): boolean;

  /** Adds a new element with a specified key and value. */
  set(key: K, value: V): void;
}
