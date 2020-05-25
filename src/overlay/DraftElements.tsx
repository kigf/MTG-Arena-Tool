import React, { useCallback } from "react";
import {
  OVERLAY_DRAFT,
  OVERLAY_DRAFT_BREW,
  PACK_SIZES,
} from "../shared/constants";
import Deck from "../shared/deck";
import { DraftData, DraftState } from "../types/draft";
import { OverlaySettingsData } from "../types/settings";
import DeckList from "./DeckList";

import css from "./index.css";
import ManaCost from "../renderer/components/misc/ManaCost";

const packSizeMap: { [key: string]: number } = PACK_SIZES;

export interface DraftElementsProps {
  draft: DraftData;
  draftState: DraftState;
  index: number;
  settings: OverlaySettingsData;
  setDraftStateCallback: (state: DraftState) => void;
}

/**
 * This is a display component that renders most of the contents of an overlay
 * window set in one of the draft-related modes.
 */
export default function DraftElements(props: DraftElementsProps): JSX.Element {
  const { draft, draftState, index, setDraftStateCallback, settings } = props;
  const packSize = packSizeMap[draft.set] || 14;

  const handleDraftPrev = useCallback((): void => {
    let { packN, pickN } = draftState;
    pickN -= 1;
    if (pickN < 0) {
      pickN = packSize;
      packN -= 1;
    }
    if (packN < 0) {
      pickN = draft.pickNumber;
      packN = draft.packNumber;
    }
    setDraftStateCallback({ packN, pickN });
  }, [draftState, draft, packSize, setDraftStateCallback]);

  const handleDraftNext = useCallback((): void => {
    let { packN, pickN } = draftState;
    pickN += 1;
    if (pickN > packSize) {
      pickN = 0;
      packN += 1;
    }
    if (pickN > draft.pickNumber && packN == draft.packNumber) {
      pickN = 0;
      packN = 0;
    }
    if (
      packN > draft.packNumber ||
      (pickN == draft.pickNumber && packN == draft.packNumber)
    ) {
      packN = draft.packNumber;
      pickN = draft.pickNumber;
    }
    setDraftStateCallback({ packN, pickN });
  }, [draftState, draft, packSize, setDraftStateCallback]);

  const { packN, pickN } = draftState;
  const isCurrent = packN === draft.packNumber && pickN === draft.pickNumber;
  let visibleDeck = null;
  let cardsCount = 0;
  let mainTitle = "Overlay " + (index + 1);
  let subTitle = "";
  let pack = [];
  let pick = 0;
  let pickName = "Pack " + (packN + 1) + " - Pick " + (pickN + 1);
  if (isCurrent) {
    pickName += " - Current";
  }
  const key = "pack_" + packN + "pick_" + pickN;
  if (key in draft) {
    pack = draft[key].pack;
    pick = draft[key].pick;
  } else if (isCurrent) {
    pack = draft.currentPack;
    pick = 0;
  }
  if (settings.mode === OVERLAY_DRAFT) {
    visibleDeck = new Deck({ name: pickName }, pack);
    cardsCount = visibleDeck.getMainboard().count();
    mainTitle = visibleDeck.getName();
    subTitle = "Cards Left: " + cardsCount + " cards";
  } else if (settings.mode === OVERLAY_DRAFT_BREW) {
    visibleDeck = new Deck({ name: "All Picks" }, draft.pickedCards);
    cardsCount = visibleDeck.getMainboard().count();
    mainTitle = visibleDeck.getName();
    subTitle = "Total Picks: " + cardsCount + " cards";
  }

  return (
    <div
      className={`${css.outerWrapper} elements_wrapper`}
      style={{ opacity: settings.alpha.toString() }}
    >
      {!!settings.title && (
        <div className={css.overlayDeckname}>
          {mainTitle}
          {settings.mode === OVERLAY_DRAFT && (
            <div
              className={css.overlayDraftContainer}
              style={settings.top ? { top: "32px" } : undefined}
            >
              <div
                className={`${css.draftPrev} ${css.clickOn}`}
                onClick={handleDraftPrev}
              />
              <div className={css.draftTitle} />
              <div
                className={`${css.draftNext} ${css.clickOn}`}
                onClick={handleDraftNext}
              />
            </div>
          )}
        </div>
      )}
      {!!settings.title && !!visibleDeck && (
        <div className={css.overlayDeckcolors}>
          <ManaCost colors={visibleDeck.colors.get()} />
        </div>
      )}
      {!!visibleDeck && (
        <DeckList
          deck={visibleDeck}
          subTitle={subTitle}
          highlightCardId={pick}
          settings={settings}
        />
      )}
    </div>
  );
}
