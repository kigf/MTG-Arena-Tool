import { createSlice } from "@reduxjs/toolkit";
import { WildcardsChange } from "../../../renderer/tabs/HomeTab";

const homeSlice = createSlice({
  name: "home",
  initialState: {
    wildcards: [] as WildcardsChange[],
    filteredSet: "",
    usersActive: 0
  },
  reducers: {
    setHomeData: (_state, action): any => action.payload
  }
});

export default homeSlice;
