import React from "react";
import cardTileCss from "../../../shared/CardTile/CardTile.css";

interface SeparatorProps {
  children: React.ReactNode;
}

export default function Separator(props: SeparatorProps): JSX.Element {
  const { children } = props;
  return <div className={cardTileCss.cardTileSeparator}>{children}</div>;
}