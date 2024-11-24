import isNode from "./isNode";
import isWindow from "./isWindow";

export default function getWindow(target: Event["target"]): typeof window {
  if (!target) {
    return window;
  }

  if (isWindow(target)) {
    return target;
  }

  if (!isNode(target)) {
    return window;
  }

  return target.ownerDocument?.defaultView ?? window;
}
