import database from "../database";

export default function isRankedEvent(eventId: string): boolean {
  return (
    database.standard_ranked_events.includes(eventId) ||
    database.limited_ranked_events.includes(eventId) ||
    eventId.indexOf("QuickDraft") !== -1 ||
    eventId.indexOf("Ladder") !== -1
  );
}
