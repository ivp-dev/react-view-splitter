import type { Ref } from "react";
import type { CallbackRef } from "./useMergedRefs.types";

export const isCallbackRef = <T>(callback: unknown): callback is CallbackRef<T> => {
  return !callback || typeof callback === "function";
};

export const isRef = <T>(ref: unknown): ref is React.MutableRefObject<T> => {
  return !ref || typeof (ref as React.MutableRefObject<T>).current !== "undefined";
};

export const toFnRef = <T>(
  ref?: React.MutableRefObject<T> | CallbackRef<T> | null
): CallbackRef<T> => {
  if (isCallbackRef(ref)) {
    return ref;
  }

  return (value: T) => {
    ((ref ?? {}) as React.MutableRefObject<T>).current = value;
  };
};

export function mergeRefs<T>(...refs: Array<Ref<T> | null | undefined>): CallbackRef<T> {
  const fnRefs = refs.map((ref) => toFnRef(ref));
  return (value: T) => {
    fnRefs.forEach((fnRef) => fnRef && fnRef(value));
  };
}
