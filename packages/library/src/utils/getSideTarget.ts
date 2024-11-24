import { Axes, Side } from "../types";

export default function getSideTarget(axis: Axes): Side {
  return axis === "x" ? "right" : "bottom";
}
