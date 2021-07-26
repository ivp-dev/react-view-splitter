import React from 'react';
import { Axes, IDrag, PropsWithChildren, RefForwardingComponent, ICoordinates, OnSizeChangedCallback, Size, MoveEvent } from './types';
import { useDragging, useMergedRefs } from './hooks'

import { default as SplitViewBar } from './split-view-bar';
import { default as SplitViewPane } from './split-view-pane';

import * as Utils from './utils'
import * as Helpers from './helpers';

const SplitViewDecorator = Helpers.createAs("split-view-decorator");

export type SplitViewProps = PropsWithChildren & {
  axis?: Axes
  sizes?: Array<number>
  fluent?: boolean
  responsive?: boolean
  barSize?: number
  minSize?: number
  minSizes?: Array<number>
  onSizeChanged?: OnSizeChangedCallback
}

const defaultDrag: IDrag = {
  activeBarIndex: -1,
  isDragging: false,
  current: { x: 0, y: 0 },
  offset: { x: 0, y: 0, left: 0, top: 0, right: 0, bottom: 0 },
  pair: [],
  panes: []
}


const SplitView: RefForwardingComponent<'div', SplitViewProps> = React.forwardRef<HTMLElement, SplitViewProps>(({
  as: Component = 'div',
  responsive = false,
  fluent = false,
  axis = Axes.X,
  barSize = 1,
  minSize = 0,
  className = "",
  sizes: defaultSizes,
  minSizes: defaultMinSizes,
  onSizeChanged,
  children,
  ...props
}: SplitViewProps, ref) => {

  const paneRefs = React.useRef<HTMLElement[]>([]);
  const barRefs = React.useRef<HTMLElement[]>([]);
  const decoratorRef = React.useRef<HTMLElement>();
  const portRef = React.useRef<HTMLElement>(null);
  const startCoordinatesRef = React.useRef<ICoordinates>({ x: 0, y: 0 });
  const onSizeChangedRef = React.useRef(onSizeChanged);
  const decoratorDragRef = React.useRef({ positive: false, size: 0 });
  const paneSizesRef = React.useRef<Array<number>>(defaultSizes ?? []);

  const [drag, setDrag] = React.useState<IDrag>(defaultDrag);

  const mergedRefs = useMergedRefs(ref, portRef);

  const clearStyles = React.useCallback(() => {
    Helpers.clearSizes(paneRefs.current);
    Helpers.clearSizes(barRefs.current);
  }, []);

  const applyStyles = React.useCallback((isDragging = false) => {
    const sizeTarget = Utils.getSizeTarget(axis);
    if (fluent || !isDragging) {
      const panes = paneRefs.current;
      const bars = barRefs.current;
      const calcBarSize = Utils.getCalcBarSize(paneRefs.current.length, barSize);
      panes.forEach((pane, idx) => { pane.style[sizeTarget] = `calc(${paneSizesRef.current[idx]}% - ${calcBarSize}px)` });
      bars.forEach((bar) => { bar.style[sizeTarget] = barSize + 'px' });
    } else if (decoratorRef.current) {
      const { positive, size: decoratorSize } = decoratorDragRef.current;

      const sideTarget = Utils.getSideTarget(axis);
      const sizeTarget = Utils.getSizeTarget(axis);
      const sideOrigin = Utils.getSideOrigin(axis);

      decoratorRef.current.style[sideOrigin] = positive ? barSize + 'px' : 'auto';
      decoratorRef.current.style[sideTarget] = positive ? 'auto' : barSize + 'px';
      decoratorRef.current.style[sizeTarget] = decoratorSize + 'px';
    }

  }, [axis, barSize, fluent]);

  const resetSizes = React.useCallback(() => {
    paneSizesRef.current = defaultSizes ?? paneRefs.current.map(() => 100 / paneRefs.current.length);
  }, [defaultSizes]);

  const onMoveStart = React.useCallback((event: MoveEvent) => {
    const activeBarIndex = barRefs.current.indexOf(event.target as HTMLElement);
    if (activeBarIndex !== -1 && portRef.current) {
      const start = Utils.getCoordinates(event);
      const portRect = Utils.getRect(portRef.current);
      const offset = { ...Utils.getPointerOffset(event), left: portRect.left, top: portRect.top, right: portRect.right, bottom: portRect.bottom };
      const activeBar = barRefs.current[activeBarIndex];
      const previous = paneRefs.current.indexOf(activeBar.previousSibling as HTMLElement);
      const next = paneRefs.current.indexOf(activeBar.nextSibling as HTMLElement);
      const panes = [...Array(paneRefs.current.length).keys()];
      setDrag({ offset, current: start, activeBarIndex, isDragging: true, panes, pair: [previous, next] });
      startCoordinatesRef.current = start;

      if (event.cancelable) {
        event.preventDefault();
      }
    }
  }, []);

  const onMove = React.useCallback((current: ICoordinates) => {
    setDrag(last => ({ ...last, current }))
  }, []);

  const onMoveEnd = React.useCallback((current: ICoordinates) => {
    setDrag(last => ({ ...last, current, isDragging: false, activeBarIndex: -1 }))
  }, []);

  const onDragChanged = React.useCallback((drag: IDrag) => {
    const { pair, panes } = drag;
    const startPosition = startCoordinatesRef.current[axis];

    if (!portRef.current || drag.current[axis] === startPosition) {
      return false
    }

    const panesCount = panes.length;
    const layout = Utils.getLayout(panes, pair, responsive);
    const sizeTarget = Utils.getSizeTarget(axis);
    const sideOrigin = Utils.getSideOrigin(axis);
    const clientAxis = drag.current[axis];
    const offset = clientAxis - startPosition;
    const portSize = Utils.getPortSize(portRef.current, sizeTarget);
    const minSizes = Utils.getMinSizes(panesCount, minSize, defaultMinSizes);
    const activeBlocks = Utils.getActiveBlocks(layout);
    const sizes = [...paneSizesRef.current];
    const positive = offset >= 0;

    if (fluent || !drag.isDragging) {
      const portOffset = drag.offset[sideOrigin];
      const edges = Utils.getEdges(panes, pair, sizes, minSizes, portSize, barSize, portOffset, responsive);
      const max = Math.max(...edges);
      const min = Math.min(...edges);
      const pointerOffset = drag.offset[axis];
      const newPaneSizes = Utils.getSizes(panes, activeBlocks, sizes, minSizes, portSize, offset, barSize);

      let currentPosition = clientAxis;
      if (currentPosition > max - (barSize - pointerOffset) || currentPosition < min + pointerOffset) {
        currentPosition = positive ? max - (barSize - pointerOffset) : min + pointerOffset
      }

      paneSizesRef.current = newPaneSizes;
      startCoordinatesRef.current[axis] = currentPosition;
    } else {
      const absBlockSizes = Utils.getAbsoluteBlockSizes(portSize, activeBlocks[~~(positive)], panes, sizes, minSizes, barSize);
      decoratorDragRef.current = { positive, size: Math.min(Math.abs(offset), absBlockSizes.availableSize) };
    }

    return true;
  }, [axis, barSize, fluent, minSize, responsive, defaultMinSizes]);

  paneRefs.current = [];
  barRefs.current = [];

  // use callback ref
  React.useEffect(() => {
    onSizeChangedRef.current = onSizeChanged;
  }, [onSizeChanged]);

  // resize if drag changed
  React.useEffect(() => {
    if (onDragChanged(drag)) {
      applyStyles(drag.isDragging);
      if (typeof onSizeChangedRef.current === 'function') {
        onSizeChangedRef.current(paneSizesRef.current);
      }
    }
  }, [drag, onDragChanged, applyStyles]);

  // if children has changed reset sizes and apply styles 
  React.useEffect(() => {
    resetSizes();
    applyStyles(/* false by default, sizes will be applied in this case */);
  }, [children, resetSizes, applyStyles]);

  // clear and apply styles when axis has changed
  React.useEffect(() => {
    clearStyles();
    applyStyles(/* false by default, sizes will be applied in this case */);
  }, [axis, clearStyles, applyStyles]);

  useDragging(drag.isDragging, onMove, onMoveEnd);

  return <Component className={`split-view split-view-${axis} ${className}`} ref={mergedRefs} {...props}>
    {children && Array.isArray(children) ? children.map((pane, idx) => (
      <React.Fragment key={idx}>
        <SplitViewPane ref={(el: HTMLDivElement) => Helpers.addRef(paneRefs, el)}>{pane}</SplitViewPane>
        {idx < children.length - 1 && <SplitViewBar onMoveStart={onMoveStart} className={`${idx === drag.activeBarIndex ? 'active' : ''}`}
          ref={(el: HTMLDivElement) => Helpers.addRef(barRefs, el)}
        >
          {!fluent && drag.isDragging && drag.activeBarIndex === idx && <SplitViewDecorator ref={decoratorRef} />}
        </SplitViewBar>}
      </React.Fragment>
    )) : children}
  </Component>;
});

SplitView.displayName = "SplitView";

export default SplitView;


