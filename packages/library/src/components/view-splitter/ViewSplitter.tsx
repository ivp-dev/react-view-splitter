import React, { useCallback } from "react";

import type { IDrag, IOffset } from "@/types";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { useMove } from "@/hooks/useMove";

import * as utils from "@/utils";
import type { ViewSplitterProps } from "./ViewSplitter.types";
import { defaultClassNamesMap, defaultDrag } from "./ViewSplitter.const";
import ViewSplitterPane from "@/components/view-splitter-pane";
import ViewSplitterBar from "@/components/view-splitter-bar";
import ViewSplitterContext from "@/contexts/ViewSplitterContext";
import { useRect } from "@/hooks/useRect";

const ViewSplitter = React.forwardRef<HTMLDivElement, ViewSplitterProps>(
  (props: ViewSplitterProps, ref) => {
    const {
      dir = "ltr",
      responsive = false,
      fluent = false,
      axis = "x",
      barSize = 1,
      minSize = 0,
      className,
      sizes: defaultSizes,
      minSizes: defaultMinSizes,
      onSizeChanged,
      children,
      classNamesMap = defaultClassNamesMap,
      ...other
    } = props;
    const isRtl = dir === "rtl" && axis === "x";
    const barRefs = React.useRef<HTMLElement[]>([]);
    const registerBar = useCallback((bar: HTMLElement) => {
      barRefs.current.push(bar);
      return () => {
        const idx = barRefs.current.indexOf(bar);
        if (idx !== -1) {
          barRefs.current.splice(idx, 1);
        }
      };
    }, []);

    const paneRefs = React.useRef<HTMLElement[]>([]);
    const registerPane = useCallback((pane: HTMLElement) => {
      paneRefs.current.push(pane);
      return () => {
        const idx = paneRefs.current.indexOf(pane);
        if (idx !== -1) {
          paneRefs.current.splice(idx, 1);
        }
      };
    }, []);

    const decoratorRef = React.useRef<HTMLDivElement>(null);
    const portRef = React.useRef<HTMLDivElement>(null);
    const decoratorDragRef = React.useRef({ positive: false, size: 0 });
    const paneSizesRef = React.useRef<number[]>(defaultSizes ?? []);

    const [drag, setDrag] = React.useState<IDrag>(defaultDrag);
    const portRect = useRect(drag.isDragging ? portRef.current : null);

    const updateDrag = (drag: IDrag) => {
      setDrag(drag);
      if (applyDrag(drag)) {
        applyStyles(drag.isDragging);
        onSizeChanged?.(paneSizesRef.current);
      }
    };

    const mergedRefs = useMergedRefs(ref, portRef);

    const clearStyles = React.useCallback(() => {
      utils.clearSizes(paneRefs.current);
      utils.clearSizes(barRefs.current);
    }, []);

    const { listeners } = useMove({
      onMoveStart: (event) => {
        const activeBarIndex = barRefs.current.indexOf(event.target as HTMLElement);

        if (activeBarIndex !== -1) {
          const activeBar = barRefs.current[activeBarIndex];
          const start = { x: event.clientX, y: event.clientY };
          const barRect = utils.getRect(activeBar);

          const offset: IOffset = {
            x: event.clientX - barRect.left,
            y: event.clientY - barRect.top,
          };

          const previous = paneRefs.current.indexOf(activeBar.previousSibling as HTMLElement);
          const next = paneRefs.current.indexOf(activeBar.nextSibling as HTMLElement);
          const panes = [...Array(paneRefs.current.length).keys()];

          updateDrag({
            start,
            offset,
            current: start,
            activeBarIndex,
            isDragging: true,
            panes,
            pair: [previous, next],
          });
        }
      },
      onMove: (event) => {
        updateDrag({
          ...drag,
          current: { x: event.clientX, y: event.clientY },
        });
      },
      onMoveEnd: (event) => {
        updateDrag({
          ...drag,
          current: { x: event.clientX, y: event.clientY },
          isDragging: false,
          activeBarIndex: -1,
        });
      },
    });

    const applyStyles = React.useCallback(
      (isDragging = false) => {
        if (fluent || !isDragging) {
          const sizeTarget = utils.getSizeTarget(axis);
          const panes = paneRefs.current;
          const bars = barRefs.current;
          const calcBarSize = utils.getCalcBarSize(paneRefs.current.length, barSize);
          panes.forEach((pane, idx) => {
            pane.style[sizeTarget] = `calc(${paneSizesRef.current[idx]}% - ${calcBarSize}px)`;
          });
          bars.forEach((bar) => {
            bar.style[sizeTarget] = barSize + "px";
          });
        } else if (decoratorRef.current) {
          const { positive, size: decoratorSize } = decoratorDragRef.current;

          const sideTarget = utils.getSideTarget(axis);
          const sideOrigin = utils.getSideOrigin(axis);
          const sizeTarget = utils.getSizeTarget(axis);
          decoratorRef.current.style[sideOrigin] = positive ? barSize + "px" : "auto";
          decoratorRef.current.style[sideTarget] = positive ? "auto" : barSize + "px";
          decoratorRef.current.style[sizeTarget] = decoratorSize + "px";
        }
      },
      [axis, barSize, fluent]
    );

    const resetSizes = React.useCallback(() => {
      paneSizesRef.current =
        defaultSizes ?? paneRefs.current.map(() => 100 / paneRefs.current.length);
    }, [defaultSizes]);

    const applyDrag = (drag: IDrag) => {
      const { pair, panes } = drag;
      const startPosition = drag.start[axis];

      if (!portRect || drag.current[axis] === startPosition) {
        return false;
      }

      const panesCount = panes.length;
      const layout = utils.getLayout(panes, pair, responsive);
      const sizeTarget = utils.getSizeTarget(axis);
      const sideOrigin = utils.getSideOrigin(axis);
      const clientAxis = drag.current[axis];
      const offset = clientAxis - startPosition;
      const portSize = portRect[sizeTarget];
      const portSide = portRect[sideOrigin];
      const minSizes = utils.getMinSizes(panesCount, minSize, defaultMinSizes);
      const activeBlocks = utils.getActiveBlocks(layout);
      const sizes = paneSizesRef.current;
      const positive = offset >= 0;

      if (fluent || !drag.isDragging) {
        const edges = utils.getEdges(
          panes,
          pair,
          sizes,
          minSizes,
          portSize,
          barSize,
          portSide,
          responsive
        );
        const max = Math.max(...edges);
        const min = Math.min(...edges);
        const pointerOffset = drag.offset[axis];
        const newPaneSizes = utils.getSizes(
          panes,
          activeBlocks,
          sizes,
          minSizes,
          portSize,
          offset,
          barSize,
          isRtl
        );

        let currentPosition = clientAxis;
        if (
          currentPosition > max - (barSize - pointerOffset) ||
          currentPosition < min + pointerOffset
        ) {
          currentPosition = positive ? max - (barSize - pointerOffset) : min + pointerOffset;
        }

        paneSizesRef.current = newPaneSizes;
        drag.start[axis] = currentPosition;
      } else {
        const absBlockSizes = utils.getAbsoluteBlockSizes(
          portSize,
          activeBlocks[~~positive],
          panes,
          sizes,
          minSizes,
          barSize
        );

        decoratorDragRef.current = {
          positive,
          size: Math.min(Math.abs(offset), absBlockSizes.availableSize),
        };
      }

      return true;
    };

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

    const resolvedClassName = utils.resolveClassName(
      className,
      classNamesMap.base,
      `${classNamesMap.base}--${axis}`
    );

    const viewSplitterContextValue = React.useMemo(
      () => ({
        registerPane,
        registerBar,
      }),
      [registerPane, registerBar]
    );

    return (
      <ViewSplitterContext.Provider value={viewSplitterContextValue}>
        <div className={resolvedClassName} ref={mergedRefs} {...other}>
          {children && Array.isArray(children)
            ? children.map((pane, idx) => (
                <React.Fragment key={idx}>
                  <ViewSplitterPane className={classNamesMap.pane}>{pane}</ViewSplitterPane>
                  {idx < children.length - 1 && (
                    <ViewSplitterBar
                      {...listeners}
                      className={utils.resolveClassName(
                        classNamesMap.bar,
                        idx === drag.activeBarIndex ? `${classNamesMap.bar}--active` : ""
                      )}
                    >
                      {!fluent && drag.isDragging && drag.activeBarIndex === idx && (
                        <div ref={decoratorRef} className={classNamesMap.decorator} />
                      )}
                    </ViewSplitterBar>
                  )}
                </React.Fragment>
              ))
            : children}
        </div>
      </ViewSplitterContext.Provider>
    );
  }
);

ViewSplitter.displayName = "ViewSplitter";

export default ViewSplitter;
