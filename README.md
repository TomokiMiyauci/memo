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

Cache keys are represented by
[composite keys](https://github.com/tc39/proposal-richer-keys/tree/master/compositeKey).

The composite keys are passed several elements for the key, called components.

The components are as follows:

- target function
- this arg(`this`)
- new target(`new.target`)
- args

Of these, target function is used to identify a unique function. The target
function is not used to identify a unique function, since the composite key is a
global registry. For more information, see
[FAQ: What scope is the idempotentcy?](https://github.com/tc39/proposal-richer-keys/tree/master/compositeKey#what-scope-is-the-idempotentcy)

Also, composite key employs the
[same-value-zero](https://tc39.es/ecma262/#sec-samevaluezero) algorithm to
verify the equivalence of each component.

You can modify the args component through the `keying` callback.

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

Currently, only the args component can be modified. This is being discussed in
[#4 (comment)](https://github.com/tc39/proposal-function-memo/issues/4#issuecomment-1083552333)
and it is not clear how this arg and new target should be handled.

### Instantiation caching

Caching of instantiation is also supported. Calls to constructor functions with
the `new` operator are cacheable based on their arguments.

```ts
import { memo } from "https://deno.land/x/memoization@$VERSION/mod.ts";
import { assert } from "https://deno.land/std/testing/asserts.ts";

assert(new Error() !== new Error());

const $Error = memo(Error);

assert(new $Error() === new $Error());
assert($Error("test") === $Error("test"));

assert(new $Error() !== $Error());
assert(new $Error() !== new $Error("test"));
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
