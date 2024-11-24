import type { ICoordinates, IDrag, IOffset } from "@/types";

export const defaultClassNamesMap = {
  base: "view-splitter",
  pane: "view-splitter-pane",
  paneContent: "view-splitter-pane-content",
  bar: "view-splitter-bar",
  decorator: "view-splitter-decorator",
};

const defaultCoordinates: ICoordinates = { x: 0, y: 0 };

const defaultOffset: IOffset = {
  x: 0,
  y: 0,
};

export const defaultDrag: IDrag = {
  activeBarIndex: -1,
  isDragging: false,
  start: defaultCoordinates,
  current: defaultCoordinates,
  offset: defaultOffset,
  pair: [],
  panes: [],
};

export type ViewSplitterClassNames = typeof defaultClassNamesMap;
