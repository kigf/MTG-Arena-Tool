/*
  Not used / deprecated?
*/
import React from "react";
import { getDeckName, deckExists } from "../shared/store";
import css from "./index.css";
import sharedCss from "../shared/shared.css";

const manaClasses: string[] = [];
manaClasses[0] = sharedCss.mana_w;
manaClasses[1] = sharedCss.mana_u;
manaClasses[2] = sharedCss.mana_b;
manaClasses[3] = sharedCss.mana_r;
manaClasses[4] = sharedCss.mana_g;
manaClasses[5] = sharedCss.mana_c;

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

  const deckName: string = deckExists(deckId)
    ? getDeckName(deckId)
    : deck.name || "";
  let maxChars = 10;
  if (deckExists && deck.colors) {
    maxChars = 16 - 2 * deck.colors.length;
  }

  return (
    <>
      {deckName.length > maxChars ? (
        <abbr title={deckName}>{deckName.slice(0, maxChars)}...</abbr>
      ) : (
        deckName
      )}
      {deckExists ? (
        <>
          {deck.archived && (
            <small>
              <i>(archived)</i>
            </small>
          )}
          <div className={css.flexItem}>
            {deck.colors &&
              deck.colors.map(color => (
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
