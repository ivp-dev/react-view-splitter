import React from "react";
import type { AnyFunc } from "./useEventCallback.types";
import { useEnhancedEffect } from "../useEnhancedEffect";

export default function useEventCallback<T extends AnyFunc>(callback: T): T {
  const ref = React.useRef<T>(callback);
  useEnhancedEffect(() => {
    ref.current = callback;
  }, [callback]);

  return React.useCallback((...args: any[]) => ref.current(...args), []) as T;
}
