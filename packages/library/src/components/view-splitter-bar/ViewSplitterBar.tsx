import React from "react";
import { useMergedRefs } from "@/hooks/useMergedRefs";

import type { ViewSplitterBarProps } from "./ViewSpliiterBar.types";
import { useViewSplitterContext } from "@/contexts/ViewSplitterContext";

const ViewSplitterBar = React.forwardRef<HTMLDivElement, ViewSplitterBarProps>((props, ref) => {
  const barRef = React.useRef<HTMLDivElement>(null);
  const mergedRefs = useMergedRefs(ref, barRef);

  const { registerBar } = useViewSplitterContext();

  React.useEffect(() => {
    if (barRef.current) {
      return registerBar(barRef.current);
    }
  }, [registerBar]);

  return <div ref={mergedRefs} {...props} />;
});

ViewSplitterBar.displayName = "ViewSplitterBar";

export default ViewSplitterBar;
