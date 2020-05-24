/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useCallback } from "react";
import { remote } from "electron";
import {
  SHORTCUT_NAMES,
  IPC_ALL,
  IPC_RENDERER,
} from "../../../shared/constants";
import Toggle from "../misc/Toggle";
import Button from "../misc/Button";
import EditKey from "../popups/EditKey";
import { useSelector } from "react-redux";
import store, { AppState } from "../../../shared/redux/stores/rendererStore";
import { reduxAction } from "../../../shared/redux/sharedRedux";

import indexCss from "../../index.css";
import css from "./Sections.css";

function setKeyboardShortcuts(checked: boolean): void {
  reduxAction(
    store.dispatch,
    { type: "SET_SETTINGS", arg: { enable_keyboard_shortcuts: checked } },
    IPC_ALL ^ IPC_RENDERER
  );
}

function ShortcutsRow({
  code,
  index,
}: {
  code: string;
  index: number;
}): JSX.Element {
  const settings = useSelector((state: AppState) => state.settings);
  const [openDialog, setOpenDialog] = useState(false);
  const ld = index % 2 ? indexCss.lineDark : indexCss.lineLight;

  function openKeyCombinationDialog(): void {
    remote.globalShortcut.unregisterAll();
    setOpenDialog(true);
  }

  const closeKeyCombDialog = useCallback(
    (key: string): void => {
      setOpenDialog(false);
      reduxAction(
        store.dispatch,
        { type: "SET_SETTINGS", arg: { ...settings, [code]: key } },
        IPC_ALL ^ IPC_RENDERER
      );
    },
    [code, settings]
  );

  return (
    <>
      <div
        className={ld + " " + css.shortcuts_line}
        style={{ gridArea: `${index + 2} / 1 / auto / 2` }}
      >
        {SHORTCUT_NAMES[code]}
      </div>
      <div
        className={ld + " " + css.shortcuts_line}
        style={{ gridArea: `${index + 2} / 2 / auto / 3` }}
      >
        {((settings as unknown) as Record<string, string>)[code]}
      </div>
      <div
        className={ld + " " + css.shortcuts_line}
        style={{ gridArea: `${index + 2} / 3 / auto / 4` }}
      >
        <Button
          text="Edit"
          className={indexCss.buttonSimple + " " + indexCss.buttonEdit}
          onClick={openKeyCombinationDialog}
        />
      </div>
      {openDialog ? <EditKey closeCallback={closeKeyCombDialog} /> : <></>}
    </>
  );
}

export default function SectionShortcuts(): JSX.Element {
  const enableKeyboardShortcuts = useSelector(
    (state: AppState) => state.settings.enable_keyboard_shortcuts
  );
  return (
    <>
      <Toggle
        text="Enable keyboard shortcuts"
        value={enableKeyboardShortcuts}
        callback={setKeyboardShortcuts}
      />
      <div className={css.settings_note} style={{ margin: "24px 16px 16px" }}>
        Click Edit to change a shortcut
      </div>
      <div className={css.shortcuts_grid}>
        <div
          className={`${indexCss.lineDark} ${indexCss.line_bottom_border} ${css.shortcuts_line}`}
          style={{ gridArea: "1 / 1 / auto / 3" }}
        >
          Action
        </div>
        <div
          className={`${indexCss.lineDark} ${indexCss.line_bottom_border} ${css.shortcuts_line}`}
          style={{ gridArea: "1 / 2 / auto / 4" }}
        >
          Shortcut
        </div>
        {Object.keys(SHORTCUT_NAMES).map((key: string, index: number) => (
          <ShortcutsRow key={key} code={key} index={index} />
        ))}
      </div>
    </>
  );
}
