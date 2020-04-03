import React, { useState, useMemo, useCallback, useEffect } from "react";
import Slider, { SliderPosition } from "../misc/Slider";
import {
  GreMessage,
  TurnInfo,
  GameObject
} from "../../../types/greInterpreter";
import { InternalMatch } from "../../../types/match";
import { MatchData } from "../../../types/currentMatch";
import globals from "../../../window_background/globals";
import {
  GREMessage,
  instanceIdToObject
} from "../../../window_background/greToClientInterpreter";
import { getCardArtCrop } from "../../../shared/util";
import useHoverCard from "../../hooks/useHoverCard";

interface ReplayProps {
  matchData: InternalMatch;
  replayStr: string;
}

export default function Replay(props: ReplayProps): JSX.Element {
  const GREMessages: GreMessage[] = useMemo(
    () => JSON.parse(props.replayStr).filter((msg: GreMessage) => msg),
    [props.replayStr]
  );
  const [GREPos, setGREPos] = useState({ current: 0, prev: 0 });
  const [currentMatch, setCurrentMatch] = useState(globals.currentMatch);
  const [autoplay, setAutoplay] = useState(false);

  const sliderChange = useCallback(
    (pos: number): void => {
      setGREPos({ prev: GREPos.prev, current: pos });
    },
    [GREPos]
  );

  // Step only one
  const advanceOne = useCallback(() => {
    if (GREPos.current < GREMessages.length) {
      setGREPos({ prev: GREPos.prev, current: GREPos.current + 1 });
    } else {
      setAutoplay(false);
    }
  }, [GREPos, GREMessages.length]);

  const toggleAutoplay = useCallback(() => {
    setAutoplay(!autoplay);
  }, [autoplay]);

  // Play / pause logic
  useEffect(() => {
    if (autoplay) {
      const timerID = setInterval(
        () => advanceOne(),
        (props.matchData.duration * 1000) / GREMessages.length
      );
      return (): void => {
        clearInterval(timerID);
      };
    }
  }, [autoplay, advanceOne, props.matchData.duration, GREMessages.length]);

  // Calculate slider turn labels
  const sliderPos: SliderPosition[] = useMemo(() => {
    const arr = Array(GREMessages.length + 1).fill(
      new SliderPosition("", true)
    );
    let prevTurn = -1;
    GREMessages.forEach((msg: GreMessage, index: number) => {
      if (msg && msg.gameStateMessage && msg.gameStateMessage.turnInfo) {
        const turn = msg.gameStateMessage.turnInfo.turnNumber;
        if (prevTurn && turn && prevTurn < turn) {
          arr[index] = new SliderPosition("Turn " + turn);
          prevTurn = turn;
        }
      }
    });
    return arr;
  }, [GREMessages]);

  // Read GRE messages
  useEffect(() => {
    if (GREPos.current == GREPos.prev + 1) {
      GREMessage(GREMessages[GREPos.current], new Date());
    } else if (GREPos.current > GREPos.prev) {
      for (let i = GREPos.prev + 1; i < GREPos.current + 1; i++) {
        GREMessage(GREMessages[i], new Date());
      }
    } else if (GREPos.current < GREPos.prev) {
      for (let i = 0; i < GREPos.current + 1; i++) {
        GREMessage(GREMessages[i], new Date());
      }
    }
    setCurrentMatch(globals.currentMatch);
  }, [GREPos, GREMessages]);

  return (
    <div style={{ margin: "16px", height: "100%" }}>
      <BoardDrawer currentMatch={currentMatch} />
      <div
        className={"button-static"}
        onClick={toggleAutoplay}
        style={{
          backgroundImage: `url("../images/${autoplay ? "pause" : "play"}.png")`
        }}
      ></div>
      <div>
        <Slider
          positions={sliderPos}
          value={GREPos.current}
          onChange={sliderChange}
          max={GREMessages.length}
        />
      </div>
    </div>
  );
}

interface BoardDrawerProps {
  currentMatch: MatchData;
}

