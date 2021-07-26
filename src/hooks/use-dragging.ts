import React from "react";
import { DragCallback, MoveEvent } from "../types";
import { getCoordinates } from "../utils";

export default function useDragging(
  isDragging: boolean,
  onMove: DragCallback,
  onMoveEnd: DragCallback
): void {
  const onMoveCallback = React.useCallback((event: MoveEvent) => {
    onMove(getCoordinates(event));
    if (event.cancelable) {
      event.preventDefault();
    }
  }, [onMove]);
  const onMoveEndCallback = React.useCallback((event: MoveEvent) => {
    onMoveEnd(getCoordinates(event));
    if (event.cancelable) {
      event.preventDefault();
    }
  }, [onMoveEnd]);

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMoveCallback, { passive: false });
      window.addEventListener('touchmove', onMoveCallback, { passive: false });
      window.addEventListener('mouseup', onMoveEndCallback, { passive: false });
      window.addEventListener('touchend', onMoveEndCallback, { passive: false });
      window.addEventListener('touchcancel', onMoveEndCallback, { passive: false });
    } else {
      window.removeEventListener('mousemove', onMoveCallback);
      window.removeEventListener('touchmove', onMoveCallback);
      window.removeEventListener('mouseup', onMoveEndCallback);
      window.removeEventListener('touchend', onMoveEndCallback);
      window.removeEventListener('touchcancel', onMoveEndCallback);
    }
    return () => {
      window.removeEventListener('mousemove', onMoveCallback);
      window.removeEventListener('touchmove', onMoveCallback);
      window.removeEventListener('mouseup', onMoveEndCallback);
      window.removeEventListener('touchend', onMoveEndCallback);
      window.removeEventListener('touchcancel', onMoveEndCallback);
    }
  }, [isDragging, onMoveCallback, onMoveEndCallback]);
}