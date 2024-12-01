import { HTMLAttributes } from "react";
import type { Axes } from "@/types";

export type ViewSplitterPaneProps = HTMLAttributes<HTMLDivElement> & {
  axis: Axes;
  relativeSize: number;
  barSize: number;
};
