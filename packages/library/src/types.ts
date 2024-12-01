import React from "react";

export type Axes = "x" | "y";

export type Size = "width" | "height";

export type Side = "left" | "right" | "top" | "bottom";

export interface ICoordinates {
  x: number;
  y: number;
}
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
  offset: ICoordinates;
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

export type FirstArgument<T> = T extends (firstArg: infer U, ...args: any[]) => any ? U : never;
