/* eslint-disable @typescript-eslint/camelcase */
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import { MatchPlayer } from "../types/currentMatch";
import { CardObject, InternalDeck, v2cardsList } from "../types/Deck";
import { InternalPlayer } from "../types/match";
import { InternalRankData } from "../types/rank";

import { FACE_DFC_FRONT, FORMATS } from "./constants";
import db from "./database";

export function getReadableFormat(format: string): string {
  if (format in FORMATS) {
    return FORMATS[format];
  }
  return format || "Unknown";
}

// REVIEW
// All instances using this should use Deck and CardsList classes instead
export function removeDuplicates(decklist: v2cardsList): v2cardsList {
  const newList: v2cardsList = [];
  try {
    decklist.forEach(function (card: CardObject) {
      const cname = db.card(card.id)?.name;
      let added = false;
      newList.forEach(function (c) {
        const cn = db.card(c.id)?.name;
        if (cn == cname) {
          if (c.quantity !== 9999) {
            c.quantity += card.quantity;
          }
          if (c.chance != undefined) {
            c.chance += card.chance || 0;
          }
          added = true;
        }
      });

      if (!added) {
        newList.push(card);
      }
    });
    return newList;
  } catch (e) {
    return [];
  }
}

export function get_set_code(set: string): string {
  if (set == undefined) return "";
  let s = db.sets[set].code;
  if (s == undefined) s = set;
  return s;
}

export function getRaritySortValue(rarity: string): number {
  rarity = rarity.toLowerCase();
  switch (rarity) {
    case "land":
      return 5;
    case "common":
      return 4;
    case "uncommon":
      return 3;
    case "rare":
      return 2;
    case "mythic":
      return 1;
    default:
      return 0;
  }
}

export function collectionSortRarity(a: number, b: number): number {
  const aObj = db.card(a);
  const bObj = db.card(b);

  if (!aObj) return 1;
  if (!bObj) return -1;

  if (getRaritySortValue(aObj.rarity) < getRaritySortValue(bObj.rarity))
    return -1;
  if (getRaritySortValue(aObj.rarity) > getRaritySortValue(bObj.rarity))
    return 1;

  if (aObj.set < bObj.set) return -1;
  if (aObj.set > bObj.set) return 1;

  if (parseInt(aObj.cid) < parseInt(bObj.cid)) return -1;
  if (parseInt(aObj.cid) > parseInt(bObj.cid)) return 1;
  return 0;
}

export function get_deck_export(deck: InternalDeck): string {
  let str = "";
  deck.mainDeck = removeDuplicates(deck.mainDeck);
  deck.mainDeck.forEach(function (card) {
    let grpid = card.id;
    let cardObj = db.card(grpid);

    if (cardObj?.set == "Mythic Edition") {
      // This is awful..
      grpid =
        cardObj.reprints && cardObj.reprints !== true ? cardObj.reprints[0] : 0;
      cardObj = db.card(grpid);
    }

    if (cardObj == undefined) return;
    if (cardObj.dfc == FACE_DFC_FRONT) return;

    const card_name = cardObj.name;
    let card_set = cardObj.set;
    const card_cn = cardObj.cid;
    let card_q = card.quantity;
    if (card_q == 9999) card_q = 1;

    try {
      card_set = db.sets[card_set].arenacode;
      str +=
        card_q + " " + card_name + " (" + card_set + ") " + card_cn + "\r\n";
    } catch (e) {
      str +=
        card_q +
        " " +
        card_name +
        " (" +
        get_set_code(card_set) +
        ") " +
        card_cn +
        "\r\n";
    }
  });

  str += "\r\n";

  deck.sideboard = removeDuplicates(deck.sideboard);
  deck.sideboard.forEach(function (card) {
    let grpid = card.id;
    let cardObj = db.card(grpid);

    if (cardObj?.set == "Mythic Edition") {
      grpid =
        cardObj.reprints && cardObj.reprints !== true ? cardObj.reprints[0] : 0;
      cardObj = db.card(grpid);
    }

    if (cardObj == undefined) return;
    if (cardObj.dfc == FACE_DFC_FRONT) return;

    const card_name = cardObj.name;
    let card_set = cardObj.set;
    const card_cn = cardObj.cid;
    let card_q = card.quantity;
    if (card_q == 9999) card_q = 1;

    try {
      card_set = db.sets[card_set].arenacode;
      str +=
        card_q + " " + card_name + " (" + card_set + ") " + card_cn + "\r\n";
    } catch (e) {
      str +=
        card_q +
        " " +
        card_name +
        " (" +
        get_set_code(card_set) +
        ") " +
        card_cn +
        "\r\n";
    }
  });

  return str;
}

