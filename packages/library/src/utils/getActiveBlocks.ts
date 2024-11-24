export default function getActiveBlocks(
  layout: Array<number | number[]>,
  responsive = false
): Array<number[]> {
  const result: Array<number[]> = responsive
    ? // if responsive layout will be array of arrays
      (layout.slice() as Array<number[]>)
    : // else needs leave only arrays
      (layout.filter((b) => b instanceof Array) as Array<number[]>);

  return result;
}
