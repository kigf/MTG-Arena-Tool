import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import globalStore from "../../store";
import { InternalEvent } from "mtgatool-shared/dist/types/event";

const initialEventsState = {
  eventsIndex: [] as string[],
};

type Events = typeof initialEventsState;

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    eventsIndex: [] as string[],
  },
  reducers: {
    setEvent: (state: Events, action: PayloadAction<InternalEvent>): void => {
      const event = action.payload;
      globalStore.events[event.id] = { ...event };
      if (state.eventsIndex.indexOf(event.id) === -1) {
        state.eventsIndex.push(event.id);
      }
    },
    setManyEvents: (
      state: Events,
      action: PayloadAction<InternalEvent[]>
    ): void => {
      const newList: string[] = [];
      action.payload.map((event: InternalEvent) => {
        if (state.eventsIndex.indexOf(event.id) === -1) {
          globalStore.events[event.id] = event;
          newList.push(event.id);
        }
      });
      state.eventsIndex = [...newList, ...state.eventsIndex];
    },
  },
});

export const { setEvent, setManyEvents } = eventsSlice.actions;
export default eventsSlice;
