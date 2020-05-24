import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import globalStore from "../../store";
import { InternalDraft } from "../../../types/draft";

const initialDraftsState = {
  draftsIndex: [] as string[],
};

type Drafts = typeof initialDraftsState;

const draftsSlice = createSlice({
  name: "drafts",
  initialState: {
    draftsIndex: [] as string[],
  },
  reducers: {
    setDraft: (state: Drafts, action: PayloadAction<InternalDraft>): void => {
      const draft = action.payload as InternalDraft;
      globalStore.drafts[draft.id] = { ...draft };
      if (state.draftsIndex.indexOf(draft.id) === -1) {
        state.draftsIndex.push(draft.id);
      }
    },
    setManyDrafts: (
      state: Drafts,
      action: PayloadAction<InternalDraft[]>
    ): void => {
      const newList: string[] = [];
      action.payload.map((draft: InternalDraft) => {
        if (state.draftsIndex.indexOf(draft.id) === -1) {
          globalStore.drafts[draft.id] = draft;
          newList.push(draft.id);
        }
      });
      state.draftsIndex = [...newList, ...state.draftsIndex];
    },
  },
});

export const { setDraft, setManyDrafts } = draftsSlice.actions;
export default draftsSlice;
