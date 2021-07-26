export default function split(
  panes: Array<number>,
  pair: Array<number>,
  responsive: boolean
): Array<number | Array<number>> {

  const result: Array<number | Array<number>> = pair.map(id => [id]);

  for (let idx = 0, index = panes.indexOf(pair[idx]); idx < panes.length; idx++) {
    if (!pair.some(id => id === panes[idx])) {
      if (responsive) {
        Array.prototype.splice.call(
          result[~~(idx > index)], idx % index, 0, panes[idx]
        );
      } else {
        result.splice(idx, 0, panes[idx]);
      }
    } else {
      index = panes.indexOf(panes[idx]);
    }
  }
  return result;
}