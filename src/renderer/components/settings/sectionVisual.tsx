import React, { useMemo, useCallback } from "react";
import _ from "lodash";
import ReactSelect from "../../../shared/ReactSelect";
import { IPC_ALL, IPC_RENDERER } from "../../../shared/constants";
import CardTile from "../../../shared/CardTile";
import db from "../../../shared/database-wrapper";
import Input from "../misc/Input";
//import Toggle from "../misc/Toggle";
//import useColorPicker from "../../hooks/useColorPicker";
import Slider from "../misc/Slider";
import { getCardImage } from "../../../shared/utils/getCardArtCrop";
import store, { AppState } from "../../../shared/redux/stores/rendererStore";
import { useSelector } from "react-redux";
import { reduxAction } from "../../../shared/redux/sharedRedux";

import css from "./Sections.css";
import indexCss from "../../index.css";
import { CardQuality } from "../../../types/settings";
import showOpenThemeDialog from "../../../shared/utils/showOpenThemeDialog";
import reloadTheme from "../../../shared/utils/reloadTheme";
import { ipcSend } from "../../../background/backgroundUtil";
/*
function changeBackgroundImage(value: string): void {
  reduxAction(
    store.dispatch,
    { type: "SET_SETTINGS", arg: { back_url: value || "default" } },
    IPC_ALL ^ IPC_RENDERER
  );
}

function backColorPicker(color: string): void {
  reduxAction(
    store.dispatch,
    { type: "SET_SETTINGS", arg: { back_color: color } },
    IPC_ALL ^ IPC_RENDERER
  );
}
*/
function setCardQuality(filter: CardQuality): void {
  reduxAction(
    store.dispatch,
    { type: "SET_SETTINGS", arg: { cards_quality: filter } },
    IPC_ALL ^ IPC_RENDERER
  );
}
/*
function backShadowCallback(checked: boolean): void {
  reduxAction(
    store.dispatch,
    { type: "SET_SETTINGS", arg: { back_shadow: checked } },
    IPC_ALL
  );
}
*/
const card = db.card(70344);

export default function SectionVisual(): JSX.Element {
  const settings = useSelector((state: AppState) => state.settings);
  const cardSize = 100 + settings.cards_size * 15;
  /*
  const containerRef: React.MutableRefObject<HTMLInputElement | null> = React.useRef(
    null
  );
  
  const [pickerColor, pickerDoShow, pickerElement] = useColorPicker(
    settings.back_color,
    undefined,
    backColorPicker
  );
  */

  // Hover card size slider
  const [hoverCardSize, setHoverCardSize] = React.useState(
    settings.cards_size_hover_card
  );

  const hoverCardSizeDebouce = useMemo(() => {
    return _.debounce((value: number) => {
      reduxAction(
        store.dispatch,
        { type: "SET_SETTINGS", arg: { cards_size_hover_card: value } },
        IPC_ALL ^ IPC_RENDERER
      );
    }, 500);
  }, []);

  const hoverCardSizeHandler = (value: number): void => {
    setHoverCardSize(value);
    hoverCardSizeDebouce(value);
  };

  // Collection card size slider
  const [collectionCardSize, setCollectionCardSize] = React.useState(
    settings.cards_size
  );

  const collectionCardSizeDebouce = useMemo(() => {
    return _.debounce((value: number) => {
      reduxAction(
        store.dispatch,
        { type: "SET_SETTINGS", arg: { cards_size: value } },
        IPC_ALL ^ IPC_RENDERER
      );
    }, 500);
  }, []);

  const collectionCardSizeHandler = (value: number): void => {
    setCollectionCardSize(value);
    collectionCardSizeDebouce(value);
  };

  const setThemeCallback = useCallback((uri: string) => {
    ipcSend("reload_theme", uri);
    reloadTheme(uri);
    reduxAction(
      store.dispatch,
      { type: "SET_SETTINGS", arg: { themeUri: uri } },
      IPC_ALL ^ IPC_RENDERER
    );
  }, []);

  const openPathDialog = React.useCallback(() => {
    showOpenThemeDialog(settings.themeUri).then(
      (value: Electron.OpenDialogReturnValue): void => {
        const paths = value.filePaths;
        if (paths && paths.length && paths[0]) {
          setThemeCallback(paths[0]);
        }
      }
    );
  }, [settings.themeUri, setThemeCallback]);

  return (
    <>
      <div className={css.centered_setting_container}>
        <label>Theme:</label>
        <div
          style={{
            display: "flex",
            width: "-webkit-fill-available",
            justifyContent: "flex-end",
          }}
        >
          <div className={indexCss.open_button} onClick={openPathDialog} />
          <Input
            key={settings.themeUri}
            callback={setThemeCallback}
            placeholder={"default"}
            value={settings.themeUri}
          />
        </div>
      </div>
      {/*
      <div className={css.centered_setting_container}>
        <label>Background URL:</label>
        <Input
          value={settings.back_url !== "default" ? settings.back_url : ""}
          placeholder="https://example.com/photo.png"
          callback={changeBackgroundImage}
        />
      </div>
      <Toggle
        text="Show Background Shade"
        value={settings.back_shadow}
        callback={backShadowCallback}
      />
      <label className={css.centered_setting_container}>
        <span style={{ marginRight: "32px" }}>Background hue:</span>
        <input
          onClick={pickerDoShow}
          ref={containerRef}
          style={{ backgroundColor: pickerColor }}
          className={css.color_picker}
          id={css.flat}
          type="text"
          defaultValue=""
        ></input>
      </label>
      {pickerElement}
      */}
      <div className={css.centered_setting_container}>
        {!!card && (
          <CardTile
            card={card}
            indent="a"
            isHighlighted={false}
            isSideboard={false}
            quantity={4}
            showWildcards={false}
          />
        )}
      </div>
      <div className={css.centered_setting_container}>
        <label>Image quality:</label>
        <ReactSelect
          options={["small", "normal", "large"]}
          current={settings.cards_quality}
          callback={setCardQuality}
        />
      </div>
      <div className={css.centered_setting_container}>
        <label style={{ width: "400px" }}>
          {`Hover card size: ${100 + Math.round(hoverCardSize) * 15}px`}
        </label>
        <Slider
          min={0}
          max={20}
          step={1}
          value={settings.cards_size_hover_card}
          onChange={hoverCardSizeHandler}
        />
      </div>

      <div className={css.centered_setting_container}>
        <label style={{ width: "400px" }}>
          {`Collection card size: ${
            100 + Math.round(collectionCardSize) * 15
          }px`}
        </label>
        <Slider
          min={0}
          max={20}
          step={1}
          value={settings.cards_size}
          onChange={collectionCardSizeHandler}
        />
      </div>

      <label style={{ marginLeft: "16px" }}>
        Example collection card:
        <div
          className={css.inventory_card_settings}
          style={{
            marginTop: "16px",
            width: cardSize + "px",
            alignSelf: "flex-start",
          }}
        >
          <img
            className={css.inventory_card_settings_img}
            style={{ width: cardSize + "px" }}
            src={getCardImage(card, settings.cards_quality)}
          />
        </div>
      </label>
    </>
  );
}
