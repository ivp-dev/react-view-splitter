import match from "@/utils/match";
import { defaultMoveTransformState, UseMoveTransformAction } from "./useMoveTransform.const";
import type {
  MoveTransformModifier,
  UseMoveTranformReducer,
  UseMoveTransformActions,
  UseMoveTransformState,
} from "./useMoveTransform.types";
import type { FirstArgument } from "@/types";

export function defaultMoveTransformReducer(
  state: UseMoveTransformState,
  action: UseMoveTransformActions
) {
  const reducer: UseMoveTranformReducer = {
    [UseMoveTransformAction.Start]: (state, { payload }) => {
      return {
        ...state,
        currentAction: UseMoveTransformAction.Start,
        isActive: true,
        initialTranslate: { ...payload.coordinate },
        pair: payload.pair,
        panes: payload.panes,
        translate: { ...payload.coordinate },
      };
    },
    [UseMoveTransformAction.Move]: (state, { payload }) => {
      const { coordinate } = payload;

      return {
        ...state,
        currentAction: UseMoveTransformAction.Move,
        translate: { ...coordinate },
      };
    },
    [UseMoveTransformAction.Stop]: (state, { payload }) => {
      return {
        ...state,
        sizes: payload.sizes,
        currentAction: UseMoveTransformAction.Stop,
        isActive: false,
      };
    },
    [UseMoveTransformAction.Reset]: (payload) => {
      return { ...defaultMoveTransformState, sizes: payload.sizes };
    },
  };

  return match(action.type, reducer, state, action);
}

export function applyMoveTransformModifiers(
  modifiers: MoveTransformModifier[] | undefined,
  { sizes, size, ...args }: FirstArgument<MoveTransformModifier>
): [number[], number] {
  return modifiers?.length
    ? modifiers.reduce<[number[], number]>(
        ([sizes, size], modifier) => modifier({ sizes, size, ...args }),
        [sizes, size]
      )
    : [sizes, size];
}
