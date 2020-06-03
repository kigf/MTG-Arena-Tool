/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */
import async from "async";

import makeId from "../shared/utils/makeId";
import isEpochTimestamp from "../shared/utils/isEpochTimestamp";
import db from "../shared/database";
import { playerDb } from "../shared/db/LocalDatabase";

import { ipcSend } from "./backgroundUtil";
import { loadPlayerConfig, syncSettings } from "./loadPlayerConfig";
import {
  asyncWorker,
  handleError,
  ipcLog,
  ipcPop,
  makeSimpleResponseHandler,
} from "./httpWorker";
import globals from "./globals";
import globalStore, {
  matchExists,
  eventExists,
  transactionExists,
  draftExists,
  seasonalList,
  getEvent,
  getDraft,
  getTransaction,
  getMatch,
  getSeasonal,
} from "../shared/store";
import {
  SYNC_CHECK,
  SYNC_OK,
  SYNC_IDLE,
  SYNC_FETCH,
  IPC_RENDERER,
  IPC_ALL,
} from "../shared/constants";
import { reduxAction } from "../shared/redux/sharedRedux";
import { InternalMatch } from "../types/match";
import { HttpTask, SyncRequestData, SyncIds, ExploreQuery } from "../types/api";
import { InternalEvent } from "../types/event";
import { InternalEconomyTransaction } from "../types/inventory";
import { InternalDraft } from "../types/draft";
import { InternalDeck } from "../types/Deck";
import { SeasonalRankData } from "../types/Season";
import { SettingsData } from "../types/settings";

export function initHttpQueue(): async.AsyncQueue<HttpTask> {
  globals.httpQueue = async.queue(asyncWorker);
  if (globals.debugNet) {
    globals.httpQueue.drain(() => {
      ipcLog("httpQueue empty, asyncWorker now idle");
    });
  }
  return globals.httpQueue;
}

export function isIdle(): boolean {
  return globals.httpQueue ? globals.httpQueue.idle() : false;
}

export function setSyncState(state: number): void {
  reduxAction(
    globals.store.dispatch,
    { type: "SET_SYNC_STATE", arg: state },
    IPC_RENDERER
  );
}

export function finishSync(): void {
  const toPush = globals.store.getState().renderer.syncToPush;
  if (
    toPush.courses.length == 0 &&
    toPush.matches.length == 0 &&
    toPush.drafts.length == 0 &&
    toPush.economy.length == 0 &&
    toPush.seasonal.length == 0
  ) {
    setSyncState(SYNC_OK);
  } else {
    setSyncState(SYNC_CHECK);
  }
}

