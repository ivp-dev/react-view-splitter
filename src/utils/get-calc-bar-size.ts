export default function getCalcBarSize(length: number, barSize: number): number {
  return barSize * (length - 1) / length;
}