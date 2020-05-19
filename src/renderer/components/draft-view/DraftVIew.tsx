import React, { useCallback } from "react";
import Slider, { SliderPosition } from "../misc/Slider";
import DeckList from "../misc/DeckList";
import Deck from "../../../shared/deck";
import {
  PACK_SIZES,
  DRAFT_RANKS,
  DRAFT_RANKS_LOLA,
  IPC_NONE,
} from "../../../shared/constants";
import useHoverCard from "../../hooks/useHoverCard";
import { DraftData } from "../../../types/draft";
import db from "../../../shared/database";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../../shared/redux/stores/rendererStore";
import { getDraft } from "../../../shared/store";
import { reduxAction } from "../../../shared/redux/sharedRedux";

import indexCss from "../../index.css";
import sharedCss from "../../../shared/shared.css";
import css from "./DraftView.css";
import { getCardImage } from "../../../shared/utils/getCardArtCrop";
import { getRankColorClass } from "../../../shared/utils/getRankColorClass";

interface PickPack {
  pack: number;
  pick: number;
}

const DEFAULT_PACK_SIZE = 14;

function positionFromPickPack(pp: PickPack, set: string): number {
  const packSize = PACK_SIZES[set] ?? DEFAULT_PACK_SIZE;
  return pp.pick + pp.pack * packSize;
}

function pickPackFromPosition(position: number, set: string): PickPack {
  const packSize = PACK_SIZES[set] ?? DEFAULT_PACK_SIZE;
  //const maxValue = packSize * 3;
  const pack = Math.floor(position / packSize);
  const pick = position % packSize;

  return { pack: pack, pick: pick };
}

interface DraftCardProps {
  grpId: number;
  pick: boolean;
  size: number;
}

function DraftCard(props: DraftCardProps): JSX.Element {
  const { grpId, pick, size } = props;
  const cardQuality = useSelector(
    (state: AppState) => state.settings.cards_quality
  );
  const [hoverIn, hoverOut] = useHoverCard(grpId);

  const card = db.card(grpId);

  const makeStyle = useCallback(() => {
    return {
      width: size + "px",
      height: size / 0.71808510638 + "px",
      backgroundImage: `url(${getCardImage(grpId, cardQuality)})`,
    };
  }, [grpId, cardQuality, size]);

  const RANK_SOURCE = card?.source == 0 ? DRAFT_RANKS : DRAFT_RANKS_LOLA;
  return (
    <div className={css.draftCardCont}>
      <div
        style={makeStyle()}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
        className={`${css.draftCard} + ${pick ? css.draftCardPicked : ""}`}
      />
      <div
        className={`${css.draftCardRank} ${getRankColorClass(
          RANK_SOURCE[card ? card.rank : 0]
        )}`}
      >
        {card ? RANK_SOURCE[card.rank] : "-"}
      </div>
    </div>
  );
}

interface DraftViewProps {
  draft: DraftData;
}

export function DraftView(props: DraftViewProps): JSX.Element {
  const dispatcher = useDispatch();
  const { draft } = props;
  const [pickpack, setPickPack] = React.useState({ pick: 0, pack: 0 });
  const cardSize =
    100 + useSelector((state: AppState) => state.settings.cards_size) * 15;
  const maxPosition = (PACK_SIZES[draft.set] ?? DEFAULT_PACK_SIZE) * 3 - 1;

  const downHandler = React.useCallback(
    (event: KeyboardEvent): void => {
      const key = event.key;
      let position = positionFromPickPack(pickpack, draft.set);
      if (key === "ArrowLeft") {
        position -= 1;
      } else if (key === "ArrowRight") {
        position += 1;
      }
      if (position < 0) {
        position = maxPosition;
      } else if (position > maxPosition) {
        position = 0;
      }
      setPickPack(pickPackFromPosition(position, draft.set));
    },
    [maxPosition, pickpack, draft.set]
  );

  React.useEffect(() => {
    window.addEventListener("keydown", downHandler);
    return (): void => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [downHandler]);

  const goBack = (): void => {
    reduxAction(dispatcher, "SET_NAV_INDEX", 0, IPC_NONE);
    reduxAction(dispatcher, "SET_BACK_GRPID", 0, IPC_NONE);
  };

  const onSliderChange = useCallback(
    (value: number) => {
      setPickPack(pickPackFromPosition(value, draft.set));
    },
    [draft.set]
  );

  const getCurrentPick = useCallback(() => {
    const key = `pack_${pickpack.pack}pick_${pickpack.pick}`;
    return draft[key] ? draft[key] : { pick: 0, pack: [] };
  }, [draft, pickpack.pack, pickpack.pick]);

  const getCurrentDeck = useCallback((): Deck => {
    const pos = positionFromPickPack(pickpack, draft.set);
    const decklist = new Deck();

    for (let i = 0; i < pos; i++) {
      const pp = pickPackFromPosition(i, draft.set);
      const key = `pack_${pp.pack}pick_${pp.pick}`;
      decklist.getMainboard().add(draft[key].pick);
    }
    decklist.getMainboard().removeDuplicates();
    return decklist;
  }, [draft, pickpack]);

  const sliderPositions = Array(maxPosition + 1).fill(new SliderPosition());
  sliderPositions[
    positionFromPickPack({ pick: 0, pack: 0 }, draft.set)
  ] = new SliderPosition("Pack 1");
  sliderPositions[
    positionFromPickPack({ pick: 0, pack: 1 }, draft.set)
  ] = new SliderPosition("Pack 2");
  sliderPositions[
    positionFromPickPack({ pick: 0, pack: 2 }, draft.set)
  ] = new SliderPosition("Pack 3");

  return (
    <div className={indexCss.centeredUx}>
      <div className={indexCss.decklist_top}>
        <div
          className={`${sharedCss.button} ${sharedCss.back}`}
          onClick={goBack}
        ></div>
        <div className={indexCss.deckName}>{draft.set + " Draft"}</div>
      </div>
      <div
        className={indexCss.flexItem}
        style={{ flexDirection: "column", margin: "0 32px" }}
      >
        <div className={css.draftTitle}>
          {`Pack ${pickpack.pack + 1}, Pick ${pickpack.pick + 1}`}
        </div>
        <Slider
          containerStyle={{ margin: "8px 0 30px 0" }}
          value={positionFromPickPack(pickpack, draft.set)}
          onChange={onSliderChange}
          max={maxPosition}
          positions={sliderPositions}
        />
        <div className={css.draftContainer}>
          <div
            className={css.draftView}
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(${
                cardSize + 12
              }px, 1fr))`,
            }}
          >
            {getCurrentPick().pack.map((grpId: number, index: number) => {
              return (
                <DraftCard
                  pick={getCurrentPick().pick == grpId}
                  key={pickpack.pack + "-" + pickpack.pick + "-" + index}
                  size={cardSize}
                  grpId={grpId}
                />
              );
            })}
          </div>
          <div className={css.draftDeckView}>
            <DeckList deck={getCurrentDeck()} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function openDraftSub(draftId: string): JSX.Element {
  const draft = getDraft(draftId);
  if (!draft) return <div>{draftId}</div>;
  return <DraftView draft={draft} />;
}
