import type { ClientRect } from "@/types";

export default function getRect(element: Element): ClientRect {
  const rect: ClientRect = element.getBoundingClientRect();

  const { top, left, width, height, bottom, right } = rect;

  return {
    top,
    left,
    width,
    height,
    bottom,
    right,
  };
}
