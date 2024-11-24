import { useEffect, useMemo, useRef } from "react";

/**
 * Returns a new ResizeObserver instance bound to the `onResize` callback.
 * If `ResizeObserver` is undefined in the execution environment, returns `undefined`.
 */
export default function useResizeObserver(cb: ResizeObserverCallback, disabled = false) {
  const cbRef = useRef(cb);
  cbRef.current = cb;
  const resizeObserver = useMemo(() => {
    if (disabled || typeof window === "undefined" || typeof window.ResizeObserver === "undefined") {
      return undefined;
    }
    const { current: cb } = cbRef;
    const { ResizeObserver } = window;

    return new ResizeObserver(cb);
  }, [disabled]);

  useEffect(() => {
    return () => resizeObserver?.disconnect();
  }, [resizeObserver]);

  return resizeObserver;
}
