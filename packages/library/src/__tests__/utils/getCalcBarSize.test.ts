import getCalcBarSize from "@/utils/getCalcBarSize";

test("getRelativeBarSize util", () => {
  const panesCount = 6;
  const barSize = 5; //px
  const result = (barSize * (panesCount - 1)) / panesCount;
  expect(getCalcBarSize(panesCount, 5)).toEqual(result);
});
