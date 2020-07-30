import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import globalStore from "../../store";
import { InternalDraftv2 } from "mtgatool-shared";

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
    setDraft: (state: Drafts, action: PayloadAction<InternalDraftv2>): void => {
      const draft = action.payload as InternalDraftv2;
      if (draft.id) {
        globalStore.draftsv2[draft.id] = { ...draft };
        if (state.draftsIndex.indexOf(draft.id) === -1) {
          state.draftsIndex.push(draft.id);
        }
      }
    },
    setManyDrafts: (
      state: Drafts,
      action: PayloadAction<InternalDraftv2[]>
    ): void => {
      const newList: string[] = [];
      action.payload.map((draft: InternalDraftv2) => {
        if (draft.id && state.draftsIndex.indexOf(draft.id) === -1) {
          globalStore.draftsv2[draft.id] = draft;
          newList.push(draft.id);
        }
      });
      state.draftsIndex = [...newList, ...state.draftsIndex];
    },
  },
});

export const { setDraft, setManyDrafts } = draftsSlice.actions;
export default draftsSlice;
