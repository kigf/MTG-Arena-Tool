/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../shared/redux/stores/rendererStore";
import ReactSelect from "../../../shared/ReactSelect";
import css from "./Sections.css";
import Button from "../misc/Button";
import { ipcSend } from "../../rendererUtil";
import Bullet from "../misc/Bullet";
import Flex from "../misc/Flex";
import { constants } from "mtgatool-shared";

const { ROLE_PATREON, ROLE_DEVELOPER, ROLE_ADMIN } = constants;

export default function SectionAdmin(): JSX.Element {
  const _settings = useSelector((state: AppState) => state.settings);
  const role = useSelector((state: AppState) => state.renderer.role);
  const activeEvents = useSelector(
    (state: AppState) => state.explore.activeEvents
  );

  const [selectedEvent, setSelectedEvent] = useState(activeEvents[0]);

  const updateExplore = useCallback(() => {
    ipcSend("admin_update_explore", selectedEvent);
  }, [selectedEvent]);

  return (
    <>
      <div style={{ marginLeft: "4px", lineHeight: "32px" }}>
        <Flex>
          <Bullet checked={role & ROLE_PATREON ? true : false} />
          Patreon
        </Flex>
        <Flex>
          <Bullet checked={role & ROLE_DEVELOPER ? true : false} />
          Developer
        </Flex>
        <Flex>
          <Bullet checked={role & ROLE_ADMIN ? true : false} />
          Admin
        </Flex>
      </div>
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
