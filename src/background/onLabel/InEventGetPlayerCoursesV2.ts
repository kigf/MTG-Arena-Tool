import LogEntry from "../../types/logDecoder";
import { playerDb } from "../../shared/db/LocalDatabase";
import addCustomDeck from "../addCustomDeck";
import { PlayerCourse } from "mtgatool-shared/dist/types/event";
import { convertDeckFromV3 } from "mtgatool-shared";

interface Entry extends LogEntry {
  json: () => PlayerCourse[];
}

export default function InEventGetPlayerCoursesV2(entry: Entry): void {
  const json = entry.json();
  if (!json) return;

  const staticEvents: string[] = [];
  json.forEach((course) => {
    if (course.CurrentEventState != "PreMatch") {
      if (course.CourseDeck != null) {
        const v2deck = convertDeckFromV3(course.CourseDeck);
        addCustomDeck(v2deck);
      }
    }
    if (course.Id) staticEvents.push(course.Id);
  });

  playerDb.upsert("", "static_events", staticEvents);
}
