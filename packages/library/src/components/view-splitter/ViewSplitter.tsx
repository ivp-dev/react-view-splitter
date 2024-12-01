import React from "react";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { useMove } from "@/hooks/useMove";

import * as utils from "@/utils";
import type { ViewSplitterProps } from "./ViewSplitter.types";
import { defaultClassNamesMap } from "./ViewSplitter.const";
import ViewSplitterPane from "@/components/view-splitter-pane";
import ViewSplitterBar from "@/components/view-splitter-bar";
import ViewSplitterContext from "@/contexts/ViewSplitterContext";
import useMoveTransform from "../../hooks/useMoveTransform";
import useRegisterElement from "../../hooks/useRegisterElement";

const ViewSplitter = React.forwardRef<HTMLDivElement, ViewSplitterProps>(
  (props: ViewSplitterProps, ref) => {
    const {
      dir = "ltr",
      responsive = false,
      fluent = false,
      axis = "x",
      barSize = 2,
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
    const [paneRefs, registerPane] = useRegisterElement();
    const [barRefs, registerBar] = useRegisterElement();
    const portRef = React.useRef<HTMLDivElement>(null);
    const mergedRefs = useMergedRefs(ref, portRef);

    const clearStyles = React.useCallback(() => {
      utils.clearSizes(paneRefs.current);
      utils.clearSizes(barRefs.current);
    }, []);

    const [{ isActive, activeBarIndex, sizes, size, currentSizes }, actions] = useMoveTransform({
      fluent,
      portRef,
      paneRefs,
      defaultSizes,
      modifiers: [
        (args) => {
          const { sizes, size, portRect, initialTranslate, translate } = args;
          const startPosition = initialTranslate[axis];
          if (!portRect || translate[axis] === startPosition) {
            return [sizes, size];
          }

          const { pair, panes, offset, delta } = args;

          const panesCount = panes.length;
          const layout = utils.getLayout(panes, pair, responsive);
          const sizeTarget = utils.getSizeTarget(axis);
          const sideOrigin = utils.getSideOrigin(axis);
          const clientPosition = translate[axis];
          const clientDelta = delta[axis];
          const portSize = portRect[sizeTarget];
          const portSide = portRect[sideOrigin];
          const minSizes = utils.getMinSizes(panesCount, minSize, defaultMinSizes);
          const activeBlocks = utils.getActiveBlocks(layout);
          const positive = clientDelta >= 0;

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
          const pointerOffset = offset[axis];
          const newSizes = utils.getSizes(
            panes,
            activeBlocks,
            sizes,
            minSizes,
            portSize,
            clientDelta,
            barSize
          );

          let currentPosition = clientPosition;
          if (
            currentPosition > max - (barSize - pointerOffset) ||
            currentPosition < min + pointerOffset
          ) {
            currentPosition = positive ? max - (barSize - pointerOffset) : min + pointerOffset;
          }

          return [newSizes, size];
        },
        (args) => {
          const { sizes, size, portRect, initialTranslate, translate } = args;
          const startPosition = initialTranslate[axis];
          if (fluent || !portRect || translate[axis] === startPosition) {
            return [sizes, size];
          }

          const { pair, panes, delta } = args;
          const panesCount = panes.length;
          const layout = utils.getLayout(panes, pair, responsive);
          const sizeTarget = utils.getSizeTarget(axis);
          const clientPosition = translate[axis];
          const clientDelta = delta[axis];
          const portSize = portRect[sizeTarget];
          const minSizes = utils.getMinSizes(panesCount, minSize, defaultMinSizes);
          const activeBlocks = utils.getActiveBlocks(layout);
          const positive = clientDelta >= 0;

          const absBlockSizes = utils.getAbsoluteBlockSizes(
            portSize,
            activeBlocks[~~positive],
            panes,
            sizes,
            minSizes,
            barSize
          );

          const newSize = Math.min(Math.abs(clientPosition), absBlockSizes.availableSize);

          return [sizes, newSize];
        },
      ],
    });

    const { listeners } = useMove({
      onMoveStart: (event) => {
        const activeBarIndex = barRefs.current.indexOf(event.target as HTMLElement);

        if (activeBarIndex >= 0) {
          const activeBar = barRefs.current[activeBarIndex];
          const coordinate = { x: event.clientX, y: event.clientY };
          const barRect = utils.getRect(activeBar);
          const previous = paneRefs.current.indexOf(activeBar.previousSibling as HTMLElement);
          const next = paneRefs.current.indexOf(activeBar.nextSibling as HTMLElement);
          const panes = [...Array(paneRefs.current.length).keys()];
          const offset = { x: coordinate.x - barRect.left, y: coordinate.y - barRect.top };

          actions.start({
            coordinate,
            panes,
            pair: [previous, next],
            offset,
          });
        }
      },
      onMove: (event) => {
        actions.move({
          coordinate: { x: event.clientX, y: event.clientY },
        });
      },
      onMoveEnd: () => {
        const resolvedSizes = fluent ? sizes : currentSizes;
        actions.stop({ sizes: resolvedSizes });
        onSizeChanged?.(resolvedSizes);
      },
    });

    const resolvedClassName = utils.resolveClassName(
      className,
      classNamesMap.base,
      `${classNamesMap.base}--${axis}`
    );

    const viewSplitterContextValue = React.useMemo(
      () => ({ registerPane, registerBar }),
      [registerPane, registerBar]
    );

    console.log(size);

    return (
      <ViewSplitterContext.Provider value={viewSplitterContextValue}>
        <div className={resolvedClassName} ref={mergedRefs} {...other}>
          {children && Array.isArray(children)
            ? children.map((pane, idx) => (
                <React.Fragment key={idx}>
                  <ViewSplitterPane
                    className={classNamesMap.pane}
                    axis={axis}
                    barSize={utils.getCalcBarSize(children.length, barSize)}
                    relativeSize={sizes[idx] ?? 100 / children.length}
                  >
                    {pane}
                  </ViewSplitterPane>
                  {idx < children.length - 1 && (
                    <ViewSplitterBar
                      {...listeners}
                      axis={axis}
                      barSize={barSize}
                      className={utils.resolveClassName(
                        classNamesMap.bar,
                        idx === activeBarIndex ? `${classNamesMap.bar}--active` : ""
                      )}
                    >
                      {!fluent && isActive && activeBarIndex === idx && (
                        <div className={classNamesMap.decorator} />
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