function syncUserData(data: any): void {
  //console.log("syncUserData: ", data);
  // Sync Events
  const courses_index = [...globals.store.getState().events.eventsIndex];
  const coursesList = data.courses
    .filter((doc: any) => !eventExists(doc._id))
    .map((doc: any) => {
      const id = doc._id;
      doc.id = id;
      delete doc._id;
      if (isEpochTimestamp(doc.date)) doc.date *= 1000;
      playerDb.upsert("", id, doc);
      courses_index.push(id);
      return doc;
    });
  reduxAction(
    globals.store.dispatch,
    { type: "SET_MANY_EVENTS", arg: coursesList },
    IPC_RENDERER
  );
  playerDb.upsert("", "courses_index", courses_index);

  // Sync Matches (updated)
  const matches_index = [...globals.store.getState().matches.matchesIndex];
  const matchesList = data.matches
    .filter((doc: any) => !matchExists(doc._id))
    .map((doc: any) => {
      const id = doc._id;
      doc.id = id;
      delete doc._id;
      playerDb.upsert("", id, doc);
      matches_index.push(id);
      return doc;
    });
  reduxAction(
    globals.store.dispatch,
    { type: "SET_MANY_MATCHES", arg: matchesList },
    IPC_RENDERER
  );
  playerDb.upsert("", "matches_index", matches_index);

  // Sync Economy
  const economy_index = [...globals.store.getState().economy.economyIndex];
  const transactionsList = data.economy
    .filter((doc: any) => !transactionExists(doc._id))
    .map((doc: any) => {
      const id = doc._id;
      doc.id = id;
      delete doc._id;
      // For some reason this is not needed here
      // Maybe it was patched somehwere else
      //doc.timestamp = doc.timestamp * 1000;
      playerDb.upsert("", id, doc);
      economy_index.push(id);
      return doc;
    });
  reduxAction(
    globals.store.dispatch,
    { type: "SET_MANY_ECONOMY", arg: transactionsList },
    IPC_RENDERER
  );
  playerDb.upsert("", "economy_index", economy_index);

  // Sync Drafts
  const draft_index = [...globals.store.getState().drafts.draftsIndex];
  const draftsList = data.drafts
    .filter((doc: any) => !draftExists(doc._id))
    .map((doc: any) => {
      const id = doc._id;
      doc.id = id;
      delete doc._id;
      playerDb.upsert("", id, doc);
      draft_index.push(id);
      return doc;
    });

  reduxAction(
    globals.store.dispatch,
    { type: "SET_MANY_DRAFT", arg: draftsList },
    IPC_RENDERER
  );
  playerDb.upsert("", "draft_index", draft_index);

  // Sync seasonal
  const newSeasonal = [...seasonalList()];
  const seasonalAdd = data.seasonal.map((doc: any) => {
    const id = doc._id;
    doc.id = id;
    delete doc._id;
    // This was my problem!
    doc.timestamp = doc.timestamp * 1000;
    newSeasonal.push(doc);
    playerDb.upsert("seasonal", id, doc);
    return doc;
  });

  playerDb.upsert("", "seasonal", newSeasonal);

  reduxAction(
    globals.store.dispatch,
    { type: "SET_MANY_SEASONAL", arg: seasonalAdd },
    IPC_RENDERER
  );

  if (data.settings.tags_colors) {
    const newTags = data.settings.tags_colors;
    reduxAction(
      globals.store.dispatch,
      { type: "SET_TAG_COLORS", arg: newTags },
      IPC_RENDERER
    );
    playerDb.upsert("", "tags_colors", newTags);
  }

  finishSync();
}

function handlePush(toPush: SyncIds): void {
  reduxAction(
    globals.store.dispatch,
    { type: "SET_TO_PUSH", arg: toPush },
    IPC_RENDERER
  );
  if (
    toPush.courses.length == 0 &&
    toPush.matches.length == 0 &&
    toPush.drafts.length == 0 &&
    toPush.economy.length == 0 &&
    toPush.seasonal.length == 0
  ) {
    setSyncState(SYNC_OK);
  } else {
    setSyncState(SYNC_IDLE);
  }
}

function handleSync(syncIds: SyncIds): void {
  const { privateDecks } = globals.store.getState().decks;
  const toPush: SyncIds = {
    courses: Object.keys(globalStore.events).filter(
      (id) => syncIds.courses.indexOf(id) == -1
    ),
    matches: Object.keys(globalStore.matches).filter(
      (id) =>
        syncIds.matches.indexOf(id) == -1 &&
        globalStore.matches[id] &&
        privateDecks.indexOf(globalStore.matches[id].id) == -1
    ),
    drafts: Object.keys(globalStore.drafts).filter(
      (id) => syncIds.drafts.indexOf(id) == -1
    ),
    economy: Object.keys(globalStore.transactions).filter(
      (id) => syncIds.economy.indexOf(id) == -1
    ),
    seasonal: Object.keys(globalStore.seasonal).filter(
      (id) => syncIds.seasonal.indexOf(id) == -1
    ),
  };
  handlePush(toPush);
}

function handleRePushLostMatchData(): void {
  const shufflerDataCollectionStart = "2019-01-28T00:00:00.000Z";
  const dataLostEnd = "2019-05-01T00:00:00.000Z";
  const toPush: SyncIds = {
    courses: [],
    matches: Object.keys(globalStore.matches).filter((id) => {
      const match = globalStore.matches[id];
      return (
        !match.lastPushedDate &&
        shufflerDataCollectionStart < match.date &&
        match.date < dataLostEnd
      );
    }),
    drafts: [],
    economy: [],
    seasonal: [],
  };
  handlePush(toPush);
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  httpSyncPush();
}

export function httpSyncRequest(data: SyncRequestData): void {
  setSyncState(SYNC_FETCH);
  const _id = makeId(6);
  globals.httpQueue?.push(
    {
      reqId: _id,
      method: "getSync",
      method_path: "/api/get_sync.php",
      data,
    },
    makeSimpleResponseHandler((parsedResult: any) => {
      syncUserData(parsedResult.data);
    })
  );
}

