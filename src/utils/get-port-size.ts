import { Size } from "../types";

export default function getPortSize(source: Element, sizeTarget: Size): number {
  return sizeTarget === 'width' ? source.clientWidth : source.clientHeight;
}