import React, { useMemo } from "react";
import { Column, IdType, Row } from "react-table";
import db from "../../../shared/database";
import PagingControls from "../tables/PagingControls";
import TableHeaders from "../tables/TableHeaders";
import { BaseTableProps } from "../tables/types";
import { useBaseReactTable } from "../tables/useBaseReactTable";
import { InBoostersHeader } from "./cells";
import CollectionTableControls from "./CollectionTableControls";
import { inBoostersFilterFn, rarityFilterFn, setFilterFn } from "./filters";
import { CardTileRow } from "./rows";
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
  tableModeCallback,
  tableStateCallback,
  cachedState,
  cachedTableMode,
  exportCallback,
}: CollectionTableProps): JSX.Element {
  const [tableMode, setTableMode] = React.useState(cachedTableMode);
  const cardSize = useSelector((state: AppState) => state.settings.cards_size);
  const sortedSetCodes = useMemo(() => db.sortedSetCodes, []);
  React.useEffect(() => tableModeCallback(tableMode), [
    tableMode,
    tableModeCallback,
  ]);

  const customFilterTypes = {
    inBoosters: inBoostersFilterFn,
    rarity: rarityFilterFn,
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
      const orderedRarity = ["land", "common", "uncommon", "rare", "mythic"];
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
        canFilter: false,
        defaultVisible: true,
      },
      { accessor: "colors" },
      {
        Header: "Colors",
        canFilter: false,
        accessor: "colorSortVal",
        mayToggle: true,
        defaultVisible: true,
      },
      {
        Header: "CMC",
        accessor: "cmc",
        canFilter: false,
        mayToggle: true,
        defaultVisible: true,
      },
      {
        Header: "Type",
        accessor: "type",
        canFilter: false,
        mayToggle: true,
      },
      {
        Header: "Set",
        accessor: "set",
        canFilter: false,
        sortType: setSortType,
        sortInverted: true,
        sortDescFirst: true,
        mayToggle: true,
        defaultVisible: true,
      },
      {
        Header: "Rarity",
        canFilter: false,
        accessor: "rarity",
        sortType: raritySortType,
        sortDescFirst: true,
        mayToggle: true,
        defaultVisible: true,
      },
      {
        Header: "Owned",
        accessor: "owned",
        canFilter: false,
        mayToggle: true,
        defaultVisible: true,
      },
      {
        Header: "Acquired",
        accessor: "acquired",
        canFilter: false,
        mayToggle: true,
      },
      {
        Header: "Wanted",
        accessor: "wanted",
        canFilter: false,
        mayToggle: true,
      },
      {
        Header: "Artist",
        accessor: "artist",
        canFilter: false,
        mayToggle: true,
      },
      { accessor: "collectible" },
      { accessor: "craftable" },
      {
        Header: InBoostersHeader,
        accessor: "booster",
        canFilter: false,
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
          <div className={sharedCss.medScroll}>
            <TableHeaders
              {...headersProps}
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
          <PagingControls {...pagingProps} />
        </div>
      </div>
    </>
  );
}
