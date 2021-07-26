import React from 'react'
import { CallbackRef, Ref } from '../types';

export const isCallbackRef = <T>(callback: unknown): callback is CallbackRef<T> => {
  return !callback || typeof callback === 'function';
}

export const isRef = <T>(ref: unknown): ref is React.MutableRefObject<T> => {
  return !ref || typeof (ref as React.MutableRefObject<T>).current !== 'undefined'
}

export const toFnRef = <T>(ref?: React.MutableRefObject<T> | CallbackRef<T> | null): CallbackRef<T> => {
  if (isCallbackRef(ref)) {
    return ref;
  }

  return (value: T) => {
    ((ref ?? {}) as React.MutableRefObject<T>).current = value;
  }
}

export function mergeRefs<T>(...refs: Array<Ref<T> | null | undefined>): CallbackRef<T> {
  const fnRefs = refs.map(ref => toFnRef(ref));
  return (value: T) => {
    fnRefs.forEach((fnRef) => fnRef && fnRef(value))
  }
}

/**
 * Create and returns a single callback ref composed from two other Refs.
 *
 * ```tsx
 * const Button = React.forwardRef((props, ref) => {
 *   const [element, attachRef] = useCallbackRef<HTMLButtonElement>();
 *   const mergedRef = useMergedRefs(ref, attachRef);
 *
 *   return <button ref={mergedRef} {...props}/>
 * })
 * ```
 *
 * @param refA A Callback or mutable Ref
 * @param refB A Callback or mutable Ref
 * @param refs another refs or mutable Ref
 * @category refs
 */
function useMergedRefs<T>(refA?: Ref<T> | null, refB?: Ref<T> | null, ...refs: Array<Ref<T> | null>): CallbackRef<T> {
  return React.useMemo(() => {
    return mergeRefs(refA, refB, ...refs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refA, refB, ...refs])
}

export default useMergedRefs