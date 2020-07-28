import LogEntry from "../../types/logDecoder";
import { reduxAction } from "../../shared/redux/sharedRedux";
import globals from "../globals";
import { constants, SeasonAndRankDetail } from "mtgatool-shared";

const { IPC_RENDERER } = constants;

interface Entry extends LogEntry {
  json: () => SeasonAndRankDetail;
}

export default function onLabelInEventGetSeasonAndRankDetail(
  entry: Entry
): void {
  const json = entry.json();
  if (!json) return;

  reduxAction(
    globals.store.dispatch,
    { type: "SET_SEASON", arg: json },
    IPC_RENDERER
  );
}
