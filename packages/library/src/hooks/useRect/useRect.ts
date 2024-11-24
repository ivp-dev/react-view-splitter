import { useReducer } from "react";
import type { ClientRect } from "@/types";
import { getRect, isHTMLElement, isRectEqual } from "@/utils";
import { useMutationObserver } from "@/hooks/useMutationObserver";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { useEnhancedEffect } from "@/hooks/useEnhancedEffect";

export default function useRect(
  element: HTMLElement | null,
  measure: (element: HTMLElement) => ClientRect = getRect
) {
  const [rect, measureRect] = useReducer(reducer, null);

  const mutationObserver = useMutationObserver((records) => {
    if (!element) {
      return;
    }

    for (const record of records) {
      const { type, target } = record;

      if (type === "childList" && isHTMLElement(target) && target.contains(element)) {
        measureRect();
        break;
      }
    }
  });

  const resizeObserver = useResizeObserver(measureRect);

  useEnhancedEffect(() => {
    measureRect();

    if (element) {
      resizeObserver?.observe(element);
      mutationObserver?.observe(document.body, {
        childList: true,
        subtree: true,
      });
    } else {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    }
  }, [element, mutationObserver, resizeObserver]);

  return rect;

  function reducer(currentRect: ClientRect | null) {
    if (!element) {
      return null;
    }

    if (element.isConnected === false) {
      return currentRect ?? null;
    }

    const newRect = measure(element);

    if (isRectEqual(newRect, currentRect)) {
      return currentRect;
    }

    return newRect;
  }
}
