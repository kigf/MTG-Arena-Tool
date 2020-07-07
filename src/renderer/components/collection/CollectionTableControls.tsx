/* eslint-disable complexity */
import React, { useCallback, useState } from "react";
import _ from "lodash";
import { MediumTextButton } from "../misc/MediumTextButton";
import ColumnToggles from "../tables/ColumnToggles";
import PagingControls from "../tables/PagingControls";
import { CollectionTableControlsProps } from "./types";
import tableCss from "../tables/tables.css";
import { InputContainer } from "../misc/InputContainer";
import getFiltersFromQuery from "./collectionQuery";
import { reduxAction } from "../../../shared/redux/sharedRedux";
import { useDispatch, useSelector } from "react-redux";
import { IPC_ALL, IPC_RENDERER } from "../../../shared/constants";
import { AppState } from "../../../shared/redux/stores/rendererStore";
import ReactSelect from "../../../shared/ReactSelect";
import AdvancedSearch from "../popups/advancedSearch";

export const collectionModes: string[] = ["By Cards View", "By Sets View"];

export default function CollectionTableControls(
  props: CollectionTableControlsProps
): JSX.Element {
  const {
    exportCallback,
    setAllFilters,
    toggleSortBy,
    toggleHideColumn,
    setGlobalFilter,
    pagingProps,
    rows,
    setTogglesVisible,
    toggleableColumns,
    togglesVisible,
  } = props;
  const exportRows = React.useCallback(() => {
    exportCallback(rows.map((row) => row.values.id));
  }, [exportCallback, rows]);
  const dispatcher = useDispatch();
  const collectionQuery = useSelector(
    (state: AppState) => state.settings.collectionQuery
  );
  const collectionMode = useSelector(
    (state: AppState) => state.settings.collectionMode
  );

  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

  const setQuery = useCallback(
    (query: string) => {
      reduxAction(
        dispatcher,
        { type: "SET_SETTINGS", arg: { collectionQuery: query } },
        IPC_ALL ^ IPC_RENDERER
      );
      const filters = getFiltersFromQuery(query || "");
      setGlobalFilter(undefined);
      setAllFilters(filters);
    },
    [dispatcher, setGlobalFilter, setAllFilters]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === "Enter") {
        const query = e.currentTarget.value;
        reduxAction(
          dispatcher,
          { type: "SET_SETTINGS", arg: { collectionQuery: query } },
          IPC_ALL ^ IPC_RENDERER
        );
        setQuery(query);
      }
    },
    [dispatcher, setQuery]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const query = e.currentTarget.value;
      reduxAction(
        dispatcher,
        { type: "SET_SETTINGS", arg: { collectionQuery: query } },
        IPC_ALL ^ IPC_RENDERER
      );
    },
    [dispatcher]
  );

  const setCollectionMode = useCallback(
    (mode: string) => {
      reduxAction(
        dispatcher,
        { type: "SET_SETTINGS", arg: { collectionMode: mode } },
        IPC_ALL ^ IPC_RENDERER
      );
    },
    [dispatcher]
  );

  const resetFilters = useCallback((): void => {
    reduxAction(
      dispatcher,
      { type: "SET_SETTINGS", arg: { collectionQuery: "" } },
      IPC_ALL ^ IPC_RENDERER
    );
    setAllFilters([]);
    toggleSortBy("name", false, false);
    for (const column of toggleableColumns) {
      toggleHideColumn(column.id, !column.defaultVisible);
    }
  }, [
    dispatcher,
    setAllFilters,
    toggleableColumns,
    toggleSortBy,
    toggleHideColumn,
  ]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        color: "var(--color-text)",
        paddingBottom: "4px",
      }}
    >
      <div className={tableCss.reactTableToggles}>
        <ReactSelect
          options={collectionModes}
          current={collectionMode}
          callback={setCollectionMode}
        />
        <MediumTextButton onClick={exportRows}>Export</MediumTextButton>
        <MediumTextButton onClick={resetFilters}>Reset</MediumTextButton>
        <MediumTextButton
          onClick={(): void => setTogglesVisible(!togglesVisible)}
        >
          {togglesVisible ? "Hide" : "Show"} Column Toggles
        </MediumTextButton>
        <MediumTextButton
          onClick={(): void => setAdvancedFiltersOpen(!advancedFiltersOpen)}
        >
          Advanced Filters
        </MediumTextButton>
        {advancedFiltersOpen ? (
          <AdvancedSearch
            defaultQuery={collectionQuery}
            closeCallback={(query: string): void => {
              setAdvancedFiltersOpen(false);
              if (query !== "") {
                setQuery(query);
              }
            }}
          />
        ) : (
          <></>
        )}
      </div>
      <ColumnToggles
        toggleableColumns={toggleableColumns}
        togglesVisible={togglesVisible}
      />
      <div className={tableCss.react_table_search_cont}>
        <InputContainer title="Search">
          <input
            value={collectionQuery || ""}
            placeholder={"Search.."}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </InputContainer>
        {collectionMode == collectionModes[0] ? (
          <PagingControls {...pagingProps} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
