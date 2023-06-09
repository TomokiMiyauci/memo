# memo

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/memoization)
[![deno doc](https://doc.deno.land/badge.svg)](https://deno.land/x/memoization/mod.ts)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/TomokiMiyauci/memoization)](https://github.com/TomokiMiyauci/memoization/releases)
[![codecov](https://codecov.io/github/TomokiMiyauci/memoization/branch/main/graph/badge.svg)](https://codecov.io/gh/TomokiMiyauci/memoization)
[![GitHub](https://img.shields.io/github/license/TomokiMiyauci/memoization)](https://github.com/TomokiMiyauci/memoization/blob/main/LICENSE)

[![test](https://github.com/TomokiMiyauci/memoization/actions/workflows/test.yaml/badge.svg)](https://github.com/TomokiMiyauci/memoization/actions/workflows/test.yaml)
[![NPM](https://nodei.co/npm/@miyauci/memo.png?mini=true)](https://nodei.co/npm/@miyauci/memo/)

Memoization tools, TC39
[proposal-function-memo](https://github.com/tc39/proposal-function-memo)
implementation.

## Entrypoint

This project provides ponyfill and polyfill.

Polyfill has a side effect, so its endpoints are isolated.

The entrypoint of each are as follows:

| Type     | Entrypoint    |
| -------- | ------------- |
| Ponyfill | `mod.ts`      |
| Polyfill | `polyfill.ts` |

## Memoize

`memo` would create a new function that calls the original function at most once
for each given arguments.

```ts
import { memo } from "https://deno.land/x/memoization@$VERSION/mod.ts";

function f(x: number): number {
  console.log(x);
  return x * 2;
}

const fMemo = memo(f);
fMemo(3); // Prints 3 and returns 6.
fMemo(3); // Does not print anything. Returns 6.
fMemo(2); // Prints 2 and returns 4.
fMemo(2); // Does not print anything. Returns 4.
fMemo(3); // Does not print anything. Returns 6.
```

Either version would work with recursive functions:

```ts
import { memo } from "https://deno.land/x/memoization@$VERSION/mod.ts";

const fib = memo((num: number): number => {
  if (num < 2) return num;

  return fib(num - 1) + fib(num - 2);
});

fib(1000);
```

## Custom cache

To control the cache, specify `cache`.

The cache must implement the following interfaces:

```ts
interface MapLike<K, V> {
  get(key: K): V | undefined;

  has(key: K): boolean;

  set(key: K, value: V): void;
}
```

By default, an unlimited cache is used by `WeakMap`.

```ts
import {
  type MapLike,
  memo,
} from "https://deno.land/x/memoization@$VERSION/mod.ts";

declare const lruCache: MapLike<object, unknown>;
declare const fn: () => void;

const $fn = memo(fn, lruCache);
```

## Keying

Cache keys are function references, `new.target`, and arguments represented by
[composite keys](https://github.com/tc39/proposal-richer-keys/tree/master/compositeKey).

The equivalence of composite key is the
[Same-value-zero](https://tc39.es/ecma262/#sec-samevaluezero) algorithm. By
default, all arguments are used for the cache key.

Specify `keys` to change the representation of arguments used for cache keys.

```ts
import {
  type MapLike,
  memo,
} from "https://deno.land/x/memoization@$VERSION/mod.ts";

declare const respond: (request: Request) => Response;

const $respond = memo(
  respond,
  undefined,
  ([request]) => [request.method, request.url],
);
```

## Polyfill

Polyfill affects the global object. You must be very careful when using it.

```ts
import "https://deno.land/x/memoization@$VERSION/polyfill.ts";

const fib = ((num: number): number => {
  if (num < 2) return num;

  return fib(num - 1) + fib(num - 2);
}).memo();

fib(1000);
```

## License

Copyright © 2023-present [Tomoki Miyauchi](https://github.com/TomokiMiyauci).

Released under the [MIT](./LICENSE) license
