import getWindow from "./getWindow";

function isWindow(element: unknown): element is typeof window {
  const elementString = Object.prototype.toString.call(element);
  return elementString === "[object Window]" || elementString === "[object global]";
}

export default function isHTMLElement(element: Node | Window): element is HTMLElement {
  if (isWindow(element)) {
    return false;
  }

  return element instanceof getWindow(element).HTMLElement;
}
