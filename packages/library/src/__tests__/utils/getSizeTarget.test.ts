import { getSizeTarget } from "@/utils";

test("getSizeTarget util", () => {
  expect(getSizeTarget("x")).toEqual("width");
  expect(getSizeTarget("y")).toEqual("height");
});
