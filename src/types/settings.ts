import { TableState } from "react-table";
import { CardsData } from "../renderer/components/collection/types";
import { DecksData } from "../renderer/components/decks/types";
import { TransactionData } from "../renderer/components/economy/types";
import { EventTableData } from "../renderer/components/events/types";
import { MatchTableData } from "../renderer/components/matches/types";
import { SettingsData } from "mtgatool-shared/dist/types/settings";

export interface SettingsDataApp extends SettingsData {
  collectionTableState?: TableState<CardsData>;
  decksTableState?: TableState<DecksData>;
  economyTableState?: TableState<TransactionData>;
  eventsTableState?: TableState<EventTableData>;
  matchesTableState?: TableState<MatchTableData>;
}
