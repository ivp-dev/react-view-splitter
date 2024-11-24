import type { Size } from "../types";

export default function (elements: Array<HTMLElement>): void {
  (["width", "height"] as Size[]).forEach((size) => {
    elements.forEach((element) => {
      element.style[size] = "";
    });
  });
}
