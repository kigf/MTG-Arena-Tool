import React from "react";
import { ColumnInstance } from "react-table";
import { CheckboxContainer } from "../misc/CheckboxContainer";
import { TableData } from "./types";

import css from "./tables.css";
import indexCss from "../../index.css";

export default function ColumnToggles<D extends TableData>({
  toggleableColumns,
  togglesVisible,
}: {
  toggleableColumns: ColumnInstance<D>[];
  togglesVisible: boolean;
}): JSX.Element {
  return (
    <div className={css.reactTableToggles}>
      {togglesVisible &&
        toggleableColumns.map((column) => (
          <CheckboxContainer key={column.id}>
            {column.render("Header")}
            <input type="checkbox" {...column.getToggleHiddenProps()} />
            <span className={indexCss.checkmark} />
          </CheckboxContainer>
        ))}
    </div>
  );
}
