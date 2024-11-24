import { ClientRect } from "@/types";

export default function isRectEqual(rect1: ClientRect | null, rect2: ClientRect | null): boolean {
  if (!rect1 || !rect2) {
    return false;
  }

  return (
    rect1.top === rect2.top &&
    rect1.left === rect2.left &&
    rect1.width === rect2.width &&
    rect1.height === rect2.height &&
    rect1.bottom === rect2.bottom &&
    rect1.right === rect2.right
  );
}
