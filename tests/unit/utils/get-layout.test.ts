import { getLayout } from '../../../src/utils';

test('getLayout util', () => {
  const panes = [0, 1, 2, 3, 4, 5];
  const pair = [2, 3];

  expect(getLayout(panes, pair, false)).toEqual([0, 1, [2], [3], 4, 5]);
  expect(getLayout(panes, pair, true)).toEqual([[0, 1, 2], [3, 4, 5]]);
});