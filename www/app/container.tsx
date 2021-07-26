import React, { useMemo, useState } from 'react';
import Splitter from '../../src';
import { Axes } from '../../src/types';

const parseFloatOrDefault = (input: string, defaultValue: number) => {
  const parsedValue = parseFloat(input)
  return isNaN(parsedValue) ? defaultValue : parsedValue;
}

const SplitContainer: React.FC = () => {
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(2);
  const [axis, setAxis] = useState<Axes>(Axes.Y);
  const [responsive, setResponsive] = useState(false);
  const [fluent, setFluent] = useState(false);
  const [barSize, setBarSize] = useState(3);

  const grid: Array<Array<number>> = useMemo(() => {
    return [...Array(rows).fill([...Array<number>(columns).keys()])]
  }, [rows, columns]);

  return (
    <div className="wrapper">
      <div className="header">
        <h3 className="header-title">REACT-VIEW-SPLITTER example</h3>
        <div className="links">
          <a className="" title="react-view-splitter" href="https://github.com/ivp-dev/react-view-splitter">
            <svg height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill="grey" fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
          </a>
        </div>
      </div>
      <div className="sidebar">
        <div className="row">
          <div className="col-1">
            <h4 className="lane">Properties</h4>
          </div>
        </div>
        <div className="row">
          <label className="col-2">barSize:</label>
          <div className="col-2">
            <input title="barsize" type="text" value={barSize} onChange={(e) => setBarSize(parseFloatOrDefault(e.target.value, 1))} />
          </div>
        </div>
        <div className="row">
          <label className="col-2">rows:</label>
          <div className="col-2">
            <input title="rows" type="text" value={rows} onChange={(e) => setRows(parseFloatOrDefault(e.target.value, 1))} />
          </div>
        </div>
        <div className="row">
          <label className="col-2">columns:</label>
          <div className="col-2">
            <input title="columns" type="text" value={columns} onChange={(e) => setColumns(parseFloatOrDefault(e.target.value, 1))} />
          </div>
        </div>
        <div className="row">
          <label className="col-2">axis</label>
          <div className="col-2">
            <select title="axis" value={axis} onChange={(e) => setAxis(e.target.value === Axes.X ? Axes.X : Axes.Y)} name="axis" id="axis-selector">
              <option value="x">x</option>
              <option value="y">y</option>
            </select>
          </div>
        </div>
        <div className="row">
          <label className="col-2">fluent:</label>
          <div className="col-2">
            <input title="fluent" type="checkbox" checked={fluent} onChange={() => setFluent(!fluent)} />
          </div>
        </div>
        <div className="row">
          <label className="col-2">responsive:</label>
          <div className="col-2">
            <input title="responsive" type="checkbox" checked={responsive} onChange={() => setResponsive(!responsive)} />
          </div>
        </div>
      </div>
      <div className="container">
        <Splitter className={"view-splitter-example"} responsive={responsive} axis={axis} fluent={fluent} barSize={barSize}>
          {grid.map((row, rdx) => (
            <div key={rdx} className="view-splitter-pane-content">
              <Splitter axis={axis === Axes.X ? Axes.Y : Axes.X} responsive={responsive} fluent={fluent} barSize={barSize} >
                {row.map((cdx) => <div className="view-splitter-pane-content" key={cdx}>{`row: ${rdx}; column: ${cdx}`}</div>)}
              </Splitter>
            </div>
          ))}
        </Splitter>
      </div>
    </div>
  );
}

export default SplitContainer;