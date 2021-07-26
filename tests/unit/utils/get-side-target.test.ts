import { getSideOrigin } from '../../../src/utils';
import { Axes, Side } from '../../../src/types'

test('getSideTarget util', () => {
 
  expect(getSideOrigin(Axes.X)).toEqual(Side.Left);
  expect(getSideOrigin(Axes.Y)).toEqual(Side.Top);

});