import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SeasonAndRankDetail, Format } from "mtgatool-shared";

interface ShareDialog {
  open: boolean;
  url: string;
  type: string;
  data: any;
  id: string;
}

interface SubNav {
  type: number;
  id: string;
  data?: any;
}

export const initialRendererState = {
  archivedCache: {} as Record<string, boolean>,
  backgroundColor: "rgba(0, 0, 0, 0.25)",
  backgroundGrpId: 0,
  backgroundImage: "default",
  loading: false,
  noLog: false,
  offline: false,
  patreon: {
    patreon: false,
    patreonTier: -1,
  },
  role: 0,
  syncState: 0,
  syncToPush: {
    courses: [] as string[],
    matches: [] as string[],
    drafts: [] as string[],
    economy: [] as string[],
    seasonal: [] as string[],
  },
  popup: {
    text: "",
    time: 0,
    duration: 0,
  },
  formats: {} as Record<string, Format>,
  season: {} as SeasonAndRankDetail,
  rewards_daily_ends: "",
  rewards_weekly_ends: "",
  authSettings: false,
  shareDialog: {
    open: false,
    url: "",
    type: "",
    data: {},
    id: "",
  } as ShareDialog,
  detailedLogsDialog: false,
  subNav: {
    type: -1,
    id: "",
    data: null,
  } as SubNav,
  topArtist: "Sublime Epiphany by Lindsey Look",
  topNav: 0,
  navIndex: 0,
  updateState: "",
};

type RendererState = typeof initialRendererState;

const rendererSlice = createSlice({
  name: "renderer",
  initialState: initialRendererState,
  reducers: {
    setBackgroundColor: (
      state: RendererState,
      action: PayloadAction<string>
    ): void => {
      state.backgroundColor = action.payload;
    },
    setBackgroundGrpId: (
      state: RendererState,
      action: PayloadAction<number>
    ): void => {
      state.backgroundGrpId = action.payload;
    },
    setBackgroundImage: (
      state: RendererState,
      action: PayloadAction<string>
    ): void => {
      state.backgroundImage = action.payload;
    },
    setDetailedLogsDialog: (
      state: RendererState,
      action: PayloadAction<boolean>
    ): void => {
      state.detailedLogsDialog = action.payload;
    },
    setLoading: (
      state: RendererState,
      action: PayloadAction<boolean>
    ): void => {
      state.loading = action.payload;
    },
    setNoLog: (state: RendererState, action: PayloadAction<boolean>): void => {
      state.noLog = action.payload;
    },
    setOffline: (
      state: RendererState,
      action: PayloadAction<boolean>
    ): void => {
      state.offline = action.payload;
    },
    setPatreon: (
      state: RendererState,
      action: PayloadAction<RendererState["patreon"]>
    ): void => {
      state.patreon = action.payload;
    },
    setRole: (
      state: RendererState,
      action: PayloadAction<RendererState["role"]>
    ): void => {
      state.role = action.payload;
    },
    setPopup: (
      state: RendererState,
      action: PayloadAction<RendererState["popup"]>
    ): void => {
      state.popup = action.payload;
    },
    setShareDialog: (
      state: RendererState,
      action: PayloadAction<Partial<RendererState["shareDialog"]>>
    ): void => {
      Object.assign(state.shareDialog, action.payload);
      state.shareDialog.open = true;
    },
    setShareDialogOpen: (
      state: RendererState,
      action: PayloadAction<boolean>
    ): void => {
      state.shareDialog.open = action.payload;
    },
    setShareDialogUrl: (
      state: RendererState,
      action: PayloadAction<string>
    ): void => {
      state.shareDialog.url = action.payload;
    },
    setSubNav: (state: RendererState, action: PayloadAction<SubNav>): void => {
      if (action.payload.type == -1) {
        state.navIndex = 0;
      } else {
        state.navIndex = 1;
      }
      state.subNav = action.payload;
    },
    setTopArtist: (
      state: RendererState,
      action: PayloadAction<string>
    ): void => {
      state.topArtist = action.payload;
    },
    setTopNav: (state: RendererState, action: PayloadAction<number>): void => {
      state.navIndex = 0;
      state.topNav = action.payload;
    },
    setNavIndex: (
      state: RendererState,
      action: PayloadAction<number>
    ): void => {
      state.navIndex = action.payload;
    },
    setAuthSettings: (
      state: RendererState,
      action: PayloadAction<boolean>
    ): void => {
      state.authSettings = action.payload;
    },
    setFormats: (
      state: RendererState,
      action: PayloadAction<Record<string, Format>>
    ): void => {
      state.formats = action.payload;
    },
    setUpdateState: (
      state: RendererState,
      action: PayloadAction<string>
    ): void => {
      state.updateState = action.payload;
    },
    setArchived: (
      state: RendererState,
      action: PayloadAction<{ id: string; archived: boolean }>
    ): void => {
      const { id, archived } = action.payload;
      if (!id) return;
      // update local cache (avoids round trip)
      state.archivedCache[id] = !!archived;
    },
    setSyncState: (
      state: RendererState,
      action: PayloadAction<number>
    ): void => {
      state.syncState = action.payload;
    },
    setSyncToPush: (
      state: RendererState,
      action: PayloadAction<RendererState["syncToPush"]>
    ): void => {
      state.syncToPush = { ...action.payload };
    },
    setSeason: (
      state: RendererState,
      action: PayloadAction<SeasonAndRankDetail>
    ): void => {
      state.season = action.payload;
    },
    setRewardsDailyEnds: (
      state: RendererState,
      action: PayloadAction<string>
    ): void => {
      state.rewards_daily_ends = action.payload;
    },
    setRewardsWeeklyEnds: (
      state: RendererState,
      action: PayloadAction<string>
    ): void => {
      state.rewards_weekly_ends = action.payload;
    },
  },
});

export const {
  setBackgroundColor,
  setBackgroundGrpId,
  setBackgroundImage,
  setDetailedLogsDialog,
  setLoading,
  setNoLog,
  setOffline,
  setPatreon,
  setRole,
  setPopup,
  setArchived,
  setShareDialog,
  setShareDialogOpen,
  setShareDialogUrl,
  setNavIndex,
  setFormats,
  setAuthSettings,
  setSubNav,
  setTopNav,
  setTopArtist,
  setUpdateState,
  setSyncState,
  setSyncToPush,
  setSeason,
  setRewardsDailyEnds,
  setRewardsWeeklyEnds,
} = rendererSlice.actions;

export default rendererSlice;
