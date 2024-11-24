export interface ViewSplitterContextValue {
  registerPane: (element: HTMLElement) => () => void;
  registerBar: (element: HTMLElement) => () => void;
}
