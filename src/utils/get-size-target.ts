import { Axes, Size } from '../types'

export default function sizeTarget(axis: Axes): Size {
  return axis === Axes.X
    ? Size.Width
    : Size.Height
}