import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import defaultConfig from "../../defaultConfig";

const initialSettings = { ...defaultConfig.settings };

type Settings = typeof initialSettings;

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    ...defaultConfig.settings,
  },
  reducers: {
    setSettings: (
      state: Settings,
      action: PayloadAction<Partial<Settings>>
    ): void => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setSettings } = settingsSlice.actions;

export default settingsSlice;
