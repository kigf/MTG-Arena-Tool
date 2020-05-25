/* eslint-disable @typescript-eslint/camelcase */
import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import settingsSlice from "../slices/settingsSlice";
import playerDataSlice from "../slices/playerDataSlice";
import rendererSlice from "../slices/rendererSlice";
import hoverSlice from "../slices/hoverSlice";
import overlaySlice from "../slices/overlaySlice";

const rootReducer = combineReducers({
  settings: settingsSlice.reducer,
  playerdata: playerDataSlice.reducer,
  renderer: rendererSlice.reducer,
  hover: hoverSlice.reducer,
  overlay: overlaySlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: [],
});

export default store;
export type AppState = ReturnType<typeof rootReducer>;
