import React from "react";
import Splitter, { type Axes } from "react-view-splitter";
import { type Story, type StoryDefault, useLadleContext } from "@ladle/react";

import "./ViewSplitter.scss";

export default {
  decorators: [(Component) => <Component />],
} satisfies StoryDefault;

export const ViewSplitter: Story<{
  gridCols: number;
  gridRows: number;
  axis: Axes;
  responsive: boolean;
  fluent: boolean;
  barSize: number;
}> = ({ gridRows: rows, gridCols: cols, axis, responsive, fluent, barSize }) => {
  const ladleCtx = useLadleContext();
  const grid: number[][] = React.useMemo(() => {
    return [...Array(rows).fill([...Array<number>(cols).keys()])];
  }, [rows, cols]);

  return (
    <Splitter responsive={responsive} axis={axis} fluent={fluent} barSize={barSize}>
      {grid.map((row, rdx) => (
        <div key={rdx} className="view-splitter-pane-content">
          <Splitter
            axis={axis === "x" ? "y" : "x"}
            responsive={responsive}
            fluent={fluent}
            barSize={barSize}
            dir={ladleCtx.globalState.rtl ? "rtl" : "ltr"}
          >
            {row.map((cdx) => (
              <div
                className="view-splitter-pane-content"
                key={cdx}
              >{`row: ${rdx}; column: ${cdx}`}</div>
            ))}
          </Splitter>
        </div>
      ))}
    </Splitter>
  );
};

ViewSplitter.args = {
  gridCols: 3,
  gridRows: 3,
  axis: "y",
  responsive: false,
  fluent: false,
  barSize: 3,
};

ViewSplitter.argTypes = {
  gridRows: {
    name: "rows",
    control: {
      type: "number",
    },
    defaultValue: 3,
    description: "Number of rows",
  },
  gridCols: {
    name: "columns",
    control: {
      type: "number",
    },
    defaultValue: 3,
    description: "Number of columns",
  },
  axis: {
    options: ["x", "y"],
    control: {
      type: "select",
    },
    defaultValue: "y",
    description: "Splitter axis",
  },
  responsive: {
    control: {
      type: "boolean",
    },
    defaultValue: false,
    description: "Responsive layout",
  },
  fluent: {
    control: {
      type: "boolean",
    },
    defaultValue: false,
    description: "Fluent layout",
  },
  barSize: {
    control: {
      type: "number",
    },
    defaultValue: 3,
    description: "Bar size",
  },
};

ViewSplitter.storyName = "View Splitter";
