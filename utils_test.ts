// Copyright 2023-latest Tomoki Miyauchi. All rights reserved. MIT license.

import { setFunctionLength, setFunctionName } from "./utils.ts";
import { assertEquals, describe, it } from "./_dev_deps.ts";

describe("setFunctionLength", () => {
  it("should return mutated length property", () => {
    function test() {}

    const $test = setFunctionLength(test, 3);

    assertEquals($test.length, 3);
  });
});

describe("setFunctionName", () => {
  it("should return mutated name property", () => {
    function test() {}

    const $test = setFunctionName(test, test.name, "prefix");

    assertEquals($test.name, "prefix test");
  });
});