function handleAuthResponse(
  error?: Error | null,
  _task?: HttpTask,
  _results?: string,
  parsedResult?: any
): void {
  if (error || !parsedResult) {
    reduxAction(
      globals.store.dispatch,
      {
        type: "SET_APP_SETTINGS",
        arg: {
          token: "",
          email: "",
        },
      },
      IPC_ALL
    );
    ipcSend("auth", {});
    ipcSend("toggle_login", true);
    ipcSend("login_failed", true);
    ipcSend("clear_pwd", 1);
    ipcPop({
      text: error?.message,
      time: 3000,
      progress: -1,
    });
    return;
  }

  syncSettings({ token: parsedResult.token }, false);
  ipcSend("auth", parsedResult);
  //ipcSend("auth", parsedResult.arenaids);

  const appSettings = globals.store.getState().appsettings;
  if (appSettings.rememberMe) {
    reduxAction(
      globals.store.dispatch,
      {
        type: "SET_APP_SETTINGS",
        arg: {
          token: parsedResult.token,
          email: appSettings.email,
        },
      },
      IPC_ALL
    );
  }
  const data: any = {};
  data.patreon = parsedResult.patreon;
  data.patreon_tier = parsedResult.patreon_tier;

  const serverData: SyncIds = {
    matches: [],
    courses: [],
    drafts: [],
    economy: [],
    seasonal: [],
  };

  if (parsedResult && data.patreon) {
    serverData.matches = parsedResult.matches;
    serverData.courses = parsedResult.courses;
    serverData.drafts = parsedResult.drafts;
    serverData.economy = parsedResult.economy;
    serverData.seasonal = parsedResult.seasonal;
  }

  loadPlayerConfig().then(() => {
    ipcLog("...called back to http-api.");
    ipcLog("Checking local data without remote copies");
    if (parsedResult && data.patreon) {
      handleSync(parsedResult);
    } else {
      handleRePushLostMatchData();
    }
    ipcLog("Checking for sync requests...");
    const requestSync = {
      arenaId: globals.store.getState().playerdata.playerName,
      courses: serverData.courses.filter((id) => !(id in globalStore.events)),
      matches: serverData.matches.filter((id) => !(id in globalStore.matches)),
      drafts: serverData.drafts.filter((id) => !(id in globalStore.drafts)),
      economy: serverData.economy.filter(
        (id) => !(id in globalStore.transactions)
      ),
      seasonal: serverData.seasonal.filter(
        (id) => !(id in globalStore.seasonal)
      ),
    };

    if (requestSync) {
      ipcLog("Fetch remote player items");
      // console.log(requestSync);
      httpSyncRequest(requestSync);
    } else {
      ipcLog("No need to fetch remote player items.");
    }
  });
}

export function httpAuth(userName: string, pass: string): void {
  const _id = makeId(6);
  //const playerData = globals.store.getState().playerdata;
  setSyncState(SYNC_CHECK);
  globals.httpQueue?.push(
    {
      reqId: _id,
      method: "authLogin",
      method_path: "/auth/login",
      data: {
        email: userName,
        password: pass,
      },
      //playerid: playerData.arenaId,
      //playername: encodeURIComponent(playerData.playerName),
      //mtgaversion: playerData.arenaVersion,
      //version: electron.remote.app.getVersion(),
    },
    handleAuthResponse
  );
}

function handleSetDataResponse(
  error?: Error | null,
  task?: HttpTask,
  _results?: string,
  _parsedResult?: any
): void {
  finishSync();
  if (error) {
    handleError(error);
    return;
  }
  if (task && task.method == "postMatch") {
    const match: InternalMatch = task.data;
    match.lastPushedDate = new Date().toISOString();
    reduxAction(
      globals.store.dispatch,
      { type: "SET_MATCH", arg: match },
      IPC_RENDERER
    );
    playerDb.upsert(match.id, "lastPushedDate", match.lastPushedDate);
  }
}

