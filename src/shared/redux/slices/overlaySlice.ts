import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialOverlayState = {
  isOverviewOpen: false,
};

type Overlay = typeof initialOverlayState;

const overlaySlice = createSlice({
  name: "overlay",
  initialState: initialOverlayState,
  reducers: {
    setOverviewOpen: (state: Overlay, action: PayloadAction<boolean>): void => {
      state.isOverviewOpen = action.payload;
    },
  },
});

export const { setOverviewOpen } = overlaySlice.actions;

export default overlaySlice;
