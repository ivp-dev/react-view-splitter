import React from 'react';
import { useMergedRefs } from './hooks';
import { PropsWithChildren, RefForwardingComponent, MoveEvent } from './types';

export type ViewSplitterBarProps = PropsWithChildren & {
  onMoveStart: (event: MoveEvent) => void
}

const ViewSplitterBar: RefForwardingComponent<'div', ViewSplitterBarProps> = React.forwardRef<HTMLElement, ViewSplitterBarProps>(({
  as: Component = 'div',
  onMoveStart,
  className = "",
  children,
  ...props
}: ViewSplitterBarProps, ref) => {
  const barRef = React.useRef<HTMLElement>(null);
  const mergedRefs = useMergedRefs(ref, barRef);
  const onMoveStartRef = React.useRef(onMoveStart);

  React.useEffect(() => {
    onMoveStartRef.current = onMoveStart;
  }, [onMoveStart]);


  React.useEffect(() => {
    const bar = barRef.current;
    const eventHandler = onMoveStartRef.current;

    if (bar) {
      bar.addEventListener('mousedown', eventHandler, { passive: false });
      bar.addEventListener('touchstart', eventHandler, { passive: false });
    }

    return () => {
      if (bar) {
        bar.removeEventListener('mousedown', eventHandler);
        bar.removeEventListener('touchstart', eventHandler);
      }
    }
  }, []);

  return <Component ref={mergedRefs} className={`view-splitter-bar ${className}`.trim()} {...props}>
    {children}
  </Component>;
});

ViewSplitterBar.displayName = "ViewSplitterBar";

export default ViewSplitterBar;