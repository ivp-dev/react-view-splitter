import type { HTMLAttributes } from "react";
import type { Axes, OnSizeChangedCallback } from "../../types";
import type { ViewSplitterClassNames } from "./ViewSplitter.const";

export type ViewSplitterProps = HTMLAttributes<HTMLDivElement> & {
  axis?: Axes;
  sizes?: number[];
  fluent?: boolean;
  responsive?: boolean;
  barSize?: number;
  minSize?: number;
  minSizes?: number[];
  onSizeChanged?: OnSizeChangedCallback;
  classNamesMap?: ViewSplitterClassNames;
};