export function httpSubmitCourse(course: InternalEvent): void {
  const _id = makeId(6);
  const anon = globals.store.getState().settings.anon_explore;
  if (anon == true) {
    course.arenaId = "Anonymous";
  }

  //const playerData = globals.store.getState().playerdata;
  globals.httpQueue?.push(
    {
      reqId: _id,
      method: "postCourse",
      method_path: "/courses/" + course.id,
      data: course,
    },
    handleSetDataResponse
  );
}

export function httpGetExplore(query: ExploreQuery): void {
  const _id = makeId(6);
  const playerData = globals.store.getState().playerdata;
  globals.httpQueue?.unshift(
    {
      reqId: _id,
      method: "getExplore",
      method_path: "/explore",
      ...query,
      collection: JSON.stringify(playerData.cards.cards),
      options: {
        method: "GET",
      },
    },
    makeSimpleResponseHandler((parsedResult: any) => {
      ipcSend("set_explore_decks", parsedResult);
    })
  );
}

export function httpGetCourse(courseId: string): void {
  const _id = makeId(6);
  globals.httpQueue?.unshift(
    {
      reqId: _id,
      method: "getCourse",
      method_path: "/courses/" + courseId,
      options: {
        method: "GET",
      },
    },
    makeSimpleResponseHandler((parsedResult: any) => {
      ipcSend("open_course_deck", parsedResult.result);
    })
  );
}

export function httpSetMatch(match: InternalMatch): void {
  const _id = makeId(6);
  const anon = globals.store.getState().settings.anon_explore;
  const privateDecks = globals.store.getState().decks.privateDecks;
  if (anon == true) {
    match.arenaId = "Anonymous";
  }
  if (privateDecks.indexOf(match.playerDeck.id) == -1) {
    globals.httpQueue?.push(
      {
        reqId: _id,
        method: "postMatch",
        method_path: "/matches/" + match.id,
        data: match,
      },
      handleSetDataResponse
    );
  }
}

export function httpSetDraft(draft: InternalDraft): void {
  const _id = makeId(6);
  globals.httpQueue?.push(
    {
      reqId: _id,
      method: "postDraft",
      method_path: "/drafts/" + draft.id,
      data: draft,
    },
    handleSetDataResponse
  );
}

export function httpSetEconomy(change: InternalEconomyTransaction): void {
  const _id = makeId(6);
  globals.httpQueue?.push(
    {
      reqId: _id,
      method: "postEconomy",
      method_path: "/economy/" + change.id,
      data: change,
    },
    handleSetDataResponse
  );
}

export function httpSetSeasonal(change: SeasonalRankData): void {
  const _id = makeId(6);
  globals.httpQueue?.push(
    {
      reqId: _id,
      method: "postSeasonal",
      method_path: "/seasonal/" + change.id,
      data: change,
    },
    handleSetDataResponse
  );
}

export function httpSetSettings(settings: SettingsData): void {
  const _id = makeId(6);
  globals.httpQueue?.push(
    {
      reqId: _id,
      method: "postSettings",
      method_path: "/user/settings",
      data: settings,
    },
    handleSetDataResponse
  );
}

export function httpDeleteData(): void {
  const _id = makeId(6);
  globals.httpQueue?.push(
    {
      reqId: _id,
      method: "clearData",
      method_path: "/user/clear",
      options: {
        method: "DELETE",
      },
    },
    makeSimpleResponseHandler()
  );
}

function handleGetDatabaseResponse(
  error?: Error | null,
  _task?: HttpTask,
  results?: string
): void {
  if (error) {
    handleError(error);
    return;
  }
  if (results) {
    //resetLogLoop(100);
    // delete parsedResult.ok;
    ipcLog("Metadata: Ok");
    db.handleSetDb(null, results);
    db.updateCache(results);
    ipcSend("set_db", results);
  }
}

export function httpGetDatabase(lang: string): void {
  const _id = makeId(6);
  globals.httpQueue?.push(
    {
      reqId: _id,
      method: "getDatabase",
      method_path: "/database/" + lang,
      lang: lang,
      options: {
        method: "GET",
      },
    },
    handleGetDatabaseResponse
  );
}

