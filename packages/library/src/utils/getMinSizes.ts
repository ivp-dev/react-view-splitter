export default function getMinSizes(
  length: number,
  minSize: number,
  defaultMinSizes?: number[]
): number[] {
  return Array.isArray(defaultMinSizes) ? [...defaultMinSizes] : new Array(length).fill(minSize);
}
