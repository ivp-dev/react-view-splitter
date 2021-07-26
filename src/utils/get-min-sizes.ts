export default function getMinSizes(length: number, minSize: number, defaultMinSizes?: Array<number>): Array<number> {
  return Array.isArray(defaultMinSizes) ? [...defaultMinSizes] : new Array(length).fill(minSize);
}