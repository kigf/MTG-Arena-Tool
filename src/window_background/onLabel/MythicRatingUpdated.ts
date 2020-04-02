import db from "../../shared/database";
import { playerDb } from "../../shared/db/LocalDatabase";

import globals from "../globals";
import { parseWotcTimeFallback } from "../backgroundUtil";

import LogEntry from "../../types/logDecoder";
import { MythicRatingUpdate } from "../../types/rank";
import { reduxAction } from "../../shared-redux/sharedRedux";
import { IPC_RENDERER } from "../../shared/constants";
import { seasonalList } from "../../shared-store";
import { SeasonalRankData } from "../../types/Season";

interface Entry extends LogEntry {
  json: () => MythicRatingUpdate;
}

export default function MythicRatingUpdated(entry: Entry): void {
  const json = entry.json();

  const playerData = globals.store.getState().playerdata;
  const owner = globals.store.getState().appsettings.email;
  const rank = JSON.parse(JSON.stringify(playerData.rank));

  if (!json) return;
  const newJson: SeasonalRankData = {
    oldClass: "Mythic",
    newClass: "Mythic",
    oldLevel: json.oldMythicPercentile,
    newLevel: json.newMythicPercentile,
    oldStep: json.newMythicLeaderboardPlacement,
    newStep: json.newMythicLeaderboardPlacement,
    wasLossProtected: false,
    owner,
    playerId: playerData.playerId,
    player: playerData.playerName,
    rankUpdateType: "constructed", // Ugh, no type on the mythic rank update!
    seasonOrdinal: 1,
    id: entry.hash,
    timestamp: parseWotcTimeFallback(entry.timestamp).getTime(),
    lastMatchId: globals.currentMatch.matchId,
    eventId: globals.currentMatch.eventId
  };

  // Default constructed?
  let type = "constructed";
  // should probably be db.constructed_ranked_events
  if (db.standard_ranked_events.includes(newJson.eventId)) {
    type = "constructed";
  } else if (db.limited_ranked_events.includes(newJson.eventId)) {
    type = "limited";
  }

  rank[type].percentile = json.newMythicPercentile;
  rank[type].leaderboardPlace = json.newMythicLeaderboardPlacement;

  // Rank update / seasonal
  const newSeasonal = [...seasonalList(), newJson];
  reduxAction(globals.store.dispatch, "SET_SEASONAL", newJson, IPC_RENDERER);
  playerDb.upsert("", "seasonal", newSeasonal);

  // New rank data
  reduxAction(globals.store.dispatch, "SET_RANK", rank, IPC_RENDERER);
  playerDb.upsert("", "rank", rank);
}
