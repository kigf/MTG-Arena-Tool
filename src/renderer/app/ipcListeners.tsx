/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-console */
import { ipcRenderer as ipc, IpcRendererEvent } from "electron";
import timestamp from "../../shared/utils/timestamp";
import {
  MAIN_SETTINGS,
  SETTINGS_OVERLAY,
  IPC_NONE,
  LOGIN_OK,
} from "../../shared/constants";
import { ipcSend } from "../rendererUtil";
import {
  LOGIN_FAILED,
  LOGIN_WAITING,
  SETTINGS_ABOUT,
} from "../../shared/constants";
import { reduxAction } from "../../shared/redux/sharedRedux";
import globalStore from "../../shared/store";
import { ArenaV3Deck } from "../../types/Deck";
import { AnyAction, Dispatch } from "redux";
import store from "../../shared/redux/stores/rendererStore";

export default function ipcListeners(dispatcher: Dispatch<AnyAction>): void {
  console.log("Set up IPC listeners.");

  ipc.on("prefill_auth_form", (_event: IpcRendererEvent, arg: any): void => {
    reduxAction(
      dispatcher,
      {
        type: "SET_LOGIN_FORM",
        arg: {
          email: arg.username,
          pass: arg.password,
          rememberme: arg.rememberMe,
        },
      },
      IPC_NONE
    );
  });

  ipc.on("clear_pwd", (): void => {
    reduxAction(dispatcher, { type: "SET_LOGIN_PASSWORD", arg: "" }, IPC_NONE);
  });

  ipc.on("login_failed", (): void => {
    reduxAction(
      dispatcher,
      { type: "SET_LOGIN_STATE", arg: LOGIN_FAILED },
      IPC_NONE
    );
  });

  ipc.on("begin_login", (): void => {
    reduxAction(dispatcher, { type: "SET_LOADING", arg: true }, IPC_NONE);
    reduxAction(
      dispatcher,
      { type: "SET_LOGIN_STATE", arg: LOGIN_WAITING },
      IPC_NONE
    );
  });

  ipc.on("auth", (_event: IpcRendererEvent, arg: any): void => {
    reduxAction(dispatcher, { type: "SET_LOADING", arg: true }, IPC_NONE);
    if (arg.ok) {
      reduxAction(
        dispatcher,
        { type: "SET_LOGIN_STATE", arg: LOGIN_WAITING },
        IPC_NONE
      );
      if (arg.user == -1) {
        reduxAction(dispatcher, { type: "SET_OFFLINE", arg: true }, IPC_NONE);
      }
      if (arg.patreon) {
        reduxAction(
          dispatcher,
          {
            type: "SET_PATREON",
            arg: {
              patreon: arg.patreon,
              patreonTier: arg.patreon_tier,
            },
          },
          IPC_NONE
        );
      }
    } else {
      reduxAction(dispatcher, { type: "SET_LOADING", arg: false }, IPC_NONE);
      reduxAction(
        dispatcher,
        { type: "SET_LOGIN_STATE", arg: LOGIN_FAILED },
        IPC_NONE
      );
    }
  });

  ipc.on("offline", (): void => {
    reduxAction(dispatcher, { type: "SET_OFFLINE", arg: true }, IPC_NONE);
  });

  ipc.on("toggle_login", (_event: IpcRendererEvent, arg: any): void => {
    reduxAction(dispatcher, { type: "SET_CAN_LOGIN", arg: arg }, IPC_NONE);
  });

  ipc.on(
    "popup",
    (_event: IpcRendererEvent, text: string, time: number): void => {
      const newTime = timestamp() + time;
      reduxAction(
        dispatcher,
        {
          type: "SET_POPUP",
          arg: {
            text: text,
            time: newTime,
            duration: time,
          },
        },
        IPC_NONE
      );
    }
  );

  ipc.on(
    "force_open_settings",
    (_event: IpcRendererEvent, arg?: number): void => {
      const loginState = store.getState().login.loginState;
      if (loginState == LOGIN_OK) {
        reduxAction(
          dispatcher,
          { type: "SET_TOPNAV", arg: MAIN_SETTINGS },
          IPC_NONE
        );
        reduxAction(dispatcher, { type: "SET_NAV_INDEX", arg: 0 }, IPC_NONE);
        if (arg === -1) {
          ipcSend("save_user_settings", { last_open_tab: MAIN_SETTINGS });
        } else {
          ipcSend("save_user_settings", {
            last_open_tab: MAIN_SETTINGS,
            last_settings_section: arg,
          });
        }
      } else {
        reduxAction(
          dispatcher,
          { type: "SET_AUTH_SETTINGS", arg: true },
          IPC_NONE
        );
      }
    }
  );

  ipc.on(
    "force_open_overlay_settings",
    (_event: IpcRendererEvent, arg: number): void => {
      reduxAction(dispatcher, { type: "SET_NAV_INDEX", arg: 0 }, IPC_NONE);
      reduxAction(
        dispatcher,
        { type: "SET_TOPNAV", arg: MAIN_SETTINGS },
        IPC_NONE
      );
      ipcSend("save_user_settings", {
        last_open_tab: MAIN_SETTINGS,
        last_settings_section: SETTINGS_OVERLAY,
        last_settings_overlay_section: arg,
      });
    }
  );

  ipc.on("force_open_about", (): void => {
    reduxAction(dispatcher, { type: "SET_NAV_INDEX", arg: 0 }, IPC_NONE);
    reduxAction(
      dispatcher,
      { type: "SET_TOPNAV", arg: MAIN_SETTINGS },
      IPC_NONE
    );
    ipcSend("save_user_settings", {
      last_open_tab: MAIN_SETTINGS,
      last_settings_section: SETTINGS_ABOUT,
    });
  });

  ipc.on("set_home", (_event: IpcRendererEvent, arg: any): void => {
    reduxAction(dispatcher, { type: "SET_LOADING", arg: false }, IPC_NONE);
    reduxAction(
      dispatcher,
      {
        type: "SET_HOME_DATA",
        arg: {
          wildcards: arg.wildcards,
          filteredSet: arg.filtered_set,
          usersActive: arg.users_active,
        },
      },
      IPC_NONE
    );
    console.log("Home", arg);
  });

  ipc.on("set_explore_decks", (_event: IpcRendererEvent, arg: any): void => {
    console.log("Explore", arg);
    reduxAction(dispatcher, { type: "SET_LOADING", arg: false }, IPC_NONE);
    reduxAction(dispatcher, { type: "SET_EXPLORE_DATA", arg: arg }, IPC_NONE);
    reduxAction(
      dispatcher,
      { type: "SET_EXPLORE_FILTERS_SKIP", arg: arg.results_number },
      IPC_NONE
    );
  });

  ipc.on("set_update_state", (_event: IpcRendererEvent, arg: any): void => {
    reduxAction(dispatcher, { type: "SET_UPDATE_STATE", arg: arg }, IPC_NONE);
  });

  ipc.on("no_log", (_event: IpcRendererEvent, arg: string) => {
    if (arg) {
      reduxAction(
        dispatcher,
        { type: "SET_APP_SETTINGS", arg: { logUri: arg } },
        IPC_NONE
      );
    }
    reduxAction(dispatcher, { type: "SET_NO_LOG", arg: true }, IPC_NONE);
  });

  ipc.on("set_draft_link", function (_event: IpcRendererEvent, arg: string) {
    reduxAction(
      dispatcher,
      { type: "SET_SHARE_DIALOG_URL", arg: arg },
      IPC_NONE
    );
    reduxAction(dispatcher, { type: "SET_LOADING", arg: false }, IPC_NONE);
  });

  ipc.on("set_log_link", function (_event: IpcRendererEvent, arg: string) {
    reduxAction(
      dispatcher,
      { type: "SET_SHARE_DIALOG_URL", arg: arg },
      IPC_NONE
    );
    reduxAction(dispatcher, { type: "SET_LOADING", arg: false }, IPC_NONE);
  });

  ipc.on("set_deck_link", function (_event: IpcRendererEvent, arg: string) {
    reduxAction(
      dispatcher,
      { type: "SET_SHARE_DIALOG_URL", arg: arg },
      IPC_NONE
    );
    reduxAction(dispatcher, { type: "SET_LOADING", arg: false }, IPC_NONE);
  });

  ipc.on("set_active_events", function (_event: IpcRendererEvent, arg: string) {
    if (!arg) return;
    try {
      const activeEvents = JSON.parse(arg);
      reduxAction(
        dispatcher,
        { type: "SET_ACTIVE_EVENTS", arg: activeEvents },
        IPC_NONE
      );
    } catch (e) {
      console.log("(set_active_events) Error parsing JSON:", arg);
    }
  });

  ipc.on("set_precon_decks", (_event: IpcRendererEvent, arg: string) => {
    try {
      const json = JSON.parse(arg);
      json.forEach(
        (deck: ArenaV3Deck) => (globalStore.preconDecks[deck.id] = deck)
      );
    } catch (e) {
      console.log("Error parsing JSON:", arg);
    }
  });
}
