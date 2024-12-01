import React from "react";
import { useMergedRefs } from "@/hooks/useMergedRefs";

import type { ViewSplitterBarProps } from "./ViewSpliterBar.types";
import { useViewSplitterContext } from "@/contexts/ViewSplitterContext";
import { getSizeTarget } from "../../utils";

const ViewSplitterBar = React.forwardRef<HTMLDivElement, ViewSplitterBarProps>((props, ref) => {
  const { axis, barSize, style, ...other } = props;
  const barRef = React.useRef<HTMLDivElement>(null);
  const mergedRefs = useMergedRefs(ref, barRef);

  const { registerBar } = useViewSplitterContext();

  const innerStyle = {
    ...style,
    [getSizeTarget(axis)]: `${barSize}px`,
  };

  React.useEffect(() => {
    if (barRef.current) {
      return registerBar(barRef.current);
    }
  }, [registerBar]);

  return <div ref={mergedRefs} style={innerStyle} {...other} />;
});

ViewSplitterBar.displayName = "ViewSplitterBar";

export default ViewSplitterBar;
