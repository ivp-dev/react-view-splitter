import { getActiveBlocks, getLayout } from '../../../src/utils';

test('getActiveBlock util', () => {
  const panes = [0, 1, 2, 3, 4, 5];
  const pair = [2, 3];

  const responsiveFalseLayout = getLayout(panes, pair, false);
  const responsiveTrueLayout = getLayout(panes, pair, true);

  expect(getActiveBlocks(responsiveFalseLayout, false)).toEqual([[2], [3]]);
  expect(getActiveBlocks(responsiveTrueLayout, true)).toEqual([[0, 1, 2], [3, 4, 5]]);
});