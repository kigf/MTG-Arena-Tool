import _ from "lodash";
import React from "react";
import { ArchiveButton, ListItem } from "./ListItem";
import indexCss from "../../index.css";
import { TransactionData } from "../economy/types";
import Flex from "../misc/Flex";
import { toggleArchived } from "../../rendererUtil";
import {
  FlexTop,
  FlexBottom,
  FlexRight,
  getThingsToCheck,
} from "../economy/EconomyRow";

interface ListItemEconomyProps {
  change: TransactionData;
}

export function ListItemEconomy(props: ListItemEconomyProps): JSX.Element {
  const { change } = props;
  const economyId = change.id;
  const fullContext = change.fullContext;
  const thingsToCheck = getThingsToCheck(fullContext, change);

  const flexTopProps = {
    fullContext,
    change,
  };

  const flexBottomProps = {
    ...flexTopProps,
    thingsToCheck,
  };

  const flexRightProps = {
    ...flexBottomProps,
    economyId,
  };

  return (
    <ListItem click={(): void => {}}>
      <Flex className={indexCss.flexLeft} style={{ marginLeft: "8px" }}>
        <FlexTop {...flexTopProps} />
        <FlexBottom {...flexBottomProps} />
      </Flex>
      <FlexRight {...flexRightProps} />
      <ArchiveButton
        archiveCallback={toggleArchived}
        dataId={economyId}
        isArchived={change.archived ?? false}
      />
    </ListItem>
  );
}
