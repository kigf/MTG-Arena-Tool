import React, { useMemo } from "react";
import { Column, IdType, Row } from "react-table";
import db from "../../../shared/database";
import PagingControls from "../tables/PagingControls";
import TableHeaders from "../tables/TableHeaders";
import { BaseTableProps } from "../tables/types";
import { useBaseReactTable } from "../tables/useBaseReactTable";
import { InBoostersHeader } from "./cells";
import CollectionTableControls, {
  collectionModes,
} from "./CollectionTableControls";
import { inBoostersFilterFn, setFilterFn } from "./filters";
import { CardTileRow } from "./rows";
import { getCollectionStats } from "./collectionStats";
import {
  CardsData,
  CollectionTableControlsProps,
  CollectionTableProps,
} from "./types";
import { useSelector } from "react-redux";
import { AppState } from "../../../shared/redux/stores/rendererStore";

import indexCss from "../../index.css";
import tablesCss from "../tables/tables.css";
import sharedCss from "../../../shared/shared.css";

export default function CollectionTable({
  data,
  contextMenuCallback,
  modeCallback,
  tableStateCallback,
  cachedState,
  cachedTableMode,
  exportCallback,
}: CollectionTableProps): JSX.Element {
  const [tableMode, setTableMode] = React.useState(cachedTableMode);
  const cardSize = useSelector((state: AppState) => state.settings.cards_size);
  const collectionMode = useSelector(
    (state: AppState) => state.settings.collectionMode
  );
  const sortedSetCodes = useMemo(() => db.sortedSetCodes, []);
  React.useEffect(() => modeCallback(tableMode), [tableMode, modeCallback]);

  const customFilterTypes = {
    inBoosters: inBoostersFilterFn,
    set: setFilterFn,
  };

  // Memoize the sort functions only once
  const setSortType = React.useCallback(
    (
      rowA: Row<CardsData>,
      rowB: Row<CardsData>,
      columnId: IdType<CardsData>
    ): 0 | 1 | -1 => {
      const indexDiff =
        sortedSetCodes.indexOf(rowA.values[columnId]) -
        sortedSetCodes.indexOf(rowB.values[columnId]);
      return indexDiff < 0 ? -1 : indexDiff > 0 ? 1 : 0;
    },
    [sortedSetCodes]
  );

  const raritySortType = React.useCallback(
    (
      rowA: Row<CardsData>,
      rowB: Row<CardsData>,
      columnId: IdType<CardsData>
    ): 0 | 1 | -1 => {
      const orderedRarity = [
        "token",
        "land",
        "common",
        "uncommon",
        "rare",
        "mythic",
      ];
      const indexDiff =
        orderedRarity.indexOf(rowA.values[columnId]) -
        orderedRarity.indexOf(rowB.values[columnId]);
      return indexDiff < 0 ? -1 : indexDiff > 0 ? 1 : 0;
    },
    []
  );

  const columns: Column<CardsData>[] = useMemo(
    () => [
      { id: "grpId", accessor: "id" },
      { accessor: "id" },
      { accessor: "dfc" },
      { accessor: "dfcId" },
      {
        Header: "Name",
        accessor: "name",
        disableFilters: false,
        filter: "text",
        defaultVisible: true,
      },
      {
        accessor: "colors",
        disableFilters: false,
        filter: "colorBits",
      },
      {
        accessor: "format",
        filter: "format",
      },
      {
        accessor: "banned",
        filter: "inArray",
      },
      {
        accessor: "suspended",
        filter: "inArray",
      },
      {
        accessor: "is",
        filter: "is",
      },
      {
        Header: "Colors",
        disableFilters: false,
        accessor: "colorSortVal",
        filter: "colors",
        mayToggle: true,
        defaultVisible: true,
      },
      {
        Header: "CMC",
        accessor: "cmc",
        disableFilters: false,
        filter: "minmax",
        mayToggle: true,
        defaultVisible: true,
      },
      {
        Header: "Type",
        accessor: "type",
        disableFilters: false,
        filter: "text",
        mayToggle: true,
      },
      {
        Header: "Set",
        accessor: "set",
        disableFilters: false,
        filter: "array",
        sortType: setSortType,
        sortInverted: true,
        sortDescFirst: true,
        mayToggle: true,
        defaultVisible: true,
      },
      {
        Header: "Rarity",
        disableFilters: false,
        accessor: "rarity",
        filter: "rarity",
        sortType: raritySortType,
        sortDescFirst: true,
        mayToggle: true,
        defaultVisible: true,
      },
      {
        Header: "Owned",
        accessor: "owned",
        disableFilters: false,
        filter: "minmax",
        mayToggle: true,
        defaultVisible: true,
      },
      {
        Header: "Acquired",
        accessor: "acquired",
        disableFilters: false,
        filter: "minmax",
        mayToggle: true,
      },
      {
        Header: "Wanted",
        accessor: "wanted",
        disableFilters: false,
        filter: "minmax",
        mayToggle: true,
      },
      {
        Header: "Artist",
        accessor: "artist",
        disableFilters: false,
        filter: "text",
        mayToggle: true,
      },
      { accessor: "collectible" },
      { accessor: "craftable" },
      {
        Header: InBoostersHeader,
        accessor: "booster",
        disableFilters: false,
        filter: "inBoosters",
        mayToggle: true,
      },
      { accessor: "images" },
      { accessor: "reprints" },
    ],
    [raritySortType, setSortType]
  );
  const tableProps: BaseTableProps<CardsData> = {
    cachedState,
    columns,
    customFilterTypes,
    data,
    globalFilter: undefined,
    setTableMode,
    tableMode,
    tableStateCallback,
  };
  const {
    table,
    gridTemplateColumns,
    headersProps,
    pagingProps,
    tableControlsProps,
  } = useBaseReactTable(tableProps);
  const { getTableBodyProps, page, prepareRow, rows } = table;

  const _stats = useMemo(() => {
    const cardIds = rows.map((row) => row.values.id);
    return getCollectionStats(cardIds);
  }, [rows]);

  const collectionTableControlsProps: CollectionTableControlsProps = {
    exportCallback,
    rows,
    ...tableControlsProps,
  };

  return (
    <>
      <div className={indexCss.wrapperColumn}>
        <div className={tablesCss.reactTableWrap}>
          <CollectionTableControls {...collectionTableControlsProps} />
          {collectionMode === collectionModes[1] ? (
            <div className={sharedCss.medScroll}></div>
          ) : (
            <>
              <div className={sharedCss.medScroll}>
                <TableHeaders
                  {...headersProps}
                  filtersVisible={{}}
                  style={{ overflowX: "auto", overflowY: "hidden" }}
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(auto-fit, minmax(${
                      100 + cardSize * 15 + 12
                    }px, 1fr))`,
                  }}
                  className={tablesCss.reactTableBodyNoAdjust}
                  {...getTableBodyProps()}
                >
                  {page.map((row, index) => {
                    prepareRow(row);
                    return (
                      <CardTileRow
                        key={row.original.id}
                        row={row}
                        index={index}
                        contextMenuCallback={contextMenuCallback}
                        gridTemplateColumns={gridTemplateColumns}
                      />
                    );
                  })}
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                <PagingControls {...pagingProps} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
