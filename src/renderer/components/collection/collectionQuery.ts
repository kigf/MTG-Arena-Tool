/* eslint-disable complexity */
import _ from "lodash";
import { Filters } from "react-table";
import Colors from "../../../shared/colors";
import { WHITE, BLUE, RED, BLACK, GREEN } from "../../../shared/constants";
import { objectClone } from "../../../shared/utils/objectClone";
import { StringFilter } from "../tables/filters";
import {
  ParsedToken,
  QuerySeparators,
  QueryKeys,
  RarityBitsFilter,
  RARITY_TOKEN,
  RARITY_LAND,
  RARITY_COMMON,
  RARITY_UNCOMMON,
  RARITY_RARE,
  RARITY_MYTHIC,
  CardsData,
  ColorBitsFilter,
} from "./types";

/**
 * Matches a query string and returns an array to be used in the filters converter
 * @param filterValue Query string
 */
function parseFilterValue(filterValue: string): ParsedToken[] {
  const exp = /(?<normal>(?<tok>[^\s"]+)(?<sep>\b[>=|<=|:|=|!=|>|<]{1,2})(?<val>[^\s"]+))|(?<quoted>(?<qtok>[^\s"]+)(?<qsep>\b[>=|<=|:|=|!=|>|<]{1,2})(?<qval>"[^"]*"))|(?<name>([^\s"]+))|(?<qname>("[^"]*"+))/;
  const filterPattern = new RegExp(exp, "g");

  let match;
  const results: ParsedToken[] = [];
  while ((match = filterPattern.exec(filterValue))) {
    console.log("filterPattern match: ", match.groups);
    let token, separator: QuerySeparators | undefined, value;
    if (match.groups?.normal) {
      token = match.groups.tok;
      separator = match.groups.sep as QuerySeparators;
      value = match.groups.val;
    } else if (match.groups?.quoted) {
      token = match.groups.qtok;
      separator = match.groups.qsep as QuerySeparators;
      value = match.groups.qval.slice(1, -1);
    } else if (match.groups?.name) {
      token = "name";
      separator = ":";
      value = match.groups.name;
    } else if (match.groups?.qname) {
      token = "name";
      separator = ":";
      value = match.groups.qname.slice(1, -1);
    }
    if (token && separator && value) {
      results.push([token, separator, value]);
    }
  }
  return results;
}

const defaultFilters = {
  name: {
    string: "",
    not: false,
  } as StringFilter,
  type: {
    string: "",
    not: false,
  } as StringFilter,
  artist: {
    string: "",
    not: false,
  } as StringFilter,
  set: {
    string: "",
    not: false,
  } as StringFilter,
  format: {
    string: "",
    not: false,
  } as StringFilter,
  banned: {
    string: "",
    not: false,
  } as StringFilter,
  legal: {
    string: "",
    not: false,
  } as StringFilter,
  suspended: {
    string: "",
    not: false,
  } as StringFilter,
  cmc: [undefined, undefined] as [undefined | number, undefined | number],
  colors: {
    color: 0,
    not: false,
    mode: "or",
  } as ColorBitsFilter,
  rarity: {
    not: false,
    mode: ":",
    rarity: 0,
  } as RarityBitsFilter,
};

type DefaultFilters = typeof defaultFilters;

const tokenToKeys: Record<string, QueryKeys | undefined> = {
  name: "name",
  t: "type",
  type: "type",
  m: "colors",
  c: "colors",
  mana: "colors",
  cmc: "cmc",
  r: "rarity",
  rarity: "rarity",
  a: "artist",
  artist: "artist",
  s: "set",
  set: "set",
  f: "format",
  legal: "legal",
  format: "format",
  banned: "banned",
  suspended: "suspended",
};

/**
 * Returns the default filters modified with the current query such as key + separator + value
 * @param key accessor in the table
 * @param isNegative should invert the result?
 * @param separator :, <, >, >=, <=, !=, =
 * @param val value to sarch
 */
function getTokenVal(
  key: QueryKeys,
  isNegative: boolean,
  separator: QuerySeparators,
  val: string
): DefaultFilters {
  const filters = objectClone(defaultFilters);
  val = val.toLowerCase();
  switch (key) {
    case "name":
      if (separator === "=" || separator === ":") filters.name.string = val;
      filters.name.not = isNegative;
      break;
    case "type":
      if (separator === "=" || separator === ":") filters.type.string = val;
      filters.type.not = isNegative;
      break;
    case "artist":
      if (separator === "=" || separator === ":") filters.artist.string = val;
      filters.artist.not = isNegative;
      break;
    case "set":
      if (separator === "=" || separator === ":") filters.set.string = val;
      filters.set.not = isNegative;
      break;
    case "format":
      if (separator === "=" || separator === ":") filters.format.string = val;
      filters.format.not = isNegative;
      break;
    case "banned":
      if (separator === "=" || separator === ":") filters.banned.string = val;
      filters.banned.not = isNegative;
      break;
    case "suspended":
      if (separator === "=" || separator === ":")
        filters.suspended.string = val;
      filters.suspended.not = isNegative;
      break;
    case "legal":
      if (separator === "=" || separator === ":") {
        filters.format.string = val;
        filters.suspended.string = val;
        filters.suspended.not = true;
        filters.banned.string = val;
        filters.banned.not = true;
      }
      break;
    case "rarity":
      filters.rarity.not = isNegative;
      let rarity = 0;
      switch (val) {
        case "token":
          rarity = RARITY_TOKEN;
          break;
        case "land":
          rarity = RARITY_LAND;
          break;
        case "common":
          rarity = RARITY_COMMON;
          break;
        case "uncommon":
          rarity = RARITY_UNCOMMON;
          break;
        case "rare":
          rarity = RARITY_RARE;
          break;
        case "mythic":
          rarity = RARITY_MYTHIC;
          break;
      }
      filters.rarity.mode = separator;
      filters.rarity.rarity = rarity;
      break;
    case "cmc":
      const intVal = parseInt(val);
      if (separator === "=" || separator === ":") {
        filters.cmc[0] = intVal;
        filters.cmc[1] = intVal;
      }
      if (separator === ">") {
        filters.cmc[0] = intVal + 1;
        filters.cmc[1] = undefined;
      }
      if (separator === "<") {
        filters.cmc[0] = undefined;
        filters.cmc[1] = intVal - 1;
      }
      if (separator === ">=") {
        filters.cmc[0] = intVal;
        filters.cmc[1] = undefined;
      }
      if (separator === "<=") {
        filters.cmc[0] = undefined;
        filters.cmc[1] = intVal;
      }
      break;
    case "colors":
      const str = val;
      let addW = false;
      let addU = false;
      let addB = false;
      let addR = false;
      let addG = false;

      if (str == "azorious") {
        addW = true;
        addU = true;
      } else if (str == "dimir") {
        addU = true;
        addB = true;
      } else if (str == "rakdos") {
        addB = true;
        addR = true;
      } else if (str == "gruul") {
        addR = true;
        addG = true;
      } else if (str == "selesnya") {
        addW = true;
        addG = true;
      } else if (str == "orzhov") {
        addW = true;
        addB = true;
      } else if (str == "izzet") {
        addU = true;
        addR = true;
      } else if (str == "golgari") {
        addB = true;
        addG = true;
      } else if (str == "boros") {
        addW = true;
        addR = true;
      } else if (str == "simic") {
        addU = true;
        addG = true;
      } else if (str == "esper") {
        addW = true;
        addU = true;
        addB = true;
      } else if (str == "grixis") {
        addU = true;
        addB = true;
        addR = true;
      } else if (str == "jund") {
        addB = true;
        addR = true;
        addG = true;
      } else if (str == "naya") {
        addW = true;
        addR = true;
        addG = true;
      } else if (str == "bant") {
        addW = true;
        addU = true;
        addG = true;
      } else if (str == "mardu") {
        addW = true;
        addB = true;
        addR = true;
      } else if (str == "temur") {
        addU = true;
        addR = true;
        addG = true;
      } else if (str == "abzan") {
        addW = true;
        addB = true;
        addG = true;
      } else if (str == "jeskai") {
        addW = true;
        addU = true;
        addR = true;
      } else if (str == "sultai") {
        addU = true;
        addB = true;
        addG = true;
      } else if (str == "white") addW = true;
      else if (str == "blue") addU = true;
      else if (str == "black") addB = true;
      else if (str == "red") addR = true;
      else if (str == "green") addG = true;
      else {
        if (str.indexOf("w") !== -1) addW = true;
        if (str.indexOf("u") !== -1) addU = true;
        if (str.indexOf("b") !== -1) addB = true;
        if (str.indexOf("r") !== -1) addR = true;
        if (str.indexOf("g") !== -1) addG = true;
      }

      const col = new Colors();
      const arr = [];
      addW && arr.push(WHITE);
      addU && arr.push(BLUE);
      addB && arr.push(BLACK);
      addR && arr.push(RED);
      addG && arr.push(GREEN);
      col.addFromArray(arr);
      filters.colors.color = col.getBits();
      filters.colors.not = isNegative;
      if (separator == "=") filters.colors.mode = "strict";
      if (separator == "!=") filters.colors.mode = "strictNot";
      if (separator == ":") filters.colors.mode = "and";
      if (separator == "<") filters.colors.mode = "strictSubset";
      if (separator == "<=") filters.colors.mode = "subset";
      if (separator == ">") filters.colors.mode = "strictSuperset";
      if (separator == ">=") filters.colors.mode = "superset";
      break;
  }

  return filters;
}

/**
 * Returns an array of filters to be used in the table based on a query string.
 * Query Syntaxt should attemp to mimic Scryfall's;
 * https://scryfall.com/docs/syntax
 * @param query query string
 */
export default function getFiltersFromQuery(query: string): Filters<CardsData> {
  const filters: Filters<CardsData> = [];
  const results = parseFilterValue(query);
  //console.log(results);
  let keysAdded = 0;
  results.map((match: any) => {
    const [tokenKey, separator, tokenVal] = match;
    const isNeg = tokenKey.startsWith("-");
    const nKey = tokenKey.startsWith("-") ? tokenKey.slice(1) : tokenKey;
    const key = tokenToKeys[nKey] || undefined;
    if (key) {
      const defaultModified = getTokenVal(
        key as QueryKeys,
        isNeg,
        separator,
        tokenVal
      );
      //console.log(defaultModified);
      Object.keys(defaultModified)
        .filter((id) => {
          return !_.isEqual(
            defaultModified[id as QueryKeys],
            defaultFilters[id as QueryKeys]
          );
        })
        .map((id) => {
          const newValue = defaultModified[id as QueryKeys];
          keysAdded++;
          filters.push({ id, value: newValue });
        });
    }
  });

  if (keysAdded == 0) {
    filters.push({ id: "name", value: query });
  }

  return filters;
}
