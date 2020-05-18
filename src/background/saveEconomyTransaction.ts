import { playerDb } from "../shared/db/LocalDatabase";
import { InternalEconomyTransaction } from "../types/inventory";
import { getTransaction, transactionExists } from "../shared/store";
import globals from "./globals";
import { IPC_RENDERER } from "../shared/constants";
import { reduxAction } from "../shared/redux/sharedRedux";
import { httpSetEconomy } from "./httpApi";

export default function saveEconomyTransaction(
  transaction: InternalEconomyTransaction
): void {
  const id = transaction.id;
  const txnData = {
    // preserve custom fields if possible
    ...(getTransaction(id) || {}),
    ...transaction,
  };

  if (!transactionExists(id)) {
    const economyIndex = [...globals.store.getState().economy.economyIndex, id];
    playerDb.upsert("", "economy_index", economyIndex);
  }
  reduxAction(globals.store.dispatch, "SET_ECONOMY", txnData, IPC_RENDERER);
  playerDb.upsert("", id, txnData);
  httpSetEconomy(txnData);
}
