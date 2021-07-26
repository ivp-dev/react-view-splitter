import React from 'react';
import { PropsWithChildren, RefForwardingComponent } from './types';

export type ViewSplitterPaneProps = PropsWithChildren

const ViewSplitterPane: RefForwardingComponent<'div', ViewSplitterPaneProps> = React.forwardRef<HTMLElement, ViewSplitterPaneProps>(({
  as: Component = 'div',
  children,
  ...props
}: ViewSplitterPaneProps, ref) => {
  return <Component ref={ref} className="view-splitter-pane" {...props}>
    {children}
  </Component>;
});

ViewSplitterPane.displayName = "ViewSplitterPane";

export default ViewSplitterPane;