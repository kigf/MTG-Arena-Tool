import { playerDb } from "../../shared/db/LocalDatabase";
import playerData from "../../shared/PlayerData";
import { setData } from "../backgroundUtil";

export default function clearDraftData(draftId: string): void {
  if (playerData.draftExists(draftId)) {
    if (playerData.draft_index.includes(draftId)) {
      const draftIndex = [...playerData.draft_index];
      draftIndex.splice(draftIndex.indexOf(draftId), 1);
      setData({ draft_index: draftIndex }, false);
      playerDb.upsert("", "draft_index", draftIndex);
    }
    setData({ [draftId]: null });
    playerDb.remove("", draftId);
  }
}
