import type { ClientRect, ICoordinates } from "@/types";
import type { UseMoveTransformAction } from "./useMoveTransform.const";

export type MoveTransformModifier = (args: {
  translate: ICoordinates;
  size: number;
  sizes: number[];
  isActive: boolean;
  initialTranslate: ICoordinates;
  delta: ICoordinates;
  panes: number[];
  pair: number[];
  offset: ICoordinates;
  portRect: ClientRect | null;
}) => [number[], number];

export interface UseMoveTranformParams {
  modifiers?: MoveTransformModifier[];
  portRef: React.RefObject<HTMLElement | null>;
  paneRefs: React.RefObject<HTMLElement[]>;
  defaultSizes?: number[];
  fluent?: boolean;
}

export interface MoveActions {
  start: (payload: StartActionPayload) => void;
  move: (payload: MoveActionPayload) => void;
  stop: (payload: StopActionPayload) => void;
  reset: (payload: ResetActionPayload) => void;
}

type MoveData = UseMoveTransformState & {
  size: number;
};

export type UseMoveTransformResult = [MoveData, MoveActions];

export interface UseMoveTransformState {
  isActive: boolean;
  initialTranslate: ICoordinates;
  sizes: number[];
  translate: ICoordinates;
  panes: number[];
  pair: number[];
  activeBarIndex: number;
  offset: ICoordinates;
  currentSizes: number[];
}

export interface StartActionPayload {
  coordinate: ICoordinates;
  panes: number[];
  pair: number[];
  offset: ICoordinates;
}

export interface MoveActionPayload {
  coordinate: ICoordinates;
}

export interface StopActionPayload {
  sizes: number[];
}

export interface ResetActionPayload {
  sizes: number[];
}

export type UseMoveTransformActions =
  | {
      type: typeof UseMoveTransformAction.Start;
      payload: StartActionPayload;
    }
  | {
      type: typeof UseMoveTransformAction.Move;
      payload: MoveActionPayload;
    }
  | {
      type: typeof UseMoveTransformAction.Stop;
      payload: StopActionPayload;
    }
  | {
      type: typeof UseMoveTransformAction.Reset;
      payload: ResetActionPayload;
    };

export type UseMoveTranformReducer = {
  [P in UseMoveTransformActionType]: (
    state: UseMoveTransformState,
    action: Extract<UseMoveTransformActions, { type: P }>
  ) => UseMoveTransformState;
};

export type UseMoveTransformActionType =
  (typeof UseMoveTransformAction)[keyof typeof UseMoveTransformAction];

export type InferPayloadType<T extends UseMoveTransformActionType> = Extract<
  UseMoveTransformActions,
  { type: T }
>["payload"];
