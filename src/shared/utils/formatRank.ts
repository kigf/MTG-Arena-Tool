import { MatchPlayer } from "mtgatool-shared/dist/types/currentMatch";
import { InternalRankData } from "mtgatool-shared/dist/types/rank";
import { InternalPlayer } from "mtgatool-shared/dist/types/match";

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
