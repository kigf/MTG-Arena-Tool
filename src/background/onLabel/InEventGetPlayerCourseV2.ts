// PROBABLY DEPRECATED
import { constants, playerDb } from "../../shared/db/LocalDatabase";
import { Deck } from "mtgatool-shared";
import { InternalEvent, PlayerCourse } from "../../types/event";
import LogEntry from "../../types/logDecoder";
import addCustomDeck from "../addCustomDeck";
import globals from "../globals";
import selectDeck from "../selectDeck";
import convertDeckFromV3 from "../convertDeckFromV3";
import { getEvent } from "../../shared/store";
import { reduxAction } from "../../shared/redux/sharedRedux";
import { httpSubmitCourse } from "../httpApi";

const { IPC_RENDERER } = constants;

interface Entry extends LogEntry {
  json: () => PlayerCourse;
}

function saveCourse(json: InternalEvent): void {
  const id = json.id ?? json._id ?? "";
  delete json._id;
  json.id = id;
  const eventData = {
    // date: globals.logTime,
    // preserve custom fields if possible
    ...(getEvent(id) || {}),
    ...json,
  };

  reduxAction(
    globals.store.dispatch,
    { type: "SET_EVENT", arg: eventData },
    IPC_RENDERER
  );
  const coursesIndex = globals.store.getState().events.eventsIndex;
  playerDb.upsert("", "courses_index", coursesIndex);
  playerDb.upsert("", id, eventData);
}

export default function InEventGetPlayerCourseV2(entry: Entry): void {
  const json = entry.json() as any;
  if (!json) return;
  if (json.Id == "00000000-0000-0000-0000-000000000000") return;

  const newModule: Record<string, any> = {};
  json.ModuleInstanceData = Object.keys(json.ModuleInstanceData).map((k) => {
    const newK = k.split(".").join("");
    newModule[newK] = json.ModuleInstanceData[k];
  });
  json.ModuleInstanceData = { ...newModule };

  if (!json.CourseDeck) return;
  // Says v2 in the label but its actually v3 !
  const v2Deck = convertDeckFromV3(json.CourseDeck);
  const newJson: InternalEvent = {
    CourseDeck: v2Deck,
    archived: false,
    CurrentEventState: json.CurrentEventState,
    custom: false,
    InternalEventName: json.InternalEventName,
    ModuleInstanceData: json.ModuleInstanceData,
    type: "Event",
    id: json.Id,
    arenaId: globals.store.getState().playerdata.playerName,
    date: globals.logTime.toISOString(),
  };

  if (v2Deck) {
    const deck = new Deck(v2Deck);
    addCustomDeck(newJson.CourseDeck);
    httpSubmitCourse(newJson);
    saveCourse(newJson);
    selectDeck(deck);
  }
}
