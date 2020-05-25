/* eslint-disable react/prop-types */
import React from "react";
import db from "../database";
import useHoverCard from "../../renderer/hooks/useHoverCard";
import css from "./ActionLog.css";

interface ActionLogProps {
  logStr: string;
}

interface LogLine {
  seat: number;
  time: string;
  groups: RegExpMatchArray[];
  strings: string[];
}

export default function ActionLog(props: ActionLogProps): JSX.Element {
  const { logStr } = props;
  const actionLog = logStr.split("\n");

  const logP = [css.log_player0, css.log_player1, css.log_player2];

  const elements: LogLine[] = [];
  for (let line = 1; line < actionLog.length - 1; line += 3) {
    const seat = ("" + actionLog[line]).trim();
    const time = actionLog[line + 1];
    const str = actionLog[line + 2];

    const regex = new RegExp(
      /<log-(card|ability) id="(?<id>.*?)">.*?<\/log-(card|ability)>/,
      "g"
    );

    const groups = [...str.matchAll(regex)];
    const list = str.replace(regex, "\n").split("\n");

    const newObj: LogLine = {
      seat: parseInt(seat),
      time: time,
      groups: groups,
      strings: list,
    };

    elements.push(newObj);
  }

  return (
    <>
      {elements.map((line, i) => {
        return (
          <div key={i} className={`${css.actionlog} ${logP[line.seat]}`}>
            <div key={i + 1} className={css.actionlog_time}>
              {line.time}
            </div>
            <div key={i + 2} className={css.actionlog_text}>
              {line.strings.map((str, ii) => {
                if (line.groups.length == ii && str !== "") {
                  return <LogText key={i + "text" + ii}>{str}</LogText>;
                }
                if (line.groups[ii][1] == "card") {
                  return (
                    <LogCard
                      key={i + "card" + ii}
                      grpId={parseInt(line.groups[ii][2])}
                    >
                      {str}
                    </LogCard>
                  );
                }
                if (line.groups[ii][1] == "ability") {
                  return (
                    <LogAbility
                      key={i + "ability" + ii}
                      abId={parseInt(line.groups[ii][2])}
                    >
                      {str}
                    </LogAbility>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

interface LogTextProps {
  children: string;
}

function LogText(props: LogTextProps): JSX.Element {
  const { children } = props;
  return <div className={css.logText}>{children}</div>;
}

interface LogCardProps {
  children: string;
  grpId: number;
}

function LogCard(props: LogCardProps): JSX.Element {
  const { children, grpId } = props;
  const cardObj = db.card(grpId);
  const cardName = cardObj?.name;

  const [hoverIn, hoverOut] = useHoverCard(grpId);

  return (
    <>
      {children !== "" ? <LogText>{children}</LogText> : <></>}
      <div
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
        className={css.logCard}
      >
        {cardName}
      </div>
    </>
  );
}

interface LogAbilityProps {
  children: string;
  abId: number;
}

function LogAbility(props: LogAbilityProps): JSX.Element {
  const { children, abId } = props;
  const desc = db.ability(abId);

  return (
    <>
      {children !== "" ? <LogText>{children}</LogText> : <></>}
      <div title={desc} className={css.logAbility}>
        ability
      </div>
    </>
  );
}
