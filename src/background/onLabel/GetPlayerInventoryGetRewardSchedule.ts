import LogEntry from "../../types/logDecoder";
import { reduxAction } from "../../shared/redux/sharedRedux";
import globals from "../globals";
import { IPC_RENDERER } from "../../shared/constants";

interface Reward {
  wins: number;
  awardDescription: {
    image1: string | null;
    image2: string | null;
    image3: string | null;
    prefab: string;
    referenceId: string | null;
    headerLocKey: string;
    descriptionLocKey: string | null;
    quantity: string | null;
    locParams: { number1?: number; number2?: number; number3?: number };
    availableDate: string;
  };
}

interface EntryJson {
  dailyReset: string;
  weeklyReset: string;
  dailyRewards: Reward[];
  weeklyRewards: Reward[];
}

interface Entry extends LogEntry {
  json: () => EntryJson;
}

export default function GetPlayerInventoryGetRewardSchedule(
  entry: Entry
): void {
  const json = entry.json();
  if (!json) return;

  if (json.dailyReset) {
    if (!json.dailyReset.endsWith("Z")) {
      json.dailyReset = json.dailyReset + "Z";
    }

    reduxAction(
      globals.store.dispatch,
      { type: "SET_DAILY_ENDS", arg: json.dailyReset },
      IPC_RENDERER
    );
  }

  if (json.weeklyReset) {
    if (!json.weeklyReset.endsWith("Z")) {
      json.weeklyReset = json.weeklyReset + "Z";
    }

    reduxAction(
      globals.store.dispatch,
      { type: "SET_WEEKLY_ENDS", arg: json.weeklyReset },
      IPC_RENDERER
    );
  }
}
