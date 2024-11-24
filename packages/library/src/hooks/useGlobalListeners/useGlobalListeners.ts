import React from "react";
import type {
  GeneralEventListener,
  GlobalListeners,
  ListenerMetadata,
} from "./useGlobalListeners.types";

export default function useGlobalListeners(): GlobalListeners {
  const [globalListeners] = React.useState(() => ({
    current: new Map<GeneralEventListener, ListenerMetadata>(),
  }));

  const { addGlobalListener, removeGlobalListener, removeAllGlobalListeners } =
    React.useMemo(() => {
      function addGlobalListener(
        target: EventTarget,
        type: string,
        listener: GeneralEventListener,
        options?: boolean | AddEventListenerOptions
      ) {
        const fn =
          typeof options !== "boolean" && options?.once
            ? (event: Event) => {
                globalListeners.current.delete(listener);
                if (target instanceof Document) {
                  listener.call(target, event);
                } else {
                  (listener as EventListener)(event);
                }
              }
            : listener;

        target.addEventListener(type, listener, options);
        globalListeners.current.set(listener, { type, target, fn, options });
      }
      function removeGlobalListener(
        target: EventTarget,
        type: string,
        listener: GeneralEventListener,
        options?: boolean | EventListenerOptions
      ) {
        const fn = globalListeners.current.get(listener)?.fn || listener;
        target.removeEventListener(type, fn, options);
        globalListeners.current.delete(listener);
      }

      function removeAllGlobalListeners() {
        globalListeners.current.forEach(({ target, type, options }, listener) => {
          removeGlobalListener(target, type, listener, options);
        });
      }

      return {
        addGlobalListener,
        removeGlobalListener,
        removeAllGlobalListeners,
      };
    }, [globalListeners]);

  React.useEffect(() => {
    return removeAllGlobalListeners;
  }, [removeAllGlobalListeners]);

  return {
    addGlobalListener,
    removeGlobalListener,
    removeAllGlobalListeners,
  };
}
