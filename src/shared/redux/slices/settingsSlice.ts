import { createSlice } from "@reduxjs/toolkit";
import defaultConfig from "../../defaultConfig";

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    ...defaultConfig.settings
  },
  reducers: {
    setSettings: (state, action): void => {
      Object.assign(state, action.payload);
    }
  }
});

export default settingsSlice;
