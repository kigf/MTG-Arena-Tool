import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExploreQuery } from "mtgatool-shared";

const initialExploreState = {
  activeEvents: [] as string[],
  data: {
    results_type: "Ranked Constructed",
    skip: 0,
    results_number: 0,
    result: [] as any[],
  },
  filters: {
    filterEvent: "Ladder",
    filterType: "Ranked Constructed",
    filterSort: "By Winrate",
    filterSortDir: -1,
    filterSkip: 0,
    filterWCC: "",
    filterWCU: "",
    filterWCR: "",
    filterWCM: "",
    filteredMana: [],
    filteredRanks: [],
    onlyOwned: false,
  } as ExploreQuery,
};

type Explore = typeof initialExploreState;

const exploreSlice = createSlice({
  name: "explore",
  initialState: initialExploreState,
  reducers: {
    setExploreData: (
      state: Explore,
      action: PayloadAction<Explore["data"]>
    ): void => {
      const isSameResultType =
        state.data.results_type === action.payload.results_type;
      const isSubsequentResult = action.payload.skip > state.data.skip;
      if (isSameResultType && isSubsequentResult) {
        // when possible, extend prevous data
        const result = state.data.result.concat(action.payload.result);
        const resultsNumber =
          state.data.results_number + action.payload.results_number;
        action.payload.result = result;
        action.payload.results_number = resultsNumber;
        state.data = action.payload;
      } else if (action.payload.results_number === 0) {
        // query has no future results
        if (!isSubsequentResult) {
          state.data = action.payload;
        }
        state.data.results_number = -1;
      } else {
        state.data = action.payload;
      }
    },
    setExploreFilters: (
      state: Explore,
      action: PayloadAction<ExploreQuery>
    ): void => {
      state.filters = action.payload;
    },
    setExploreFiltersSkip: (
      state: Explore,
      action: PayloadAction<number>
    ): void => {
      state.filters.filterSkip = action.payload;
    },
    setActiveEvents: (state: Explore, action: PayloadAction<string>): void => {
      state.activeEvents.push(...action.payload);
      state.activeEvents = [...new Set(state.activeEvents)];
    },
  },
});

export const {
  setActiveEvents,
  setExploreData,
  setExploreFilters,
  setExploreFiltersSkip,
} = exploreSlice.actions;

export default exploreSlice;
