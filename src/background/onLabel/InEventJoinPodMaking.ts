import LogEntry from "../../types/logDecoder";
import { EventJoinPodmaking } from "../../types/draft";
import { setDraftData } from "../../shared/store/currentDraftStore";
import getSetCodeInEventId from "../../shared/utils/getSetInEventId";

interface Entry extends LogEntry {
  json: () => EventJoinPodmaking;
}

export default function InEventJoinPodMaking(entry: Entry): void {
  const json = entry.json();
  //debugLog("LABEL:  Make pick < ", json);
  if (!json) return;

  if (json.params) {
    const set = getSetCodeInEventId(json.params.queueId);
    setDraftData({ eventId: json.params.queueId, draftSet: set });
  }
}
