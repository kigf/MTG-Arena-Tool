import { setDraftData } from "../../shared/store/currentDraftStore";
import LogEntry from "../../types/logDecoder";
import { EventJoinPodmaking } from "mtgatool-shared/dist/types/draft";
import { getSetInEventId } from "mtgatool-shared";

interface Entry extends LogEntry {
  json: () => EventJoinPodmaking;
}

export default function InEventJoinPodMaking(entry: Entry): void {
  const json = entry.json();
  //debugLog("LABEL:  Make pick < ", json);
  if (!json) return;

  if (json.params) {
    const set = getSetInEventId(json.params.queueId);
    setDraftData({ eventId: json.params.queueId, draftSet: set });
  }
}
