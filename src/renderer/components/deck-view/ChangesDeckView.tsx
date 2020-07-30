import React, { useState } from "react";
import CardTile from "../../../shared/CardTile";
import cardTileCss from "../../../shared/CardTile/CardTile.css";
import DeckList from "../misc/DeckList";
import { Deck, DeckChange, CardObject } from "mtgatool-shared";
import Button from "../misc/Button";
import db from "../../../shared/database-wrapper";
import { useSprings, animated } from "react-spring";
import { getDeckChangesList } from "../../../shared/store";

import css from "./ChangesDeckView.css";
import deckViewCss from "./DeckView.css";
import Section from "../misc/Section";

function sortDeckChanges(ad: DeckChange, bd: DeckChange): number {
  const a = ad.date;
  const b = bd.date;
  if (a == b) return 0;
  return a < b ? 1 : -1;
}

interface ChangesDeckViewProps {
  deck: Deck;
  setRegularView: { (): void };
}

export default function ChangesDeckView(
  props: ChangesDeckViewProps
): JSX.Element {
  const { deck, setRegularView } = props;
  const changes = getDeckChangesList(deck.id).sort(sortDeckChanges);
  const [currentDeck, setDeck] = useState<Deck>(deck);
  const numberOfChanges = changes.map(
    (ch) => [...ch.changesMain, ...ch.changesSide].length + 2
  );

  const [expandSprings, expandSet] = useSprings(changes.length, () => ({
    height: 0,
  }));

  const [arrowSprings, arrowSet] = useSprings(changes.length, () => ({
    transform: "rotate(0deg)",
  }));

  const expand = (index: number): void => {
    const newDeck = new Deck(
      {},
      changes[index].previousMain,
      changes[index].previousSide
    );
    setDeck(newDeck);
    // This is fine, not sure why ts goes mad about it
    expandSet((i: number) => {
      if (i == index) return { height: numberOfChanges[index] * 32 + 1 };
      else return { height: 1 };
    });
    arrowSet((i: number) => {
      if (i == index) return { transform: "rotate(90deg)" };
      else return { transform: "rotate(0deg)" };
    });
  };

  return (
    <div className={deckViewCss.regularViewGrid}>
      <Section style={{ padding: "16px", gridArea: "controls" }}>
        <Button
          style={{ margin: "auto" }}
          text="Normal View"
          onClick={setRegularView}
        />
      </Section>
      <Section
        style={{
          paddingBottom: "16px",
          paddingLeft: "24px",
          flexDirection: "column",
          gridArea: "deck",
        }}
      >
        <DeckList deck={currentDeck} showWildcards={true} />
      </Section>
      <Section
        style={{ padding: "16px", flexDirection: "column", gridArea: "types" }}
      >
        {changes.length > 0 ? (
          changes.map((ch, index) => {
            const bothChanges = [...ch.changesMain, ...ch.changesSide];
            const added = bothChanges
              .filter((c) => c.quantity > 0)
              .reduce((ca, cb) => ca + cb.quantity, 0);
            const removed = bothChanges
              .filter((c) => c.quantity < 0)
              .reduce((ca, cb) => ca + Math.abs(cb.quantity), 0);
            return (
              <React.Fragment key={ch.id}>
                <div
                  className={css.deckChange}
                  key={ch.id}
                  onClick={(): void => expand(index)}
                >
                  <animated.div
                    className={css.expandArrow}
                    style={arrowSprings[index]}
                  ></animated.div>
                  <div style={{ marginRight: "auto" }}>
                    <relative-time datetime={ch.date}>{ch.date}</relative-time>
                  </div>
                  <div className={css.changeAdd} />
                  {added}
                  <div className={css.changeRemove} />
                  {removed}
                  <div style={{ marginRight: "8px" }} />
                </div>
                <animated.div
                  style={expandSprings[index]}
                  className={css.deckChangesExpand}
                >
                  <div className={cardTileCss.cardTileSeparator}>Mainboard</div>
                  {ch.changesMain.map((card: CardObject) => {
                    const cardObj = db.card(card.id);
                    if (cardObj)
                      return (
                        <CardTile
                          indent="a"
                          key={"main-" + card.id}
                          card={cardObj}
                          isHighlighted={false}
                          isSideboard={false}
                          showWildcards={false}
                          quantity={
                            card.quantity > 0
                              ? "+" + card.quantity
                              : card.quantity
                          }
                        />
                      );
                  })}
                  <div className={cardTileCss.cardTileSeparator}>Sideboard</div>
                  {ch.changesSide.map((card: CardObject) => {
                    const cardObj = db.card(card.id);
                    if (cardObj)
                      return (
                        <CardTile
                          indent="a"
                          key={"main-" + card.id}
                          card={cardObj}
                          isHighlighted={false}
                          isSideboard={false}
                          showWildcards={false}
                          quantity={
                            card.quantity > 0
                              ? "+" + card.quantity
                              : card.quantity
                          }
                        />
                      );
                  })}
                </animated.div>
              </React.Fragment>
            );
          })
        ) : (
          <div className={css.changeWarning}>No changes recorded.</div>
        )}
      </Section>
    </div>
  );
}
