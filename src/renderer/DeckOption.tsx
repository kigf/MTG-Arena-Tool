/*
  Not used / deprecated?
*/
import React from "react";
import { getDeckName, deckExists } from "../shared/store";
import indexCss from "./index.css";
import sharedCss from "../shared/shared.css";
import { WHITE, BLUE, BLACK, RED, GREEN, COLORLESS } from "../shared/constants";

const manaClasses: string[] = [];
manaClasses[WHITE] = sharedCss.manaW;
manaClasses[BLUE] = sharedCss.manaU;
manaClasses[BLACK] = sharedCss.manaB;
manaClasses[RED] = sharedCss.manaR;
manaClasses[GREEN] = sharedCss.manaG;
manaClasses[COLORLESS] = sharedCss.manaC;

export interface DeckOptionDeck {
  colors?: number[];
  name?: string;
  archived?: boolean;
}

export interface DeckOptionProps {
  deckId: string;
  deck: DeckOptionDeck;
}

export default function DeckOption(props: DeckOptionProps): JSX.Element {
  const { deckId, deck } = props;

  const exists = deckExists(deckId);
  const deckName: string = exists ? getDeckName(deckId) : deck.name || "";
  let maxChars = 10;
  if (exists && deck.colors) {
    maxChars = 16 - 2 * deck.colors.length;
  }

  return (
    <>
      {deckName.length > maxChars ? (
        <abbr title={deckName}>{deckName.slice(0, maxChars)}...</abbr>
      ) : (
        deckName
      )}
      {exists ? (
        <>
          {deck.archived && (
            <small>
              <i>(archived)</i>
            </small>
          )}
          <div className={indexCss.flexItem}>
            {deck.colors &&
              deck.colors.map((color) => (
                <div
                  className={sharedCss.manaS16 + " " + manaClasses[color - 1]}
                  key={color}
                />
              ))}
          </div>
        </>
      ) : (
        <small>
          <i>(deleted)</i>
        </small>
      )}
    </>
  );
}
