import { formatNumber } from "../../rendererUtil";
import { vaultPercentFormat } from "./economyUtils";
import EconomyValueRecord from "./EconomyValueRecord";
import React from "react";
import { AppState } from "../../../shared/redux/stores/rendererStore";
import { useSelector } from "react-redux";

import indexCss from "../../index.css";
import css from "./economy.css";
import { formatPercent } from "mtgatool-shared";

export function EconomyHeader(): JSX.Element {
  const playerEconomy = useSelector(
    (state: AppState) => state.playerdata.economy
  );
  const total = playerEconomy.boosters.reduce(
    (accumulator: number, booster: { collationId: number; count: number }) =>
      accumulator + booster.count,
    0
  );
  // TODO: remove this any cast once renderer-util is a typescript file.
  const vaultTotal = formatPercent(
    playerEconomy.vault / 100,
    vaultPercentFormat as any
  );
  const masteryLevel = playerEconomy.currentLevel + 1;

  return (
    <>
      <EconomyValueRecord
        title={"Boosters"}
        iconClassName={`${css.economy_wc_med} ${indexCss.wc_booster} ${css.economyIconMargin}`}
        deltaContent={formatNumber(total)}
      />
      <EconomyValueRecord
        title={"Vault"}
        iconClassName={`${css.economy_vault} ${css.economyIconMargin}`}
        deltaContent={vaultTotal}
      />
      <EconomyValueRecord
        title={"Common Wildcards"}
        iconClassName={`${css.economy_wc_med} ${indexCss.wcCommon}`}
        deltaContent={formatNumber(playerEconomy.wcCommon)}
      />
      <EconomyValueRecord
        title={"Uncommon Wildcards"}
        iconClassName={`${css.economy_wc_med} ${indexCss.wcUncommon}`}
        deltaContent={formatNumber(playerEconomy.wcUncommon)}
      />
      <EconomyValueRecord
        title={"Rare Wildcards"}
        iconClassName={`${css.economy_wc_med} ${indexCss.wcRare}`}
        deltaContent={formatNumber(playerEconomy.wcRare)}
      />
      <EconomyValueRecord
        title={"Mythic Wildcards"}
        iconClassName={`${css.economy_wc_med} ${indexCss.wcMythic}`}
        deltaContent={formatNumber(playerEconomy.wcMythic)}
      />
      <EconomyValueRecord
        title={"Gold"}
        iconClassName={`${css.economy_gold} ${css.marginLeft}`}
        deltaContent={formatNumber(playerEconomy.gold)}
      />
      <EconomyValueRecord
        title={"Gems"}
        iconClassName={`${css.economy_gems} ${css.economyIconMargin}`}
        deltaContent={formatNumber(playerEconomy.gems)}
      />
      <EconomyValueRecord
        title={`Mastery Level (${playerEconomy.trackName})`}
        iconClassName={css.economy_mastery_med}
        deltaContent={formatNumber(masteryLevel)}
      />
      <EconomyValueRecord
        title={"Experience"}
        iconClassName={`${css.economy_exp} ${css.economyIconMargin}`}
        deltaContent={formatNumber(playerEconomy.currentExp || 0)}
      />
    </>
  );
}
