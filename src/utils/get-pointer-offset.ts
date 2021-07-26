import { isSyntheticEvent } from "../helpers";
import { Axes, ICoordinates, MoveEvent } from "../types";
import rect from "./get-rect";

export default function getPointerOffset(
  event: MoveEvent
): ICoordinates {
  let nativeEvent: Event;

  if (isSyntheticEvent(event)) {
    nativeEvent = event.nativeEvent
  } else {
    nativeEvent = event as Event;
  }

  if (nativeEvent instanceof MouseEvent) {
    return {
      [Axes.X]: nativeEvent.offsetX,
      [Axes.Y]: nativeEvent.offsetY
    }
  }

  if (nativeEvent instanceof TouchEvent) {
    const firstTouch = nativeEvent.touches[0] ?? nativeEvent.changedTouches[0];
    const targetRect = rect(firstTouch.target as HTMLElement);

    return {
      [Axes.X]: firstTouch.clientX - targetRect.left,
      [Axes.Y]: firstTouch.clientY - targetRect.top
    }
  }

  throw 'Event type not supported';
}