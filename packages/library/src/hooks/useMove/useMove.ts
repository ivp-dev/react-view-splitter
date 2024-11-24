import {
  SyntheticEvent,
  useMemo,
  useRef,
  useState,
  type DOMAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";

import { useGlobalListeners } from "../useGlobalListeners";

import type { EventKeys, MoveData, PointerType, UseMoveParams, EventBase } from "./useMove.types";

const defaultState: MoveData = Object.freeze({
  active: false,
  activePointId: null,
  clientX: 0,
  clientY: 0,
  initialClientX: 0,
  initialClientY: 0,
  isDistanceReached: false,
  userSelect: "",
});

export default function useMove(params: UseMoveParams) {
  const [stateRef] = useState<{ state: MoveData }>(() => ({
    state: { ...defaultState },
  }));

  const paramsRef = useRef(params);
  paramsRef.current = params;

  const { addGlobalListener, removeGlobalListener } = useGlobalListeners();

  const listeners = useMemo<DOMAttributes<HTMLDivElement>>(() => {
    const attr: DOMAttributes<HTMLDivElement> = {};

    const stopEvent = (e: SyntheticEvent) => {
      e.stopPropagation();
      e.preventDefault();
    };

    const update = (event: EventBase, pointerId?: number | null) => {
      const { state } = stateRef;
      const {
        current: { distance = 0, ...handlers },
      } = paramsRef;
      const { clientX, clientY, target } = event;
      const { clientX: prevClientX, clientY: prevClientY } = state;

      state.clientX = clientX;
      state.clientY = clientY;

      if (pointerId !== undefined) {
        state.activePointId = pointerId;
      }

      const getCommonEventData = (event: EventKeys) => ({
        shiftKey: event.shiftKey,
        metaKey: event.metaKey,
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        clientX,
        clientY,
        target,
      });

      return {
        start(pointerType: PointerType, event: EventKeys): boolean | void {
          state.userSelect = document.documentElement.style.userSelect;
          document.documentElement.style.userSelect = "none";

          state.active = true;
          state.initialClientX = clientX;
          state.initialClientY = clientY;
          state.isDistanceReached = distance === 0;

          return handlers.onMoveStart({
            type: "movestart",
            pointerType,
            ...getCommonEventData(event),
          });
        },
        move(pointerType: PointerType, event: EventKeys, deltaX?: number, deltaY?: number) {
          const initialDeltaX = clientX - state.initialClientX;
          const initialDeltaY = clientY - state.initialClientY;

          if (
            !state.isDistanceReached &&
            initialDeltaX ** 2 + initialDeltaY ** 2 >= distance ** 2
          ) {
            state.isDistanceReached = true;
          }

          if (state.isDistanceReached) {
            handlers.onMove({
              type: "move",
              pointerType,
              deltaX: deltaX ?? clientX - prevClientX,
              deltaY: deltaY ?? clientY - prevClientY,
              initialDeltaX,
              initialDeltaY,
              ...getCommonEventData(event),
            });
          }
        },
        end(pointerType: PointerType, event: EventKeys) {
          document.documentElement.style.userSelect = state.userSelect;
          stateRef.state = { ...defaultState };

          handlers.onMoveEnd({
            type: "moveend",
            pointerType,
            ...getCommonEventData(event),
          });
        },
      };
    };

    if (typeof PointerEvent === "undefined") {
      const onMouseMove = (e: MouseEvent) => {
        if (e.button === 0) {
          update(e).move("mouse", e);
        }
      };
      const onMouseUp = (e: MouseEvent) => {
        if (e.button === 0) {
          update(e).end("mouse", e);
        }
      };

      attr.onMouseDown = (e: ReactMouseEvent) => {
        if (e.button === 0) {
          if (update(e).start("mouse", e) !== false) {
            addGlobalListener(window, "mousemove", onMouseMove, false);
            addGlobalListener(window, "mouseup", onMouseUp, false);

            stopEvent(e);
          } else update(e, null);
        }
      };

      const onTouchMove = (e: TouchEvent) => {
        const state = stateRef.state;

        const touch = [...e.changedTouches].findIndex(
          ({ identifier }) => identifier === state.activePointId
        );

        if (touch >= 0) {
          const touchEvent = e.changedTouches[touch];
          // move
          update(touchEvent).move("touch", e);
        }
      };
      const onTouchEnd = (e: TouchEvent) => {
        const state = stateRef.state;

        const touch = [...e.changedTouches].findIndex(
          ({ identifier }) => identifier === state.activePointId
        );
        if (touch >= 0) {
          // end
          update(e.changedTouches[touch], null).end("touch", e);

          removeGlobalListener(window, "touchmove", onTouchMove);
          removeGlobalListener(window, "touchend", onTouchEnd);
          removeGlobalListener(window, "touchcancel", onTouchEnd);
        }
      };
      attr.onTouchStart = (e: ReactTouchEvent) => {
        const state = stateRef.state;

        if (e.changedTouches.length === 0 || state.activePointId !== null) {
          return;
        }

        const touch = e.changedTouches[0];

        if (update(touch, touch.identifier).start("touch", e) !== false) {
          addGlobalListener(window, "touchmove", onTouchMove, false);
          addGlobalListener(window, "touchend", onTouchEnd, false);
          addGlobalListener(window, "touchcancel", onTouchEnd, false);

          stopEvent(e);
        } else update(touch, null);
      };
    } else {
      const onPointerMove = (e: PointerEvent) => {
        if (e.pointerId === stateRef.state.activePointId) {
          const pointerType = (e.pointerType || "mouse") as PointerType;
          update(e).move(pointerType, e);
        }
      };

      const onPointerUp = (e: PointerEvent) => {
        if (e.pointerId === stateRef.state.activePointId) {
          const pointerType = (e.pointerType || "mouse") as PointerType;

          update(e, null).end(pointerType, e);

          removeGlobalListener(window, "pointermove", onPointerMove, false);
          removeGlobalListener(window, "pointerup", onPointerUp, false);
          removeGlobalListener(window, "pointercancel", onPointerUp, false);
        }
      };

      attr.onPointerDown = (e: ReactPointerEvent) => {
        if (e.button === 0 && stateRef.state.activePointId === null) {
          const pointerType = (e.pointerType || "mouse") as PointerType;

          if (update(e, e.pointerId).start(pointerType, e) !== false) {
            stopEvent(e);
            addGlobalListener(window, "pointermove", onPointerMove, false);
            addGlobalListener(window, "pointerup", onPointerUp, false);
            addGlobalListener(window, "pointercancel", onPointerUp, false);
          } else update(e, null);
        }
      };
    }

    const triggerKeyboardMove = (e: ReactKeyboardEvent, deltaX: number, deltaY: number) => {
      const { start, move, end } = update({
        clientX: 0,
        clientY: 0,
        target: e.target,
      });
      if (start("keyboard", e)) {
        move("keyboard", e, deltaX, deltaY);
        end("keyboard", e);
      } else {
        update({ clientX: 0, clientY: 0, target: e.target }, null);
      }
    };

    attr.onKeyDown = (e) => {
      switch (e.key) {
        case "Left":
        case "ArrowLeft":
          stopEvent(e);
          triggerKeyboardMove(e, -1, 0);
          break;
        case "Right":
        case "ArrowRight":
          stopEvent(e);
          triggerKeyboardMove(e, 1, 0);
          break;
        case "Up":
        case "ArrowUp":
          stopEvent(e);
          triggerKeyboardMove(e, 0, -1);
          break;
        case "Down":
        case "ArrowDown":
          stopEvent(e);
          triggerKeyboardMove(e, 0, 1);
          break;
      }
    };

    return attr;
  }, [addGlobalListener, removeGlobalListener, stateRef]);

  return { listeners };
}
