export default function isNode(node: unknown): node is Node {
  return !!node && typeof node === "object" && "nodeType" in node;
}
