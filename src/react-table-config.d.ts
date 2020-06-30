import "react-table";

declare module "react-table" {
  // take this file as-is, or comment out the sections that don't apply to your plugin configuration
  interface ColumnInterface<TransactionData> {
    defaultVisiblee?: boolean;
  }

  interface TableOptions<D extends object>
    extends UseExpandedOptions<D>,
      UseFiltersOptions<D>,
      UseGlobalFiltersOptions<D>,
      UseGroupByOptions<D>,
      UsePaginationOptions<D>,
      UseSortByOptions<D>,
      // note that having Record here allows you to add anything to the options, this matches the spirit of the
      // underlying js library, but might be cleaner if it's replaced by a more specific type that matches your
      // feature set, this is a safe default.
      Record<string, any> {}

  interface Hooks<D extends object = {}>
    extends UseExpandedHooks<D>,
      UseGroupByHooks<D>,
      UseSortByHooks<D> {}

  interface TableInstance<D extends object = {}>
    extends UseExpandedInstanceProps<D>,
      UseFiltersInstanceProps<D>,
      UseGlobalFiltersInstanceProps<D>,
      UseGroupByInstanceProps<D>,
      UsePaginationInstanceProps<D>,
      UseSortByInstanceProps<D> {}

  interface TableState<D extends object = {}>
    extends UseExpandedState<D>,
      UseFiltersState<D>,
      UseGlobalFiltersState<D>,
      UseGroupByState<D>,
      UsePaginationState<D>,
      UseSortByState<D> {}

  interface Column<D extends object = {}>
    extends UseTableColumnOptions<D>,
      UseFiltersColumnOptions<D>,
      UseGroupByColumnOptions<D>,
      UseSortByColumnOptions<D> {
    // add custom column property options below
    gridWidth?: string;
    mayToggle?: boolean;
    defaultVisible?: boolean;
    percentFormatOptions?: any;
    divideBy100?: boolean;
    needsTileLabel?: boolean;
    disableFilters?: boolean;
    disableSortBy?: boolean;
  }

  interface ColumnInstance<D extends object = {}>
    extends UseTableColumnProps<D>,
      UseFiltersColumnProps<D>,
      UseGroupByColumnProps<D>,
      UseSortByColumnProps<D>,
      UseTableColumnProps<D> {
    gridWidth?: string;
    mayToggle?: boolean;
    defaultVisible?: boolean;
    percentFormatOptions?: any;
    divideBy100?: boolean;
    needsTileLabel?: boolean;
    disableFilters?: boolean;
    disableSortBy?: boolean;
  }

  interface Cell<D extends object = {}>
    extends UseTableCellProps<D>,
      UseGroupByCellProps<D> {}

  interface Row<D extends object = {}>
    extends UseExpandedRowProps<D>,
      UseGroupByRowProps<D> {}
}
