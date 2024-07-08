# memo

[![JSR](https://jsr.io/badges/@miyauci/memo)](https://jsr.io/@miyauci/memo)
[![codecov](https://codecov.io/gh/TomokiMiyauci/memo/graph/badge.svg?token=0P175I3F06)](https://codecov.io/gh/TomokiMiyauci/memo)
[![GitHub](https://img.shields.io/github/license/TomokiMiyauci/memo)](https://github.com/TomokiMiyauci/memo/blob/main/LICENSE)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg)](https://github.com/RichardLitt/standard-readme)

Memoization tools, TC39
[proposal-function-memo](https://github.com/tc39/proposal-function-memo)
implementation.

## Table of Contents <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
  - [Custom cache](#custom-cache)
  - [Keying](#keying)
  - [Construction caching](#construction-caching)
    - [Keying for construction](#keying-for-construction)
  - [Polyfill](#polyfill)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

## Install

deno:

```bash
deno add @miyauci/memo
```

node:

```bash
npx jsr add @miyauci/memo
```

## Usage

Returns the proxy function whose call is monitored. It calls at most once for
each given arguments.

```ts
import { memo } from "@miyauci/memo";

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
import { memo } from "@miyauci/memo";

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
import { type MapLike, memo } from "@miyauci/memo";

declare const lruCache: MapLike<object, unknown>;
declare const fn: () => unknown;

const $fn = memo(fn, lruCache);
```

See TC39
[proposal-policy-map-set](https://github.com/tc39/proposal-policy-map-set) and
its [implementation](https://github.com/TomokiMiyauci/cache-mapset).

### Keying

Cache keys are represented by
[composite keys](https://github.com/tc39/proposal-richer-keys/tree/master/compositeKey).

The composite keys are passed several elements for the key, called components.

The default components are as follows:

- this arg(`this`)
- args

Also, composite key employs the
[same-value-zero](https://tc39.es/ecma262/#sec-samevaluezero) algorithm to
verify the equivalence of each component.

You can modify the component through the `keying` callback.

```ts
import { type MapLike, memo } from "@miyauci/memo";

declare const respond: (request: Request) => Response;

const $respond = memo(
  respond,
  undefined,
  (thisArg, [request]) => [request.method, request.url.toString()],
);
```

### Construction caching

Caching of construction is also supported. Calls to constructor functions with
the `new` operator are cacheable based on their arguments.

```ts
import { memo } from "@miyauci/memo";
import { assert } from "@std/assert";

declare const url: string;

assert(new URL(url) !== new URL(url));

const $URL = memo(URL);

assert(new $URL(url) === new $URL(url));
```

#### Keying for construction

Unlike in the case of functions, the following components are used as keys by
default in the construction:

- args
- newTarget(`new.target`)

You can specify `keying` as in the function.

```ts
import { type MapLike, memo } from "@miyauci/memo";

const $URL = memo(
  URL,
  undefined,
  (
    thisArg,
    [url, base],
    newTarget,
  ) => [url.toString(), base?.toString(), newTarget],
);
```

### Polyfill

Polyfill affects the global object. You must be very careful when using it.

```ts
import "@miyauci/memo/polyfill";

const fib = ((num: number): number => {
  if (num < 2) return num;

  return fib(num - 1) + fib(num - 2);
}).memo();

fib(1000);
```

## API

See [jsr doc](https://jsr.io/@miyauci/memo) for all APIs.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

[MIT](LICENSE) © 2023 Tomoki Miyauchi
