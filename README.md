# memo

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/memoization)
[![deno doc](https://doc.deno.land/badge.svg)](https://deno.land/x/memoization?doc)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/TomokiMiyauci/memo)](https://github.com/TomokiMiyauci/memo/releases)
[![codecov](https://codecov.io/github/TomokiMiyauci/memo/branch/main/graph/badge.svg)](https://codecov.io/gh/TomokiMiyauci/memo)
[![License](https://img.shields.io/github/license/TomokiMiyauci/memo)](LICENSE)

[![test](https://github.com/TomokiMiyauci/memo/actions/workflows/test.yaml/badge.svg)](https://github.com/TomokiMiyauci/memo/actions/workflows/test.yaml)
[![NPM](https://nodei.co/npm/@miyauci/memo.png?mini=true)](https://nodei.co/npm/@miyauci/memo/)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg)](https://github.com/RichardLitt/standard-readme)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

Memoization tools, TC39
[proposal-function-memo](https://github.com/tc39/proposal-function-memo)
implementation.

## Install

deno.land:

```ts
import * as mod from "https://deno.land/x/memoization@$VERSION/mod.ts";
```

npm:

```bash
npm i @miyauci/memo
```

## Usage

Returns the proxy function whose call is monitored. It calls at most once for
each given arguments.

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

### Custom cache

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
declare const fn: () => unknown;

const $fn = memo(fn, lruCache);
```

### Keying

Cache keys are `this` and arguments represented by
[composite keys](https://github.com/tc39/proposal-richer-keys/tree/master/compositeKey).

The equivalence of composite key is the
[Same-value-zero](https://tc39.es/ecma262/#sec-samevaluezero) algorithm. By
default, all arguments are used for the cache key.

Specify `keying` to change the representation of arguments used for cache keys.

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

### Polyfill

Polyfill affects the global object. You must be very careful when using it.

```ts
import "https://deno.land/x/memoization@$VERSION/polyfill.ts";

const fib = ((num: number): number => {
  if (num < 2) return num;

  return fib(num - 1) + fib(num - 2);
}).memo();

fib(1000);
```

## API

See [deno doc](https://deno.land/x/memoization?doc) for all APIs.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

[MIT](LICENSE) © 2023 Tomoki Miyauchi
