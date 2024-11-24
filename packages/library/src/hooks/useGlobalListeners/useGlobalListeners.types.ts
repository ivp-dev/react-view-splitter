export interface GlobalListeners {
  addGlobalListener<K extends keyof DocumentEventMap>(
    el: EventTarget,
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addGlobalListener(
    el: EventTarget,
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeGlobalListener<K extends keyof DocumentEventMap>(
    el: EventTarget,
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeGlobalListener(
    el: EventTarget,
    type: string,
    listener: EventListener,
    options?: boolean | EventListenerOptions
  ): void;
  removeAllGlobalListeners(): void;
}

export type ListenerMetadata = {
  type: string;
  target: EventTarget;
  options: boolean | AddEventListenerOptions | undefined;
  fn: GeneralEventListener;
};

export type GeneralEventListener =
  | EventListener
  | (<K extends keyof DocumentEventMap>(this: Document, ev: DocumentEventMap[K]) => any);
