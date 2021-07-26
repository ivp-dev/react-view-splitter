import { isSyntheticEvent } from "../helpers";
import { Axes, ICoordinates, MoveEvent } from "../types";

export default function getCoordinates(
  event: MoveEvent
): ICoordinates {
  let nativeEvent: Event;
  
  if (isSyntheticEvent(event)) {
    nativeEvent = event.nativeEvent
  } else {
    nativeEvent = event as Event;
  }

  if (nativeEvent instanceof MouseEvent) {
    return { [Axes.X]: nativeEvent.clientX, [Axes.Y]: nativeEvent.clientY }
  }

  if (nativeEvent instanceof TouchEvent) {
    const firstTouch = nativeEvent.touches[0] ?? nativeEvent.changedTouches[0];
    return { [Axes.X]: firstTouch.clientX, [Axes.Y]: firstTouch.clientY };
  }

  throw 'Event type not supported';
}