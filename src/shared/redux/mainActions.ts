import * as SettingsSlice from "./slices/settingsSlice";
import * as AppSettingsSlice from "./slices/appSettingsSlice";
import * as RendererSlice from "./slices/rendererSlice";
import * as LoginSlice from "./slices/loginSlice";

const actions = {
  SET_SETTINGS: SettingsSlice.setSettings,
  SET_APP_SETTINGS: AppSettingsSlice.setAppSettings,
  SET_ARCHIVED: RendererSlice.setArchived,
  SET_BACK_COLOR: RendererSlice.setBackgroundColor,
  SET_BACK_GRPID: RendererSlice.setBackgroundGrpId,
  SET_BACK_IMAGE: RendererSlice.setBackgroundImage,
  SET_LOADING: RendererSlice.setLoading,
  SET_NO_LOG: RendererSlice.setNoLog,
  SET_OFFLINE: RendererSlice.setOffline,
  SET_PATREON: RendererSlice.setPatreon,
  SET_POPUP: RendererSlice.setPopup,
  SET_SHARE_DIALOG: RendererSlice.setShareDialog,
  SET_SHARE_DIALOG_OPEN: RendererSlice.setShareDialogOpen,
  SET_SHARE_DIALOG_URL: RendererSlice.setShareDialogUrl,
  SET_NAV_INDEX: RendererSlice.setNavIndex,
  SET_SUBNAV: RendererSlice.setSubNav,
  SET_TOPARTIST: RendererSlice.setTopArtist,
  SET_TOPNAV: RendererSlice.setTopNav,
  SET_UPDATE_STATE: RendererSlice.setUpdateState,
  SET_SYNC_STATE: RendererSlice.setSyncState,
  SET_TO_PUSH: RendererSlice.setSyncToPush,
  SET_CAN_LOGIN: LoginSlice.setCanLogin,
  SET_LOGIN_EMAIL: LoginSlice.setLoginEmail,
  SET_LOGIN_FORM: LoginSlice.setLoginForm,
  SET_LOGIN_PASSWORD: LoginSlice.setLoginPassword,
  SET_LOGIN_REMEMBER: LoginSlice.setLoginRemember,
  SET_LOGIN_STATE: LoginSlice.setLoginState,
};

export type MainActions = keyof typeof actions;

export default actions;
