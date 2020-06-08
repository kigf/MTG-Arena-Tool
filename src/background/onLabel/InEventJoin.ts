import Deck from "../../shared/deck";
import { InternalDeck } from "../../types/Deck";
import LogEntry from "../../types/logDecoder";
import addCustomDeck from "../addCustomDeck";
import selectDeck from "../selectDeck";
import {
  setDraftId,
  setDraftData,
  resetCurrentDraft,
} from "../../shared/store/currentDraftStore";
import { ModuleInstanceData } from "../../types/event";
import getSetCodeInEventId from "../../shared/utils/getSetInEventId";

interface EntryJson {
  Id: string;
  InternalEventName: string;
  PlayerId: string | null;
  ModuleInstanceData: ModuleInstanceData;
  CurrentEventState: string;
  CurrentModule: string;
  CardPool: null | [];
  CourseDeck: InternalDeck | null;
  PreviousOpponents: [];
}

interface Entry extends LogEntry {
  json: () => EntryJson;
}

export default function InEventJoin(entry: Entry): void {
  const json = entry.json();
  if (!json) return;

  if (json.CourseDeck) {
    const deck = new Deck(json.CourseDeck);
    addCustomDeck(json.CourseDeck);
    selectDeck(deck);
  } else {
    // Most likely a draft
    resetCurrentDraft();
    const set = getSetCodeInEventId(json.InternalEventName);
    setDraftData({ draftSet: set, eventId: json.InternalEventName });
    setDraftId(json.Id + "-draft");
  }
}
