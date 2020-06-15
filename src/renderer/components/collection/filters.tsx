import _ from "lodash";
import { Row } from "react-table";
import db from "../../../shared/database";
import { BinaryFilterValue } from "../tables/filters";
import { MultiSelectFilterProps, TableData } from "../tables/types";
import {
  CardsData,
  RARITY_TOKEN,
  RARITY_LAND,
  RARITY_COMMON,
  RARITY_UNCOMMON,
  RARITY_RARE,
  RARITY_MYTHIC,
  ColorBitsFilter,
  RarityBitsFilter,
} from "./types";

export function inBoostersFilterFn(
  rows: Row<CardsData>[],
  _id: string,
  filterValue: BinaryFilterValue
): Row<CardsData>[] {
  return rows.filter((row) =>
    Object.entries(filterValue).some(
      ([code, value]) => value && String(row.original.booster) === code
    )
  );
}

export type SetFilterValue = { [set: string]: boolean };

const defaultSetFilter: SetFilterValue = { other: true };
db.standardSetCodes.forEach((code: string) => (defaultSetFilter[code] = true));

export type SetFilterProps = MultiSelectFilterProps<SetFilterValue>;

export function setFilterFn(
  rows: Row<CardsData>[],
  _id: string,
  filterValue: SetFilterValue
): Row<CardsData>[] {
  const standardSets = new Set(db.standardSetCodes);
  return rows.filter(
    (row) =>
      Object.entries(filterValue).some(
        ([code, value]) => value && row.values.set === code
      ) ||
      (filterValue.other && !standardSets.has(row.values.set))
  );
}

export function colorsBitsFilterFn<D extends TableData>(
  rows: Row<D>[],
  _columnIds: string[],
  filterValue: ColorBitsFilter
): Row<D>[] {
  const F = filterValue.color;
  return rows.filter((row) => {
    const C = row.original.colors;
    let ret: number | boolean = true;
    if (filterValue.mode == "strict") ret = F == C;
    if (filterValue.mode == "and") ret = F & C;
    if (filterValue.mode == "or") ret = F | C;
    if (filterValue.mode == "not") ret = ~F;
    if (filterValue.mode == "strictNot") ret = F !== C;
    if (filterValue.mode == "subset") ret = (F | C) == F;
    if (filterValue.mode == "strictSubset") ret = (F | C) == F && C !== F;
    if (filterValue.mode == "superset") ret = (F & C) == F;
    if (filterValue.mode == "strictSuperset") ret = (F & C) == F && C !== F;
    return filterValue.not ? !ret : ret;
  });
}

export function rarityFilterFn<D extends TableData>(
  rows: Row<D>[],
  _columnIds: string[],
  filterValue: RarityBitsFilter
): Row<D>[] {
  const F = filterValue.rarity;
  return rows.filter((row) => {
    let R = 0;
    switch (row.original.rarity) {
      case "token":
        R = RARITY_TOKEN;
        break;
      case "land":
        R = RARITY_LAND;
        break;
      case "common":
        R = RARITY_COMMON;
        break;
      case "uncommon":
        R = RARITY_UNCOMMON;
        break;
      case "rare":
        R = RARITY_RARE;
        break;
      case "mythic":
        R = RARITY_MYTHIC;
        break;
    }
    let ret: number | boolean = true;
    if (filterValue.mode == "=") ret = F === R;
    if (filterValue.mode == ":") ret = F & R;
    if (filterValue.mode == "!=") ret = F !== R;
    if (filterValue.mode == "<=") ret = F <= R;
    if (filterValue.mode == "<") ret = F <= R;
    if (filterValue.mode == ">=") ret = F >= R;
    if (filterValue.mode == ">") ret = F > R;
    return filterValue.not ? !ret : ret;
  });
}
