import React from "react";
import { useMergedRefs } from "@/hooks/useMergedRefs";

import type { ViewSplitterPaneProps } from "./ViewSplitterPane.types";
import { useViewSplitterContext } from "@/contexts/ViewSplitterContext";
import { getSizeTarget } from "@/utils";

const ViewSplitterPane = React.forwardRef<HTMLDivElement, ViewSplitterPaneProps>((props, ref) => {
  const { axis, relativeSize, barSize, style, ...other } = props;
  const paneRef = React.useRef<HTMLDivElement>(null);
  const mergedRefs = useMergedRefs(ref, paneRef);

  const { registerPane } = useViewSplitterContext();

  const innerStyle = {
    ...style,
    [getSizeTarget(axis)]: `calc(${relativeSize}% - ${barSize}px)`,
  };

  React.useEffect(() => {
    if (paneRef.current) {
      return registerPane(paneRef.current);
    }
  }, [registerPane]);

  return <div ref={mergedRefs} style={innerStyle} {...other} />;
});

ViewSplitterPane.displayName = "ViewSplitterPane";

export default ViewSplitterPane;
