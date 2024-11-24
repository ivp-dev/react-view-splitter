export default function getLayout(
  panes: number[],
  pair: number[],
  responsive: boolean
): (number | number[])[] {
  const result: (number | number[])[] = pair.map((id) => [id]);
  for (let idx = 0, index = panes.indexOf(pair[idx]); idx < panes.length; idx++) {
    if (!pair.some((id) => id === panes[idx])) {
      if (responsive) {
        Array.prototype.splice.call(result[~~(idx > index)], idx % index, 0, panes[idx]);
      } else {
        result.splice(idx, 0, panes[idx]);
      }
    } else {
      index = panes.indexOf(panes[idx]);
    }
  }
  return result;
}
