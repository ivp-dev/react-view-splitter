import React, { Ref } from "react";

import { mergeRefs } from "./useMergedRefs.utils";
import type { CallbackRef } from "./useMergedRefs.types";

export default function useMergedRefs<T>(
  refA?: Ref<T> | null,
  refB?: Ref<T> | null,
  ...refs: Array<Ref<T> | null>
): CallbackRef<T> {
  return React.useMemo(() => {
    return mergeRefs(refA, refB, ...refs);
  }, [refA, refB, ...refs]);
}
