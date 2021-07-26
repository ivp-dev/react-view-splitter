import getCalcBarSize from '../../../src/utils/get-calc-bar-size';

test('getRelativeBarSize util', () => {
  const panesCount = 6;
  const barSize = 5; //px
  const result = barSize * (panesCount - 1) / panesCount;
  expect(getCalcBarSize(panesCount, 5)).toEqual(result);
});