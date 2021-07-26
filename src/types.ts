import React from 'react'

export const Axes = {
  X: 'x' as const,
  Y: 'y' as const
};

export type Axes = typeof Axes[keyof typeof Axes];

export const Size = {
  Width: "width" as const,
  Height: "height" as const
}

export type Size = typeof Size[keyof typeof Size];

export const Side = {
  Left: "left" as const,
  Right: "right" as const,
  Top: "top" as const,
  Bottom: "bottom" as const
}

export type Side = typeof Side[keyof typeof Side];

export type Omit<T, U> = Pick<T, Exclude<keyof T, keyof U>>;

export type ReplaceProps<Inner extends React.ElementType, P> = Omit<React.ComponentPropsWithRef<Inner>, P> & P;

export interface Props<As extends React.ElementType = React.ElementType> {
  as?: As;
  className?: string;
}

export type PropsWithChildren<
  As extends React.ElementType = React.ElementType
  > = React.PropsWithChildren<Props<As>>;

export interface RefForwardingComponent<TInitial extends React.ElementType, P = unknown> {
  <As extends React.ElementType = TInitial>(
    props: React.PropsWithChildren<ReplaceProps<As, Props<As> & P>>,
    context?: unknown,
  ): React.ReactElement | null;
  propTypes?: unknown;
  contextTypes?: unknown;
  defaultProps?: Partial<P>;
  displayName?: string;
}

export interface IDrag {
  activeBarIndex: number,
  current: ICoordinates,
  offset: IOffset,
  isDragging: boolean,
  pair: Array<number>,
  panes: Array<number>
}

export interface ICoordinates {
  [Axes.X]: number,
  [Axes.Y]: number
}

export interface IOffset extends ICoordinates {
  [Side.Left]: number,
  [Side.Top]: number,
  [Side.Right]: number,
  [Side.Bottom]: number
}

export interface IBlockSizes {
  size: number,
  minSize: number,
  sizes: Array<number>,
  minSizes: Array<number>,
  availableSizes: Array<number>,
  availableSize: number
}

export interface IPosition {
  start: ICoordinates,
  current: ICoordinates,
  offset: IOffset,
}

export type CallbackRef<T> = (ref: T) => void

export type Ref<T> = React.MutableRefObject<T> | CallbackRef<T>

export type DragCallback = (current: ICoordinates) => void

export type OnSizeChangedCallback = (sizes: Array<number>) => void

export type MoveEvent = React.SyntheticEvent | MouseEvent | TouchEvent