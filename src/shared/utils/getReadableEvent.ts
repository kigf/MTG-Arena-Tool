import database from "../database";

export default function getReadableEvent(arg: string): string {
  if (database.events[arg] != undefined) {
    return database.events[arg];
  }

  return arg;
}
