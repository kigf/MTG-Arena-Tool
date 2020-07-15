/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../shared/redux/stores/rendererStore";
import ReactSelect from "../../../shared/ReactSelect";
import css from "./Sections.css";
import Button from "../misc/Button";
import { ipcSend } from "../../rendererUtil";

export default function SectionAbout(): JSX.Element {
  const _settings = useSelector((state: AppState) => state.settings);
  const activeEvents = useSelector(
    (state: AppState) => state.explore.activeEvents
  );

  const [selectedEvent, setSelectedEvent] = useState(activeEvents[0]);

  const updateExplore = useCallback(() => {
    ipcSend("admin_update_explore", selectedEvent);
  }, [selectedEvent]);

  return (
    <>
      <div className={css.centered_setting_container}>
        <label>Force update explore</label>
        <ReactSelect
          options={activeEvents}
          current={selectedEvent}
          callback={(filter: string): void => setSelectedEvent(filter)}
        />
        <Button onClick={updateExplore} text="Update" />
      </div>
    </>
  );
}
