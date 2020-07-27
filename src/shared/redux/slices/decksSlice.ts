import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import globalStore from "../../store";
import { InternalDeck } from "mtgatool-shared/dist/types/deck";

const initialDecksState = {
  decksIndex: [] as string[],
  privateDecks: [] as string[],
};

type Decks = typeof initialDecksState;

const decksSlice = createSlice({
  name: "decks",
  initialState: initialDecksState,
  reducers: {
    setDeck: (state: Decks, action: PayloadAction<InternalDeck>): void => {
      const deck = action.payload;
      globalStore.decks[deck.id] = { ...deck };
      if (state.decksIndex.indexOf(deck.id) === -1) {
        state.decksIndex.push(deck.id);
      }
    },
    setManyDecks: (
      state: Decks,
      action: PayloadAction<InternalDeck[]>
    ): void => {
      const newList: string[] = [];
      action.payload.map((deck: InternalDeck) => {
        if (state.decksIndex.indexOf(deck.id) === -1) {
          globalStore.decks[deck.id] = deck;
          newList.push(deck.id);
        }
      });
      state.decksIndex = [...newList, ...state.decksIndex];
    },
    setManyStaticDecks: (
      state: Decks,
      action: PayloadAction<InternalDeck[]>
    ): void => {
      const newList: string[] = [];
      action.payload.map((deck: InternalDeck) => {
        globalStore.decks[deck.id] = deck;
        if (globalStore.staticDecks.indexOf(deck.id) === -1) {
          globalStore.staticDecks.push(deck.id);
        }
        if (state.decksIndex.indexOf(deck.id) === -1) {
          newList.push(deck.id);
        }
      });
      state.decksIndex = [...newList, ...state.decksIndex];
    },
    setPrivateDecks: (state: Decks, action: PayloadAction<string[]>): void => {
      const toAdd: string[] = [];
      action.payload.forEach((id: string) => {
        if (state.privateDecks.indexOf(id) === -1) {
          toAdd.push(id);
        }
      });
      state.privateDecks = [...state.privateDecks, ...toAdd];
    },
    removePrivateDecks: (
      state: Decks,
      action: PayloadAction<string[]>
    ): void => {
      const filtered = state.privateDecks.filter(
        (id) => action.payload.indexOf(id) === -1
      );

      state.privateDecks = [...filtered];
    },
  },
});

export const {
  setDeck,
  setManyDecks,
  setManyStaticDecks,
  setPrivateDecks,
  removePrivateDecks,
} = decksSlice.actions;
export default decksSlice;
