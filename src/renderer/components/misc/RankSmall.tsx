import React from "react";
import indexCss from "../../index.css";
import { getRankIndex16 } from "../../../shared/utils/getRankIndex";
import formatRank from "../../../shared/utils/formatRank";

interface RankSmallProps {
  rank?: any | string;
  rankTier?: string;
  style?: React.CSSProperties;
}

export default function RankSmall(props: RankSmallProps): JSX.Element {
  const { rank, rankTier, style } = props;

  const getRankStyle = (): React.CSSProperties => {
    return {
      ...(style ? style : {}),
      marginRight: "0px",
      backgroundPosition:
        getRankIndex16(rankTier ? rankTier : rank.rank) * -16 + "px 0px",
    };
  };

  return (
    <div
      style={getRankStyle()}
      title={rankTier ? rankTier : formatRank(rank)}
      className={indexCss.ranks16}
    ></div>
  );
}
