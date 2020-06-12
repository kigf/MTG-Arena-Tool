import React from "react";
import { TableData, TableHeadersProps } from "./types";

import sharedCss from "../../../shared/shared.css";
import indexCss from "../../index.css";
import css from "./tables.css";

export default function TableHeaders<D extends TableData>({
  filtersVisible,
  getTableProps,
  gridTemplateColumns,
  style,
  visibleHeaders,
}: TableHeadersProps<D>): JSX.Element {
  return (
    <div
      className={
        sharedCss.medScroll + " " + indexCss.lineDark + " " + css.reactTableHead
      }
      style={{ ...style, gridTemplateColumns }}
      {...getTableProps()}
    >
      {visibleHeaders.map((column, ii) => (
        <div
          {...column.getHeaderProps(column.getSortByToggleProps())}
          style={{
            gridArea: `1 / ${ii + 1} / 1 / ${ii + 2}`,
            cursor: column.disableSortBy ? "default" : "pointer",
          }}
          key={column.id}
        >
          <div className={css.reactTableHeadContainer}>
            <div
              className={
                column.isSorted
                  ? column.isSortedDesc
                    ? " " + indexCss.sortDesc
                    : " " + indexCss.sortAsc
                  : ""
              }
              style={{ marginRight: "4px", width: "16px" }}
            />
            <div className={indexCss.flexItem}>{column.render("Header")}</div>
          </div>
          {column.canFilter && filtersVisible[column.id] && (
            <div
              onClick={(e): void => e.stopPropagation()}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
              title={"filter column"}
            >
              {column.render("Filter")}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
