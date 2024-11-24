import type { Axes, Size } from "../types";

export default function sizeTarget(axis: Axes): Size {
  return axis === "x" ? "width" : "height";
}
