import playerData from "../shared/PlayerData";
import { setData } from "./backgroundUtil";
import { playerDb } from "../shared/db/LocalDatabase";
import { InternalEconomyTransaction } from "../types/inventory";

export default function saveEconomyTransaction(
  transaction: InternalEconomyTransaction
): void {
  const id = transaction.id;
  const txnData = {
    // preserve custom fields if possible
    ...(playerData.transaction(id) || {}),
    ...transaction
  };

  if (!playerData.economy_index.includes(id)) {
    const economyIndex = [...playerData.economy_index, id];
    playerDb.upsert("", "economy_index", economyIndex);
    setData({ economy_index: economyIndex }, false);
  }

  playerDb.upsert("", id, txnData);
  setData({ [id]: txnData });
  const httpApi = require("./httpApi");
  httpApi.httpSetEconomy(txnData);
}
