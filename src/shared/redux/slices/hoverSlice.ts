import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialHover = {
  grpId: 0,
  opacity: 0,
  wanted: 0,
};

type Hover = typeof initialHover;

const hoverSlice = createSlice({
  name: "hover",
  initialState: {
    grpId: 0,
    opacity: 0,
    wanted: 0,
  },
  reducers: {
    setHoverIn: (
      state: Hover,
      action: PayloadAction<{ grpId: number; wanted?: number }>
    ): void => {
      const { grpId, wanted } = action.payload;
      Object.assign(state, {
        grpId: grpId,
        wanted: wanted ?? 0,
        opacity: 1,
      });
    },
    setHoverOut: (
      state: Hover,
      _action: PayloadAction<{ grpId?: number; wanted?: number }>
    ): void => {
      state.opacity = 0;
    },
  },
});

export const { setHoverIn, setHoverOut } = hoverSlice.actions;

export default hoverSlice;
