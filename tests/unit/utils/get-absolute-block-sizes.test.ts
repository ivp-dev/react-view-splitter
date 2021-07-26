import getAbsoluteBlockSizes from '../../../src/utils/get-absolute-block-sizes';

test('getAbsoluteBlockSizes util', () => {
  const block = [0, 1, 2];

  const absPortSize = 1000; // px
  const absBarSize = 5; // px
  const minPaneSize = 5;  // %
  const panes = [0, 1, 2, 3, 4];
  const absPaneSize = absPortSize / panes.length;
  const rSizes = panes.map(() => absPaneSize / absPortSize * 100); //relative sizes
  const rMinSizes = panes.map(() => minPaneSize); // relative min sizes

  const result = getAbsoluteBlockSizes(absPortSize, block, panes, rSizes, rMinSizes, absBarSize);

  const resultSize = absPaneSize * block.length;
  const resultSizes = block.map(() => absPaneSize);
  const resultMinSize = (absPortSize * minPaneSize / 100) * block.length;
  const resultMinSizes = block.map(() => absPortSize * minPaneSize / 100);
  const resultAvailableSize = resultSize - resultMinSize;
  const resultAvailableSizes = block.map((i) => resultSizes[i] - resultMinSizes[i]);

  expect(result.size).toEqual(resultSize);
  expect(result.sizes).toEqual(resultSizes);
  expect(result.minSize).toEqual(resultMinSize);
  expect(result.minSizes).toEqual(resultMinSizes);
  expect(result.availableSize).toEqual(resultAvailableSize);
  expect(result.availableSizes).toEqual(resultAvailableSizes);
});