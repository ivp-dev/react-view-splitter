import React from "react";
import { useMergedRefs } from "@/hooks/useMergedRefs";

import type { ViewSplitterPaneProps } from "./ViewSplitterPane.types";
import { useViewSplitterContext } from "@/contexts/ViewSplitterContext";

const ViewSplitterPane = React.forwardRef<HTMLDivElement, ViewSplitterPaneProps>((props, ref) => {
  const paneRef = React.useRef<HTMLDivElement>(null);
  const mergedRefs = useMergedRefs(ref, paneRef);

  const { registerPane } = useViewSplitterContext();

  React.useEffect(() => {
    if (paneRef.current) {
      return registerPane(paneRef.current);
    }
  }, [registerPane]);

  return <div ref={mergedRefs} {...props} />;
});

ViewSplitterPane.displayName = "ViewSplitterPane";

export default ViewSplitterPane;
