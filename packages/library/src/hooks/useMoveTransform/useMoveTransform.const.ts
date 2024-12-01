import type { UseMoveTransformState } from "./useMoveTransform.types";

export const UseMoveTransformAction = {
  Start: "start",
  Move: "move",
  Stop: "stop",
  Reset: "reset",
} as const;

export const defaultMoveTransformState: UseMoveTransformState = {
  isActive: false,
  initialTranslate: { x: 0, y: 0 },
  pair: [],
  panes: [],
  sizes: [],
  translate: { x: 0, y: 0 },
  activeBarIndex: -1,
  offset: { x: 0, y: 0 },
  currentSizes: [],
};
