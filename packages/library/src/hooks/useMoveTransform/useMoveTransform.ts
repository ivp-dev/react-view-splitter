import { useMemo, useReducer } from "react";
import { UseMoveTransformAction } from "./useMoveTransform.const";
import type {
  InferPayloadType,
  UseMoveTranformParams,
  UseMoveTransformActions,
  UseMoveTransformActionType,
  UseMoveTransformResult,
} from "./useMoveTransform.types";
import { defaultMoveTransformState } from "./useMoveTransform.const";
import { applyMoveTransformModifiers, defaultMoveTransformReducer } from "./useMoveTransform.utils";
import { useRect } from "@/hooks/useRect";

export default function useMoveTransform(params: UseMoveTranformParams): UseMoveTransformResult {
  const { portRef, modifiers = [], defaultSizes, paneRefs, fluent = false } = params;
  const [state, dispatch] = useReducer(defaultMoveTransformReducer, {
    ...defaultMoveTransformState,
    sizes: defaultSizes || defaultMoveTransformState.sizes,
  });

  const portRect = useRect(state.isActive ? portRef.current : null);

  const actions = useMemo(() => {
    const buildAction =
      <T extends UseMoveTransformActionType>(type: T) =>
      (payload: InferPayloadType<T>) => {
        dispatch({ type, payload } as UseMoveTransformActions);
      };

    return {
      start: buildAction(UseMoveTransformAction.Start),
      move: buildAction(UseMoveTransformAction.Move),
      stop: buildAction(UseMoveTransformAction.Stop),
      reset: buildAction(UseMoveTransformAction.Reset),
    };
  }, []);

  const getPanesSizes = () => {
    if (paneRefs.current) {
      const count = paneRefs.current.length;
      return paneRefs.current.map((_, idx) => state.sizes[idx] ?? 100 / count);
    }

    return state.sizes;
  };

  const [sizes, size] = applyMoveTransformModifiers(modifiers, {
    ...state,
    delta: {
      x: state.translate.x - state.initialTranslate.x,
      y: state.translate.y - state.initialTranslate.y,
    },
    initialTranslate: state.initialTranslate,
    portRect,
    size: 0,
    sizes: getPanesSizes(),
  });

  const resolvedSizes = fluent || !state.isActive ? sizes : state.sizes;
  return [{ ...state, size, sizes: resolvedSizes, currentSizes: sizes }, actions];
}
