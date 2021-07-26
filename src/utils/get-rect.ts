export default function rect(source: Element) : DOMRect {
  return source.getBoundingClientRect();
}