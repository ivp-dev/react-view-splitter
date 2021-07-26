import React from 'react';
import { PropsWithChildren, RefForwardingComponent } from './types';

export type SplitViewPaneProps = PropsWithChildren

const SplitViewPane: RefForwardingComponent<'div', SplitViewPaneProps> = React.forwardRef<HTMLElement, SplitViewPaneProps>(({
  as: Component = 'div',
  children,
  ...props
}: SplitViewPaneProps, ref) => {
  return <Component ref={ref} className="split-view-pane" {...props}>
    {children}
  </Component>;
});

SplitViewPane.displayName = "SplitViewPane";

export default SplitViewPane;