export function get_deck_export_txt(deck: InternalDeck): string {
  let str = "";
  deck.mainDeck = removeDuplicates(deck.mainDeck);
  deck.mainDeck.forEach(function (card) {
    const grpid = card.id;
    const card_name = db.card(grpid)?.name;
    //var card_set = db.card(grpid).set;
    //var card_cn = db.card(grpid).cid;

    str +=
      (card.quantity == 9999 ? 1 : card.quantity) + " " + card_name + "\r\n";
  });

  str += "\r\n";

  deck.sideboard = removeDuplicates(deck.sideboard);
  deck.sideboard.forEach(function (card) {
    const grpid = card.id;
    const card_name = db.card(grpid)?.name;
    //var card_set = db.card(grpid).set;
    //var card_cn = db.card(grpid).cid;

    str +=
      (card.quantity == 9999 ? 1 : card.quantity) + " " + card_name + "\r\n";
  });

  return str;
}

export function timeSince(
  _date: number,
  options?: {
    addSuffix?: boolean;
    unit?: "second" | "minute" | "hour" | "day" | "month" | "year";
    roundingMethod?: "floor" | "ceil" | "round";
    locale?: Locale;
  }
): string {
  // https://date-fns.org/v2.8.1/docs/formatDistanceStrict
  return formatDistanceStrict(_date, new Date(), options);
}

export function replaceAll(str: string, find: string, replace: string): string {
  return str.replace(new RegExp(find, "g"), replace);
}

export function urlDecode(url: string): string {
  return decodeURIComponent(url.replace(/\+/g, " "));
}

export function makeId(length: number): string {
  let ret = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++)
    ret += possible.charAt(Math.floor(Math.random() * possible.length));

  return ret;
}

export function timestamp(): number {
  return Math.floor(Date.now() / 1000);
}

function getTwoDigitString(val: number): string {
  return (val < 10 ? "0" : "") + val;
}

export function toMMSS(sec_num: number): string {
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor((sec_num - hours * 3600) / 60);
  const seconds = sec_num - hours * 3600 - minutes * 60;
  const minutesStr = getTwoDigitString(minutes);
  const secondsStr = getTwoDigitString(seconds);
  if (hours > 0) {
    return hours + ":" + minutesStr + ":" + secondsStr;
  } else {
    return minutes + ":" + secondsStr;
  }
}

export function toDDHHMMSS(sec_num: number): string {
  const dd = Math.floor(sec_num / 86400);
  const hh = Math.floor((sec_num - dd * 86400) / 3600);
  const mm = Math.floor((sec_num - dd * 86400 - hh * 3600) / 60);
  const ss = sec_num - dd * 86400 - hh * 3600 - mm * 60;

  const days = dd + (dd > 1 ? " days" : " day");
  const hours = hh + (hh > 1 ? " hours" : " hour");
  const minutes = mm + (mm > 1 ? " minutes" : " minute");
  const seconds = ss + (ss > 1 ? " seconds" : " second");

  return `${dd > 0 ? days + ", " : ""}
${hh > 0 ? hours + ", " : ""}
${minutes}, 
${seconds}`;
}

export function toHHMMSS(sec_num: number): string {
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor((sec_num - hours * 3600) / 60);
  const seconds = sec_num - hours * 3600 - minutes * 60;
  const hoursStr = getTwoDigitString(hours);
  const minutesStr = getTwoDigitString(minutes);
  const secondsStr = getTwoDigitString(seconds);
  return hoursStr + ":" + minutesStr + ":" + secondsStr;
}

export function toHHMM(sec_num: number): string {
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor((sec_num - hours * 3600) / 60);
  const hoursStr = getTwoDigitString(hours);
  const minutesStr = getTwoDigitString(minutes);
  return hoursStr + ":" + minutesStr;
}

export function add(a: number, b: number): number {
  return a + b;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function objectClone(originalObject: unknown): any {
  return JSON.parse(JSON.stringify(originalObject));
}

// pass in playerData.constructed / limited / historic objects
export function formatRank(
  rank: InternalRankData | MatchPlayer | InternalPlayer
): string {
  if (rank.leaderboardPlace) {
    return `Mythic #${rank.leaderboardPlace}`;
  }
  if (rank.percentile) {
    return `Mythic ${rank.percentile}%`;
  }
  return `${rank.rank} ${rank.tier}`;
}

export function roundWinrate(x: number): number {
  return Math.round(x * 100) / 100;
}

// Im not sure if this would be better as a converter instead of a check
export function isEpochTimestamp(timestamp: number): boolean {
  const asDate = new Date(timestamp);
  // Even if we have a date in epoch between 2000 and
  // 2100 it will be parsed as 1970.
  return asDate && asDate == asDate && asDate.getUTCFullYear() < 2000;
}

export function isRankedEvent(eventId: string): boolean {
  return (
    db.standard_ranked_events.includes(eventId) ||
    db.limited_ranked_events.includes(eventId) ||
    eventId.indexOf("QuickDraft") !== -1 ||
    eventId.indexOf("Ladder") !== -1
  );
}
