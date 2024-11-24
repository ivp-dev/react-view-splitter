export type PointerType = "mouse" | "pen" | "touch" | "keyboard" | "virtual";

export interface EventKeys {
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
}

export interface EventCoordinates {
  clientX: number;
  clientY: number;
}

export type EventBase = EventCoordinates & {
  target: EventTarget | null;
};

export interface MoveData extends EventCoordinates {
  active: boolean;
  activePointId: number | null;
  initialClientX: number;
  initialClientY: number;
  isDistanceReached: boolean;
  userSelect: string;
}

export interface UseMoveParams {
  distance?: number;
  onMoveStart: (e: MoveStartEvent) => boolean | void;
  onMove: (e: MoveEvent) => void;
  onMoveEnd: (e: MoveEndEvent) => void;
}

export interface BaseMoveEvent extends EventBase, EventKeys {
  pointerType: PointerType;
}

interface MoveStartEvent extends BaseMoveEvent, EventCoordinates {
  type: "movestart";
}

interface MoveEvent extends BaseMoveEvent, EventCoordinates {
  type: "move";
  deltaX: number;
  deltaY: number;
  initialDeltaX: number;
  initialDeltaY: number;
}

export interface MoveEndEvent extends BaseMoveEvent, EventCoordinates {
  type: "moveend";
}
