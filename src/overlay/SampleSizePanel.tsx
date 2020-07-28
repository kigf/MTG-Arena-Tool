import React, { useCallback } from "react";
import { constants, Chances } from "mtgatool-shared";

import css from "./index.css";

const { CARD_TYPES } = constants;

interface SampleSizePanelProps {
  cardOdds: Chances;
  cardsLeft: number;
  setOddsCallback: (option: number) => void;
}

export default function SampleSizePanel(
  props: SampleSizePanelProps
): JSX.Element {
  const { cardOdds, cardsLeft, setOddsCallback } = props;
  const sampleSize = cardOdds.sampleSize || 1;

  const handleOddsPrev = useCallback((): void => {
    let newSampleSize = sampleSize - 1;
    if (newSampleSize < 1) {
      newSampleSize = cardsLeft - 1;
    }
    setOddsCallback(newSampleSize);
  }, [sampleSize, cardsLeft, setOddsCallback]);

  const handleOddsNext = useCallback((): void => {
    const cardsLeft = cardOdds.cardsLeft || 60;
    let newSampleSize = sampleSize + 1;
    if (newSampleSize > cardsLeft - 1) {
      newSampleSize = 1;
    }
    setOddsCallback(newSampleSize);
  }, [cardOdds.cardsLeft, sampleSize, setOddsCallback]);

  return (
    <>
      <div className={css.overlaySamplesizeContainer}>
        <div
          className={`${css.oddsPrev} ${css.clickOn}`}
          onClick={handleOddsPrev}
        />
        <div className={css.oddsNumber}>Sample size: {sampleSize}</div>
        <div
          className={`${css.oddsNext} ${css.clickOn}`}
          onClick={handleOddsNext}
        />
      </div>
      <div className={css.chanceTitle} />
      {CARD_TYPES.map((type) => {
        let value = 0;
        let field = "";
        switch (type) {
          case "Creatures":
            value = cardOdds["chanceCre"] / 100;
            field = "chanceCre";
            break;
          case "Lands":
            value = cardOdds["chanceLan"] / 100;
            field = "chanceLan";
            break;
          case "Instants":
            value = cardOdds["chanceIns"] / 100;
            field = "chanceIns";
            break;
          case "Sorceries":
            value = cardOdds["chanceSor"] / 100;
            field = "chanceSor";
            break;
          case "Enchantments":
            value = cardOdds["chanceEnc"] / 100;
            field = "chanceEnc";
            break;
          case "Artifacts":
            value = cardOdds["chanceArt"] / 100;
            field = "chanceArt";
            break;
          case "Planeswalkers":
            value = cardOdds["chancePla"] / 100;
            field = "chancePla";
            break;
        }
        const display = value.toLocaleString([], {
          style: "percent",
          maximumSignificantDigits: 2,
        });
        return (
          <div className={css.chanceTitle} key={"chance_title_" + field}>
            {type}: {display}
          </div>
        );
      })}
    </>
  );
}
