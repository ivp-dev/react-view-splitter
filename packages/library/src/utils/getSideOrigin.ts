import { Axes, Side } from "../types";

export default function sideOrigin(axis: Axes): Side {
  return axis === "x" ? "left" : "top";
}
