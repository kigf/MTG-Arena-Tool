import _ from "lodash";
import { Row } from "react-table";
import db from "../../../shared/database";
import { BinaryFilterValue } from "../tables/filters";
import { MultiSelectFilterProps } from "../tables/types";
import { CardsData } from "./types";

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

export type RarityFilterKeys =
  | "common"
  | "uncommon"
  | "rare"
  | "mythic"
  | "land";

export type RarityFilterValue = { [key in RarityFilterKeys]: boolean };

export type RarityFilterProps = MultiSelectFilterProps<RarityFilterValue>;

export function rarityFilterFn(
  rows: Row<CardsData>[],
  _id: string,
  filterValue: RarityFilterValue
): Row<CardsData>[] {
  return rows.filter((row) =>
    Object.entries(filterValue).some(
      ([code, value]) => value && row.values.rarity === code
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
