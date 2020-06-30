import { CellProps, Row, TableState } from "react-table";
import { DbCardData } from "../../../types/Metadata";
import { TableControlsProps, TableViewRowProps } from "../tables/types";

export interface CardsData extends DbCardData {
  colors: number;
  colorSortVal: string;
  rankSortVal: string;
  rarityVal: number;
  setCode: string;
  owned: number;
  acquired: number;
  wanted: number;
  format: string[];
  banned: string[];
  suspended: string[];
}

export interface CollectionTableProps {
  cachedState?: TableState<CardsData>;
  cachedTableMode: string;
  contextMenuCallback: (cardDiv: HTMLElement, card: DbCardData) => void;
  data: CardsData[];
  exportCallback: (cardIds: string[]) => void;
  modeCallback: (tableMode: string) => void;
  tableStateCallback: (state: TableState<CardsData>) => void;
}

export interface CollectionTableControlsProps
  extends TableControlsProps<CardsData> {
  exportCallback: (cardIds: string[]) => void;
  rows: Row<CardsData>[];
}

export interface CollectionTableRowProps extends TableViewRowProps<CardsData> {
  contextMenuCallback: (cardDiv: HTMLElement, card: DbCardData) => void;
}

export type CollectionTableCellProps = CellProps<CardsData>;

export type QuerySeparators = ">=" | "<=" | ":" | "=" | "!=" | "<" | ">";
export type QueryKeys =
  | "artist"
  | "banned"
  | "colors"
  | "cmc"
  | "format"
  | "is"
  | "name"
  | "rarity"
  | "set"
  | "type"
  | "suspended"
  | "legal";
export type ParsedToken = [string, QuerySeparators, string];

export type FilterModes =
  | "strict"
  | "and"
  | "or"
  | "not"
  | "strictNot"
  | "subset"
  | "superset"
  | "strictSubset"
  | "strictSuperset";

export const RARITY_TOKEN = 1;
export const RARITY_LAND = 2;
export const RARITY_COMMON = 4;
export const RARITY_UNCOMMON = 8;
export const RARITY_RARE = 16;
export const RARITY_MYTHIC = 32;

export type ColorBitsFilter = {
  color: number;
  not: boolean;
  mode: FilterModes;
};

export type RarityBitsFilter = {
  not: boolean;
  mode: QuerySeparators;
  rarity: number;
};

export type ArrayFilter = {
  not: boolean;
  mode: QuerySeparators;
  arr: string[];
};
