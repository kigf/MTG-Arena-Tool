/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-console */
import path from "path";
import { app, remote, ipcRenderer as ipc, IpcRendererEvent } from "electron";
import fs from "fs";
import _ from "lodash";
import {
  Metadata,
  Archetype,
  DbCardData,
  CardSet,
  RewardsDate,
} from "../types/Metadata";
import { SeasonAndRankDetail, Rank, RankInfo } from "../types/event";
import { STANDARD_CUTOFF_DATE } from "./constants";
import format from "date-fns/format";

import defaultDatabase from "../assets/resources/database.json";
import debugLog from "./debugLog";

const cachePath: string | null =
  app || (remote && remote.app)
    ? path.join((app || remote.app).getPath("userData"), "database.json")
    : null;

/*
 This is cool for debugging the metadata files, so we can
 test and view the output files without copypasta.
*/
/*
const cachePath =
  app || (remote && remote.app)
    ? path.join(
        "C:\\Users\\user\\Documents\\GitHub\\MTG-Arena-Tool-Metadata\\dist",
        "v67-en-database.json"
      )
    : null;

const scryfallDataPath = path.join(
  "C:\\Users\\user\\Documents\\GitHub\\MTG-Arena-Tool-Metadata\\external",
  "scryfall-cards.json"
);
*/

// Some other things should go here later, like updating from MTGA Servers themselves.
class Database {
  private static instance: Database;
  rewards_daily_ends: Date;
  rewards_weekly_ends: Date;
  public metadata: Metadata;
  season: SeasonAndRankDetail | undefined;
  public scryfallData: any;

  private constructor() {
    this.handleSetDb = this.handleSetDb.bind(this);
    this.handleSetRewardResets = this.handleSetRewardResets.bind(this);
    this.handleSetSeason = this.handleSetSeason.bind(this);

    if (ipc) {
      ipc.on("set_db", this.handleSetDb);
      ipc.on("set_reward_resets", this.handleSetRewardResets);
      ipc.on("set_season", this.handleSetSeason);
    }

    this.rewards_daily_ends = new Date();
    this.rewards_weekly_ends = new Date();

    // tsc fails if not asserting
    this.metadata = defaultDatabase as Metadata;

    if (cachePath && fs.existsSync(cachePath)) {
      const dbString = fs.readFileSync(cachePath, "utf8");
      this.handleSetDb(null, dbString);
    }

    /*
    try {
      const data = fs.readFileSync(scryfallDataPath, "utf8");
      this.scryfallData = JSON.parse(data);
    } catch (e) {
      debugLog("Error parsing scryfall data", e);
    }
    */
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }

  handleSetDb(_event: IpcRendererEvent | null, arg: string): void {
    try {
      this.metadata = JSON.parse(arg) as Metadata;
      for (const event of this.playBrawlEvents) {
        this.metadata.events[event] = "Play Brawl";
        this.metadata.events_format[event] = "Brawl";
        this.metadata.single_match_events.push(event);
      }
    } catch (e) {
      debugLog(`Error parsing metadata: ${e}`, "error");
    }
  }

  updateCache(data: string): void {
    try {
      if (cachePath) {
        debugLog("Saved metadata to " + cachePath);
        fs.writeFileSync(cachePath, data);
      }
    } catch (e) {
      debugLog(`Error updating cache: ${e}`, "error");
    }
  }

  handleSetRewardResets(
    _event: IpcRendererEvent | null,
    rewardsDate: RewardsDate
  ): void {
    this.rewards_daily_ends = new Date(rewardsDate.daily);
    this.rewards_weekly_ends = new Date(rewardsDate.weekly);
  }

  handleSetSeason(
    _event: IpcRendererEvent | null,
    season: SeasonAndRankDetail
  ): void {
    try {
      this.season = season;
    } catch (e) {
      debugLog(`Error handleSetSeason: ${e}`, "error");
    }
  }

  get abilities(): { [id: number]: string } {
    return this.metadata ? this.metadata.abilities : {};
  }

  get archetypes(): Archetype[] {
    return this.metadata ? this.metadata.archetypes : [];
  }

  get cards(): { [id: number]: DbCardData } {
    return this.metadata !== undefined ? this.metadata.cards : {};
  }

  get cardIds(): number[] {
    return this.cards
      ? Object.keys(this.cards).map((k) => parseInt(k))
      : ([] as number[]);
  }

