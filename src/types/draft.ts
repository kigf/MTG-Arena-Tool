import { ModuleInstanceData } from "./event";
import { InternalDeck } from "./Deck";

export interface DraftStatus {
  DraftId: string;
  DraftStatus: string;
  PackNumber: number;
  PickNumber: number;
  PickedCards: string[];
  DraftPack: string[];
}

export interface DraftMakePick {
  jsonrpc: string;
  method: string;
  params: {
    draftId: string;
    cardId: string;
    packNumber: string;
    pickNumber: string;
  };
}

export interface DraftData {
  id: string;
  pickNumber: number;
  packNumber: number;
  set: string;
  pickedCards: any;
  currentPack?: any;
  [key: string]: any;
}

export interface DraftState {
  packN: number;
  pickN: number;
}

export interface PickPack {
  pick: string;
  pack: string;
}

export interface InternalDraft {
  eventId: string;
  draftId: string;
  arenaId: string;
  id: string;
  owner: string;
  player: string;
  PlayerId: null | string;
  set: string;
  InternalEventName: string;
  date: string;
  type: string;
  CardPool: null | string[] | number[];
  CourseDeck: null | InternalDeck;
  pickedCards: string[];
  currentPack: string[];
  packNumber: number;
  pickNumber: number;
  [key: string]: any;
  DraftStatus?: string;
  DraftPack?: string[];
  PickedCards?: string[];
  ModuleInstanceData?: ModuleInstanceData;
  CurrentEventState?: string;
  CurrentModule?: string;
  PreviousOpponents?: string[];
}

export interface DraftNotify {
  draftId: string;
  SelfPick: number;
  SelfPack: number;
  PackCards: string;
}

export interface OutMakeHumanDraftPick {
  jsonrpc: string;
  method: string;
  params: {
    draftId: string;
    cardId: string;
    packNumber: string;
    pickNumber: string;
  };
  id: string;
}

export interface EventJoinPodmaking {
  jsonrpc: string;
  method: string;
  params: {
    queueId: string;
  };
  id: string;
}

export interface InMakeHumanDraftPick {
  IsPickingCompleted: boolean;
  IsPickSuccessful: boolean;
  TableInfo: null | unknown;
  PickInfo: null | unknown;
  PackInfo: null | unknown;
}
