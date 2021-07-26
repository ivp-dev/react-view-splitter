import getAbsoluteBlockSizes from "./get-absolute-block-sizes";

export default function getSizes(
  panes: Array<number>,
  blocks: Array<Array<number>>,
  rSizes: Array<number>,
  rMinSizes: Array<number>,
  portSize: number,
  offset: number,
  barSize: number
): Array<number> {
  const indices = panes.slice();
  const ltr = offset > 0;
  const absSizes = rSizes.map(size => size * portSize / 100);
  const activeBlocks = ltr ? blocks.reverse() : blocks.slice();

  let reducedSize = 0;
  let absOffset = Math.abs(offset);

  for (const [idx, activeBlock] of activeBlocks.entries()) {
    const reduce = idx === 0;
    const increase = idx === 1;
    const activeBlockIndices = activeBlock.map(paneIndex => indices.indexOf(paneIndex));
    const activeBlockSizes = getAbsoluteBlockSizes(portSize, activeBlock, panes, rSizes, rMinSizes, barSize);
    
    // to prevent overflows
    if (reduce && activeBlockSizes.size - absOffset < activeBlockSizes.minSize) {
      absOffset = activeBlockSizes.size - activeBlockSizes.minSize;
    }

    if (reduce && activeBlockSizes.availableSize === 0) {
      continue
    }

    // apply sizes for all panes in block
    for (const [jdx, index] of activeBlockIndices.entries()) {
      if (
        // if increase, evenly spread the offset
        // between panes in block 
        increase
      ) {
        absSizes[index] += reducedSize / activeBlock.length
      }
      else if (
        // if reduce, apply the offset relatively
        // to the current available size of block
        // and current size of pane
        reduce
      ) {
        const ratio = (activeBlockSizes.availableSize - absOffset) / activeBlockSizes.availableSize;
        absSizes[index] = activeBlockSizes.availableSizes[jdx] * ratio + activeBlockSizes.minSizes[jdx];
        reducedSize += absSizes[index];
      }
    }

    reducedSize = activeBlockSizes.size - reducedSize;
  }

  const absSize = absSizes.reduce((a, b) => a + b, 0);

  if (absSize !== portSize) {
    absSizes.forEach((size, idx) => absSizes[idx] = size * portSize / absSize);
  }

  return absSizes.map(size =>
    size / portSize * 100
  );
}