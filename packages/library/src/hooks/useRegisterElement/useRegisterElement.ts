import React from "react";

export default function useRegisterElement() {
  const elementsRef = React.useRef<HTMLElement[]>([]);
    const registerElement = React.useCallback((bar: HTMLElement) => {
      elementsRef.current.push(bar);
      
      return () => {
        const idx = elementsRef.current.indexOf(bar);
        if (idx !== -1) {
          elementsRef.current.splice(idx, 1);
        }
      };
    }, []);
 

    return [elementsRef, registerElement] as const;
}