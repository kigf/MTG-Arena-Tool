import { createSlice } from "@reduxjs/toolkit";

// Just an example slice.
const counterSlice = createSlice({
  name: "counter",
  initialState: 0,
  reducers: {
    increment: (state): number => state + 1,
    decrement: (state): number => state - 1,
  },
});

export default counterSlice;
