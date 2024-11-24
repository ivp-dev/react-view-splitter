import { getSideOrigin } from "@/utils";

test("getSideTarget util", () => {
  expect(getSideOrigin("x")).toEqual("left");
  expect(getSideOrigin("y")).toEqual("top");
});
