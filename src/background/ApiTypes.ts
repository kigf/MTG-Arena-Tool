import { RequestOptions } from "http";
import { InternalDeck } from "../types/Deck";
import { InternalDraft } from "../types/draft";
import { ExploreQuery } from "../shared/redux/slices/exploreSlice";
import { SyncRequestData } from "./httpApi";
import { InternalEvent } from "../types/event";
import { InternalMatch } from "../types/match";
import { InternalEconomyTransaction } from "../types/inventory";
import { SeasonalRankData } from "../types/Season";

export type HttpMethod =
  | "authLogin"
  | "getSync"
  | "postCourse"
  | "postMatch"
  | "postEconomy"
  | "postSeasonal"
  | "postDraft"
  | "getCourse"
  | "getMatch"
  | "getEconomy"
  | "getSeasonal"
  | "getDraft"
  | "postSettings"
  | "clearData"
  | "getDatabase"
  | "getDatabaseVersion"
  | "shareDraft"
  | "shareLog"
  | "shareDeck"
  | "getHome"
  | "postMythicRank"
  | "getExplore";

export interface BaseHttpTask {
  reqId: string;
  method_path: string;
  method: HttpMethod;
  options?: RequestOptions;
  data?: any;
}

export interface HttpLogin extends BaseHttpTask {
  method: "authLogin";
  data: {
    email: string;
    password: string;
  };
}

export interface HttpGetSync extends BaseHttpTask {
  method: "getSync";
  data: SyncRequestData;
}

export interface HttpPostCourse extends BaseHttpTask {
  method: "postCourse";
  data: InternalEvent;
}

export interface HttpPostMatch extends BaseHttpTask {
  method: "postMatch";
  data: InternalMatch;
}

export interface HttpPostEconomy extends BaseHttpTask {
  method: "postEconomy";
  data: InternalEconomyTransaction;
}

export interface HttpPostSeasonal extends BaseHttpTask {
  method: "postSeasonal";
  data: SeasonalRankData;
}

export interface HttpPostDraft extends BaseHttpTask {
  method: "postDraft";
  data: InternalDraft;
}

export interface HttpGetCourse extends BaseHttpTask {
  method: "getCourse";
}

export interface HttpGetMatch extends BaseHttpTask {
  method: "getMatch";
}

export interface HttpGetEconomy extends BaseHttpTask {
  method: "getEconomy";
}

export interface HttpGetSeasonal extends BaseHttpTask {
  method: "getSeasonal";
}

export interface HttpGetDraft extends BaseHttpTask {
  method: "getDraft";
}

export interface HttpPostSettings extends BaseHttpTask {
  method: "postSettings";
  data: any;
}

export interface HttpClearData extends BaseHttpTask {
  method: "clearData";
}

export interface HttpGetDatabase extends BaseHttpTask {
  method: "getDatabase";
  lang: string;
}

export interface HttpGetDatabaseVersion extends BaseHttpTask {
  method: "getDatabaseVersion";
}

export interface HttpShareDraft extends BaseHttpTask {
  method: "shareDraft";
  data: {
    id: string;
    draft: InternalDraft;
    expire: number;
  };
}

export interface HttpShareLog extends BaseHttpTask {
  method: "shareLog";
  data: {
    id: string;
    log: string;
    expire: number;
  };
}

export interface HttpShareDeck extends BaseHttpTask {
  method: "shareDeck";
  data: {
    deck: InternalDeck;
    expire: number;
  };
}

export interface HttpGetHome extends BaseHttpTask {
  method: "getHome";
  set: string;
}

export interface HttpPostMythicRank extends BaseHttpTask {
  method: "postMythicRank";
  data: {
    opp: string;
    rank: string;
  };
}

export interface HttpGetExplore extends BaseHttpTask, ExploreQuery {
  method: "getExplore";
  collection: string;
}

export type HttpTask =
  | HttpLogin
  | HttpGetSync
  | HttpPostCourse
  | HttpPostMatch
  | HttpPostEconomy
  | HttpPostSeasonal
  | HttpPostDraft
  | HttpGetCourse
  | HttpGetMatch
  | HttpGetEconomy
  | HttpGetSeasonal
  | HttpGetDraft
  | HttpPostSettings
  | HttpClearData
  | HttpGetDatabase
  | HttpGetDatabaseVersion
  | HttpShareDraft
  | HttpShareLog
  | HttpShareDeck
  | HttpGetHome
  | HttpPostMythicRank
  | HttpGetExplore;
