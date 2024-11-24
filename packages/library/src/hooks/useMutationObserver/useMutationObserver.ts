import { useEffect, useMemo, useRef } from "react";

/**
 * Returns a new MutationObserver instance.
 * If `MutationObserver` is undefined in the execution environment, returns `undefined`.
 */
export default function useMutationObserver(cb: MutationCallback, disabled = false) {
  const cbRef = useRef(cb);
  cbRef.current = cb;

  const mutationObserver = useMemo(() => {
    if (
      disabled ||
      typeof window === "undefined" ||
      typeof window.MutationObserver === "undefined"
    ) {
      return undefined;
    }

    const { MutationObserver } = window;
    const { current: cb } = cbRef;
    return new MutationObserver(cb);
  }, [disabled]);

  useEffect(() => {
    return () => mutationObserver?.disconnect();
  }, [mutationObserver]);

  return mutationObserver;
}
