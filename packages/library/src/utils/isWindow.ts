export default function isWindow(element: unknown): element is typeof window {
  const elementString = Object.prototype.toString.call(element);
  return elementString === "[object Window]" || elementString === "[object global]";
}
