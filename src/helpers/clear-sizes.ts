import { Size } from '../types'

export default function(elements: Array<HTMLElement>): void {
  Object.keys(Size).forEach(size => {
    const targetSize = Size[size];
    elements.forEach((element) => { element.style[targetSize] = '' });
  });
}