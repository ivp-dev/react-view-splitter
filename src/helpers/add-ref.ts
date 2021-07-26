import { MutableRefObject } from "react";

export default function addRef(refs: MutableRefObject<HTMLElement[]>, el: HTMLElement): void {
  if (!refs.current) {
    throw new Error(`Ref isn't initialized`);
  }
  
  if (el && !refs.current.includes(el)) {
    refs.current.push(el);
  }
}
