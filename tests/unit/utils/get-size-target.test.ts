import { getSizeTarget } from '../../../src/utils';
import { Axes, Size } from '../../../src/types'

test('getSizeTarget util', () => {
 
  expect(getSizeTarget(Axes.X)).toEqual(Size.Width);
  expect(getSizeTarget(Axes.Y)).toEqual(Size.Height);

});