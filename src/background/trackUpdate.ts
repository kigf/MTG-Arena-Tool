import inventoryUpdate from "./inventoryUpdate";
import { Entry as PostMatchUpdateEntry } from "./onLabel/PostMatchUpdate";
import { BattlePassUpdate } from "mtgatool-shared";

export default function trackUpdate(
  entry: PostMatchUpdateEntry,
  trackUpdate: Partial<BattlePassUpdate>
): void {
  if (!trackUpdate) return;
  const { trackName, trackTier, trackDiff, orbCountDiff } = trackUpdate;

  if (trackDiff?.inventoryUpdates) {
    trackDiff.inventoryUpdates.forEach((update) => {
      const data = {
        ...update,
        trackName,
        trackTier,
      };
      data.context.subSource = trackName;
      inventoryUpdate(entry, data);
    });
  }

  // For some reason, orbs live separately from all other inventory
  if ((orbCountDiff?.currentOrbCount ?? 0) - (orbCountDiff?.oldOrbCount ?? 0)) {
    const data = { trackName, trackTier, orbCountDiff };
    inventoryUpdate(entry, data);
  }
}
