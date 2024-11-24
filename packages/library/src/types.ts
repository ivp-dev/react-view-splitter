import React from "react";

export type Axes = "x" | "y";

export type Size = "width" | "height";

export type Side = "left" | "right" | "top" | "bottom";

export interface IDrag {
  activeBarIndex: number;
  current: ICoordinates;
  offset: IOffset;
  isDragging: boolean;
  pair: number[];
  panes: number[];
  start: ICoordinates;
}

export interface ICoordinates {
  x: number;
  y: number;
}

export type IOffset = ICoordinates;

export interface IBlockSizes {
  size: number;
  minSize: number;
  sizes: number[];
  minSizes: number[];
  availableSizes: number[];
  availableSize: number;
}

export interface IPosition {
  start: ICoordinates;
  current: ICoordinates;
  offset: IOffset;
}

export type DragCallback = (current: ICoordinates) => void;

export type OnSizeChangedCallback = (sizes: number[]) => void;

export type MoveEvent = React.SyntheticEvent | MouseEvent | TouchEvent;

export interface ClientRect {
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
}
