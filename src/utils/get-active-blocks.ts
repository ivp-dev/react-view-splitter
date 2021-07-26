export default function getActiveBlocks(
  layout: Array<number | Array<number>>,
  responsive = false
): Array<Array<number>> {
  const result: Array<Array<number>> = responsive
    // if responsive layout will be array of arrays
    ? layout.slice() as Array<Array<number>>
    // else needs leave only arrays
    : layout.filter(b =>
      b instanceof Array
    ) as Array<Array<number>>;

  return result
}