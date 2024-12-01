import type { HTMLAttributes } from "react";
import type { Axes } from "../../types";

export type ViewSplitterBarProps = HTMLAttributes<HTMLDivElement> & {
  axis: Axes;
  barSize: number;
};