function BoardDrawer(props: BoardDrawerProps): JSX.Element {
  const match = props.currentMatch;

  // I know these are reversed.. but the board is reversed (why??)
  const opp = match.player.seat;
  const player = match.opponent.seat;

  const getZoneObjects = useCallback(
    (zoneName: string, owner = -1) => {
      let zoneData: number[] = [];
      Object.keys(match.zones).map((key: string) => {
        const zone = match.zones[key];
        if (
          zone.type == zoneName &&
          (owner == zone.ownerSeatId || owner == -1)
        ) {
          zoneData = zone.objectInstanceIds;
        }
      });
      return zoneData;
    },
    [match.zones]
  );

  return (
    <>
      <div className="replay-game-board">
        <div className="replay-board-turns">
          <TurnsIndicator turnInfo={match.turnInfo} />
        </div>
        <div className="replay-board-center">
          <div className="replay-board-riboon" />
        </div>

        <Zone
          gameObjs={getZoneObjects("ZoneType_Limbo")}
          type="hidden"
          className="replay-limbo"
        />
        <Zone
          gameObjs={getZoneObjects("ZoneType_Stack")}
          type="pile"
          className="replay-stack"
        />
        <Zone
          gameObjs={getZoneObjects("ZoneType_Hand", opp)}
          owner={opp}
          type="field"
          className="replay-opp-hand"
        />
        <Zone
          gameObjs={getZoneObjects("ZoneType_Library", opp)}
          owner={opp}
          type="pile"
          className="replay-opp-library"
        />
        <Zone
          gameObjs={getZoneObjects("ZoneType_Graveyard", opp)}
          owner={opp}
          type="pile"
          className="replay-opp-graveyard"
        />
        <Zone
          gameObjs={getZoneObjects("ZoneType_Exile", opp)}
          owner={opp}
          type="pile"
          className="replay-opp-exile"
        />
        <Zone
          gameObjs={getZoneObjects("ZoneType_Battlefield")}
          owner={opp}
          type="field"
          className="replay-opp-battlefield"
        />
        <Zone
          gameObjs={getZoneObjects("ZoneType_Battlefield")}
          owner={player}
          type="field"
          className="replay-player-battlefield"
        />
        <Zone
          gameObjs={getZoneObjects("ZoneType_Hand", player)}
          owner={player}
          type="field"
          className="replay-player-hand"
        />
        <Zone
          gameObjs={getZoneObjects("ZoneType_Library", player)}
          owner={player}
          type="pile"
          className="replay-player-library"
        />
        <Zone
          gameObjs={getZoneObjects("ZoneType_Graveyard", player)}
          owner={player}
          type="pile"
          className="replay-player-graveyard"
        />
        <Zone
          gameObjs={getZoneObjects("ZoneType_Exile", player)}
          owner={player}
          type="pile"
          className="replay-player-exile"
        />
      </div>
    </>
  );
}

function getActivePhase(turnInfo: TurnInfo): string {
  switch (turnInfo.step) {
    case "Step_Untap":
      return "Untap";
    case "Step_Upkeep":
      return "Upkeep";
    case "Step_Draw":
      return "Draw";
    case "Step_BeginCombat":
      return "Begin Combat";
    case "Step_DeclareAttack":
      return "Attack";
    case "Step_DeclareBlock":
      return "Block";
    case "Step_CombatDamage":
      return "Damage";
    case "Step_FirstStrikeDamage":
      return "Damage";
    case "Step_EndCombat":
      return "End Combat";
    case "Step_End":
      return "End";
    case "Step_Cleanup":
      return "Cleanup";
  }

  if (turnInfo.phase == "Phase_Main1") return "Main 1";
  if (turnInfo.phase == "Phase_Main2") return "Main 2";
  return "";
}

function TurnsIndicator({ turnInfo }: { turnInfo: TurnInfo }): JSX.Element {
  const active = getActivePhase(turnInfo);
  const phases = [
    "Untap",
    "Upkeep",
    "Draw",
    "Main 1",
    "Begin Combat",
    "Attack",
    "Block",
    "Damage",
    "End Combat",
    "Main 2",
    "End",
    "Cleanup"
  ];

  return (
    <>
      {phases.map((phase: string) => {
        return (
          <div
            key={"phase-indicator-" + phase}
            className={
              "replay-board-turn-indicator" + (phase == active ? " active" : "")
            }
          >
            {phase}
          </div>
        );
      })}
    </>
  );
}

interface ZoneProps {
  type: "hidden" | "field" | "pile";
  gameObjs: number[];
  className: string;
  owner?: number;
}

function Zone(props: ZoneProps): JSX.Element {
  if (props.type == "hidden") return <></>;
  return (
    <div className={props.className + " replay-zone-small"}>
      {props.gameObjs ? (
        props.gameObjs.map((id: number) => {
          try {
            const obj = instanceIdToObject(id);
            if (
              (props.owner && props.owner == obj.controllerSeatId) ||
              !props.owner
            ) {
              return <GameObj key={"gameobj-" + id} object={obj} />;
            }
          } catch (e) {
            // Do nothing, we cant draw this object
          }
        })
      ) : (
        <></>
      )}
    </div>
  );
}

interface GameObjProps {
  object: GameObject;
}

function GameObj(props: GameObjProps): JSX.Element {
  const { object } = props;
  const [hoverIn, hoverOut] = useHoverCard(object.grpId);
  const art = getCardArtCrop(object.grpId);
  const style: React.CSSProperties = { backgroundImage: `url(${art})` };

  return (
    <div
      onMouseEnter={hoverIn}
      onMouseOut={hoverOut}
      style={style}
      className="replay-gameobj"
    ></div>
  );
}
