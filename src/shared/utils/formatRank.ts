import { InternalRankData } from "../../types/rank";
import { MatchPlayer } from "../../types/currentMatch";
import { InternalPlayer } from "../../types/match";

// pass in playerData.constructed / limited / historic objects
export default function formatRank(
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