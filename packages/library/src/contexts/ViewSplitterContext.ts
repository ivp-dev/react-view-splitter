import { createContext, useContext } from "react";
import type { ViewSplitterContextValue } from "./ViewSplitterContext.types";

/**
 * ViewSplitterContext context.
 */
const ViewSplitterContext = createContext<ViewSplitterContextValue | undefined>(undefined);

export default ViewSplitterContext;

export function useViewSplitterContext() {
  const context = useContext(ViewSplitterContext);

  if (!context) {
    throw new Error("ViewSplitterContext is required");
  }

  return context;
}
