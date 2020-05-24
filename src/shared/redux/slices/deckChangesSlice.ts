import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import globalStore from "../../store";
import { DeckChange } from "../../../types/Deck";

const initialDeckChangesState = {
  deckChangesIndex: [] as string[],
};

type DeckChanges = typeof initialDeckChangesState;

const deckChangesSlice = createSlice({
  name: "deckChanges",
  initialState: {
    deckChangesIndex: [] as string[],
  },
  reducers: {
    setChange: (
      state: DeckChanges,
      action: PayloadAction<DeckChange>
    ): void => {
      const change = action.payload as DeckChange;
      globalStore.deckChanges[change.id] = { ...change };
      if (state.deckChangesIndex.indexOf(change.id) === -1) {
        state.deckChangesIndex.push(change.id);
      }
    },
    setManyChanges: (
      state: DeckChanges,
      action: PayloadAction<DeckChange[]>
    ): void => {
      const newList: string[] = [];
      action.payload.map((change: DeckChange) => {
        if (state.deckChangesIndex.indexOf(change.id) === -1) {
          newList.push(change.id);
        }
        globalStore.deckChanges[change.id] = change;
      });
      state.deckChangesIndex = [...newList, ...state.deckChangesIndex];
    },
  },
});

export const { setChange, setManyChanges } = deckChangesSlice.actions;
export default deckChangesSlice;