export function httpGetDatabaseVersion(lang: string): void {
  const _id = makeId(6);
  globals.httpQueue?.push(
    {
      reqId: _id,
      method: "getDatabaseVersion",
      method_path: "/database/latest/" + lang,
      options: {
        method: "GET",
      },
    },
    makeSimpleResponseHandler((parsedResult: any) => {
      const lang = globals.store.getState().appsettings.metadataLang;
      if (
        db.metadata &&
        db.metadata.language &&
        parsedResult.lang.toLowerCase() !== db.metadata.language.toLowerCase()
      ) {
        // compare language
        ipcSend("popup", {
          text: `Downloading latest Database (v${parsedResult.latest})`,
          time: 5000,
        });
        ipcLog(
          `Downloading database (had lang ${db.metadata.language}, needed ${parsedResult.lang})`
        );
        httpGetDatabase(lang);
      } else if (parsedResult.latest > db.version) {
        // Compare parsedResult.version with stored version
        ipcSend("popup", {
          text: `Downloading latest Database (v${parsedResult.latest})`,
          time: 5000,
        });
        ipcLog(
          `Downloading latest database (had v${db.version}, found v${parsedResult.latest})`
        );
        httpGetDatabase(lang);
      } else {
        ipcSend("popup", {
          text: `Database up to date (v${db.version})`,
          time: 5000,
        });
        ipcLog(`Database up to date (${db.version}), skipping download.`);
      }
    })
  );
}

export function httpDraftShareLink(
  did: string,
  exp: number,
  draftData: InternalDraft
): void {
  const _id = makeId(6);
  globals.httpQueue?.push(
    {
      reqId: _id,
      method: "shareDraft",
      method_path: "/share/draft",
      data: {
        id: did,
        draft: draftData,
        expire: exp,
      },
    },
    makeSimpleResponseHandler((parsedResult: any) => {
      ipcSend("set_draft_link", parsedResult.url);
    })
  );
}

export function httpLogShareLink(lid: string, log: string, exp: number): void {
  const _id = makeId(6);
  globals.httpQueue?.push(
    {
      reqId: _id,
      method: "shareLog",
      method_path: "/share/log",
      data: {
        id: lid,
        log: log,
        expire: exp,
      },
    },
    makeSimpleResponseHandler((parsedResult: any) => {
      ipcSend("set_log_link", parsedResult.url);
    })
  );
}

export function httpDeckShareLink(deck: InternalDeck, exp: number): void {
  const _id = makeId(6);
  globals.httpQueue?.push(
    {
      reqId: _id,
      method: "shareDeck",
      method_path: "/share/deck",
      data: {
        deck: deck,
        expire: exp,
      },
    },
    makeSimpleResponseHandler((parsedResult: any) => {
      ipcSend("set_deck_link", parsedResult.url);
    })
  );
}

export function httpHomeGet(set: string): void {
  const _id = makeId(6);
  globals.httpQueue?.unshift(
    {
      reqId: _id,
      method: "getHome",
      method_path: "/home",
      set: set,
    },
    makeSimpleResponseHandler((parsedResult: any) => {
      ipcSend("set_home", parsedResult);
    })
  );
}

export function httpSetMythicRank(opp: string, rank: string): void {
  const _id = makeId(6);
  globals.httpQueue?.push(
    {
      reqId: _id,
      method: "postMythicRank",
      method_path: "/api/send_mythic_rank.php",
      data: {
        opp: opp,
        rank: rank,
      },
    },
    handleSetDataResponse
  );
}

export function httpSyncPush(): void {
  const syncIds: SyncIds = globals.store.getState().renderer.syncToPush;
  syncIds.courses.map((id: string) => {
    const obj = getEvent(id);
    if (obj) httpSubmitCourse(obj);
  });

  syncIds.drafts.map((id: string) => {
    const obj = getDraft(id);
    if (obj) httpSetDraft(obj);
  });

  syncIds.economy.map((id: string) => {
    const obj = getTransaction(id);
    if (obj) httpSetEconomy(obj);
  });

  syncIds.matches.map((id: string) => {
    const obj = getMatch(id);
    if (obj) httpSetMatch(obj);
  });

  syncIds.seasonal.map((id: string) => {
    const obj = getSeasonal(id);
    if (obj) httpSetSeasonal(obj);
  });

  reduxAction(
    globals.store.dispatch,
    {
      type: "SET_TO_PUSH",
      arg: {
        matches: [],
        courses: [],
        drafts: [],
        economy: [],
        seasonal: [],
      },
    },
    IPC_RENDERER
  );
}
