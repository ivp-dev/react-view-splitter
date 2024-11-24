import getCalcBarSize from "./getCalcBarSize";

export default function getEdges(
  panes: number[],
  pair: number[],
  rSizes: number[],
  rMinSizes: number[],
  portSize: number,
  barSize: number,
  portSide: number,
  responsive: boolean
): number[] {
  const edges = [portSide, portSize + portSide];
  const entry = panes.indexOf(pair[1]);
  const sizes = rSizes.map((size) => (size * portSize) / 100);
  const calcBarSize = getCalcBarSize(panes.length, barSize);
  const minSizes = rMinSizes.map((size) => Math.max((size * portSize) / 100, calcBarSize));

  return [panes.slice(0, entry), panes.slice(entry)].map((block, index) => {
    const blockSize = block
      .map((paneIdx) =>
        !responsive && !pair.some((p) => p === paneIdx)
          ? sizes[panes.indexOf(paneIdx)]
          : minSizes[panes.indexOf(paneIdx)]
      )
      .reduce((a, b) => a + b - calcBarSize, barSize * (block.length - 1));

    return edges[index] + blockSize * -(index > 0 ? 1 : -1);
  });
}
