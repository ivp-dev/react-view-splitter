import getCalcBarSize from './get-calc-bar-size'

export default function getEdges(
  panes: Array<number>,
  pair: Array<number>,
  rSizes: Array<number>,
  rMinSizes: Array<number>,
  portSize: number,
  barSize: number,
  portOffset: number,
  responsive: boolean
): Array<number> {

  const edges = [portOffset, portSize + portOffset];
  const entry = panes.indexOf(pair[1]);
  const sizes = rSizes.map(size => size * portSize / 100);
  const calcBarSize = getCalcBarSize(panes.length, barSize);
  const minSizes = rMinSizes.map(size =>
    Math.max(size * portSize / 100, calcBarSize)
  );

  return [
    panes.slice(0, entry),
    panes.slice(entry),
  ].map((block, index) => {
    const blockSize = block.map(paneIdx =>
      !responsive && !pair.some(p => p === paneIdx)
        ? sizes[panes.indexOf(paneIdx)]
        : minSizes[panes.indexOf(paneIdx)]
    ).reduce(
      (a, b) => a + b - calcBarSize,
      barSize * (block.length - 1)
    );

    /* ~~(index > 0) - 1 | 1  convert true to 1 and false to -1 */
    return edges[index] + blockSize * -(~~(index > 0) - 1 | 1);
  })
}