  get cardList(): DbCardData[] {
    return this.cards ? Object.values(this.cards) : ([] as DbCardData[]);
  }

  get events(): { [id: string]: string } {
    return this.metadata ? this.metadata.events : {};
  }

  get eventIds(): string[] {
    return this.metadata ? Object.keys(this.metadata.events) : ([] as string[]);
  }

  get eventList(): string[] {
    return this.metadata
      ? Object.values(this.metadata.events)
      : ([] as string[]);
  }

  get events_format(): { [id: string]: string } {
    return this.metadata ? this.metadata.events_format : {};
  }

  get limited_ranked_events(): string[] {
    return this.metadata ? this.metadata.limited_ranked_events : [];
  }

  get standard_ranked_events(): string[] {
    return this.metadata ? this.metadata.standard_ranked_events : [];
  }

  get single_match_events(): string[] {
    return this.metadata ? this.metadata.single_match_events : [];
  }

  get playBrawlEvents(): string[] {
    const prefix = "Play_Brawl_";
    const endDate = new Date();
    const currentDate = new Date("2019-11-06T16:00:00Z"); // first Wednesday brawl
    const events = [];
    while (currentDate < endDate) {
      events.push(prefix + format(currentDate, "yyyyMMdd"));
      currentDate.setDate(currentDate.getDate() + 7); // repeat every Wednesday
    }
    return events;
  }

  get season_starts(): Date {
    if (!this.season || !this.season.currentSeason) return new Date();
    return new Date(this.season.currentSeason.seasonStartTime);
  }

  get season_ends(): Date {
    if (!this.season || !this.season.currentSeason) return new Date();
    return new Date(this.season.currentSeason.seasonEndTime);
  }

  get defaultSet(): CardSet | undefined {
    if (!this.metadata) {
      return undefined;
    }
    return this.metadata.sets[""];
  }

  get sets(): { [id: string]: CardSet } {
    if (!this.metadata) {
      return {};
    }

    return _.pickBy(
      this.metadata.sets,
      (set, setName) => set && setName && set.code
    );
  }

  get sortedSetCodes(): string[] {
    const setCodes = Object.keys(this.sets);
    setCodes.sort(
      (a, b) =>
        new Date(this.sets[b].release).getTime() -
        new Date(this.sets[a].release).getTime()
    );
    return setCodes;
  }

  get standardSetCodes(): string[] {
    return this.sortedSetCodes.filter(
      (code) =>
        this.sets[code].collation !== -1 &&
        new Date(this.sets[code].release) > new Date(STANDARD_CUTOFF_DATE)
    );
  }

  get version(): number {
    return parseInt((this.metadata ? this.metadata.version : 0) + "");
  }

  card(id?: number | string): DbCardData | undefined {
    if (id === undefined) {
      return undefined;
    }

    if (!this.metadata?.cards) {
      return undefined;
    }

    const numId = typeof id === "number" ? id : parseInt(id);
    return this.metadata.cards[numId] || undefined;
  }

  ability(id?: number | string): string | undefined {
    if (id === undefined) {
      return undefined;
    }

    if (!this.metadata?.abilities) {
      return undefined;
    }

    const abid = typeof id === "number" ? id : parseInt(id);
    return this.metadata.abilities[abid] || undefined;
  }

  event(id: string): string | undefined {
    return this.events[id];
  }

  //possibly unused?
  // get(key: string) {
  //   if(!this.data){
  //     return false;
  //   }
  //   //return this.data[key] || false;
  //   return false;
  // }

  getRankSteps(rank: Rank, tier: number, isLimited: boolean): number {
    if (!this.season) return 0;
    let rankInfo: RankInfo[];
    if (isLimited) {
      if (!this.season.limitedRankInfo) return 0;
      rankInfo = this.season.limitedRankInfo;
    } else {
      if (!this.season.constructedRankInfo) return 0;
      rankInfo = this.season.constructedRankInfo;
    }
    rankInfo.forEach((ri) => {
      if (ri.rankClass === rank && ri.level === tier) {
        return ri.steps;
      }
    });
    return 0;
  }

  cardFromArt(artId: number | string): DbCardData | boolean {
    const numArtId = typeof artId === "number" ? artId : parseInt(artId);
    const matches = this.cardList.filter((card) => card.artid === numArtId);
    return matches.length ? matches[0] : false;
  }
}

export default Database.getInstance();
