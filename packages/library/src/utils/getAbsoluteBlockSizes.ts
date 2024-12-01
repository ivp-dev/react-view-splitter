import { IBlockSizes } from "../types";
import getCalcBarSize from "./getCalcBarSize";

export default function getAbsoluteBlockSizes(
  portSize: number,
  block: number[],
  panes: number[],
  sizes: number[],
  minSizes: number[],
  barSize: number,
): IBlockSizes {
  const calcBarSize = getCalcBarSize(panes.length, barSize);
  const blockIndices = block.map((paneIndex) => panes.indexOf(paneIndex));
  const absSizes = blockIndices.map((paneIndex) => (sizes[paneIndex] * portSize) / 100);

  const absSize = absSizes.reduce((a, b) => a + b, 0);
  const absMinSizes = blockIndices.map((paneIdx) =>
    Math.max((minSizes[paneIdx] * portSize) / 100, calcBarSize)
  );

  const absMinSize = absMinSizes.reduce((a, b) => a + b, 0);
  const availableAbsSizes = absSizes.map((size, i) => size - absMinSizes[i]);
  const availableAbsSize = absSize - absMinSize;

  return {
    size: absSize,
    sizes: absSizes,
    minSize: absMinSize,
    minSizes: absMinSizes,
    availableSize: availableAbsSize,
    availableSizes: availableAbsSizes,
  };
}
