import React from "react";
import { TableData, TableViewRowProps } from "./types";

import tableCss from "./tables.css";
import indexCss from "../../index.css";

export function TableViewRow<D extends TableData>({
  row,
  index,
  gridTemplateColumns,
  style,
  className,
  ...otherProps
}: TableViewRowProps<D>): JSX.Element {
  const lineClass = React.useMemo(
    () =>
      index === -1
        ? indexCss.lineLighter
        : index % 2 === 0
        ? indexCss.lineLight
        : indexCss.lineDark,
    [index]
  );
  return (
    <div
      className={
        (className ?? "") + " " + tableCss.reactTableBodyRow + " " + lineClass
      }
      style={{ ...style, gridTemplateColumns }}
      {...otherProps}
    >
      {row.cells.map((cell, ii) => {
        return (
          <div
            className={tableCss.innerDiv}
            {...cell.getCellProps()}
            style={{
              gridArea: `1 / ${ii + 1} / 1 / ${ii + 2}`,
            }}
            key={cell.column.id + "_" + row.index}
          >
            {cell.isAggregated
              ? cell.render("Aggregated")
              : cell.render("Cell")}
          </div>
        );
      })}
    </div>
  );
}
