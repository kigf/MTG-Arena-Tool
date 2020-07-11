import React from "react";
import { CardObject } from "../../../types/Deck";
import { IPC_NONE } from "../../../shared/constants";
import DeckTypesStats from "../../../shared/TypesStats";
import Deck from "../../../shared/deck";
import Button from "../misc/Button";
import { useDispatch, useSelector } from "react-redux";
import db from "../../../shared/database";
import { getCardImage } from "../../../shared/utils/getCardArtCrop";
import { reduxAction } from "../../../shared/redux/sharedRedux";
import { AppState } from "../../../shared/redux/stores/rendererStore";

import css from "./VisualDeckView.css";
import Section from "../misc/Section";

interface VisualDeckViewProps {
  deck: Deck;
  setRegularView: { (): void };
}

type SplitIds = [number, number, number, number];

function cmcSort(a: CardObject, b: CardObject): number {
  const ca = db.card(a.id);
  const cb = db.card(b.id);

  if (ca && cb) {
    return cb.cmc - ca.cmc;
  } else {
    return 0;
  }
}

export default function VisualDeckView(
  props: VisualDeckViewProps
): JSX.Element {
  const { deck, setRegularView } = props;
  const sz =
    100 + useSelector((state: AppState) => state.settings.cards_size) * 15;
  const cardQuality = useSelector(
    (state: AppState) => state.settings.cards_quality
  );
  const dispatcher = useDispatch();

  const hoverCard = (id: number, hover: boolean): void => {
    reduxAction(
      dispatcher,
      { type: hover ? "SET_HOVER_IN" : "SET_HOVER_OUT", arg: { grpId: id } },
      IPC_NONE
    );
  };

  // attempt at sorting visually..
  const newMainDeck: number[] = [];
  deck
    .getMainboard()
    .get()
    .sort(cmcSort)
    .map((c: CardObject) => {
      for (let i = 0; i < c.quantity; i++) {
        newMainDeck.push(c.id);
      }
    });

  const splitDeck: SplitIds[] = [];
  for (let i = 0; i < newMainDeck.length; i += 4) {
    splitDeck.push([
      newMainDeck[i] || 0,
      newMainDeck[i + 1] || 0,
      newMainDeck[i + 2] || 0,
      newMainDeck[i + 3] || 0,
    ]);
  }

  const newSideboard: number[] = [];
  deck
    .getSideboard()
    .get()
    .map((c: CardObject) => {
      for (let i = 0; i < c.quantity; i++) {
        newSideboard.push(c.id);
      }
    });

  return (
    <div className={css.visualViewGrid}>
      <Section style={{ padding: "16px", gridArea: "controls" }}>
        <Button
          style={{ margin: "auto" }}
          text="Normal View"
          onClick={setRegularView}
        />
      </Section>
      <Section style={{ gridArea: "types" }}>
        <DeckTypesStats deck={deck} />
      </Section>
      <Section style={{ padding: "16px", gridArea: "main" }}>
        <div className={css.visualMainboard}>
          {splitDeck.map((idsList: SplitIds, index: number) => {
            const cards = idsList.map((grpId: number, cindex: number) => {
              const cardObj = db.card(grpId);
              if (cardObj) {
                return (
                  <div
                    style={{ width: sz + "px", height: sz * 0.166 + "px" }}
                    key={"visual-main-" + cindex}
                    className={css.deckVisualCard}
                  >
                    <img
                      onMouseEnter={(): void => {
                        hoverCard(grpId, true);
                      }}
                      onMouseLeave={(): void => {
                        hoverCard(grpId, false);
                      }}
                      style={{ width: sz + "px" }}
                      src={getCardImage(cardObj, cardQuality)}
                      className={css.deckVisualCardImg}
                    ></img>
                  </div>
                );
              }
            });
            return (
              <div
                key={"visual-" + index}
                style={{ marginBottom: sz * 0.5 + "px" }}
                className={css.deckVisualTile}
              >
                {cards}
              </div>
            );
          })}
        </div>
      </Section>
      <Section style={{ padding: "16px", gridArea: "side" }}>
        <div className={css.deckVisualTileSide}>
          {newSideboard.map((grpId: number, _n: number) => {
            const cardObj = db.card(grpId);
            if (cardObj) {
              return (
                <div
                  key={"visual-side-" + _n}
                  style={{
                    width: sz + "px",
                    height: sz * 0.166 + "px",
                    marginLeft: _n % 2 == 0 ? "60px" : "",
                  }}
                  className={css.deckVisualCardSide}
                >
                  <img
                    onMouseEnter={(): void => {
                      hoverCard(grpId, true);
                    }}
                    onMouseLeave={(): void => {
                      hoverCard(grpId, false);
                    }}
                    style={{ width: sz + "px" }}
                    src={getCardImage(cardObj, cardQuality)}
                    className={css.deckVisualCardImg}
                  ></img>
                </div>
              );
            }
          })}
        </div>
      </Section>
    </div>
  );
}
