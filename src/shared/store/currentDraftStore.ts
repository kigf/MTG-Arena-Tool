import globalStore from ".";

export const draftStateObject = {
  owner: "",
  arenaId: "",
  date: "",
  eventId: "",
  id: "",
  draftSet: "",
  currentPack: 1,
  currentPick: 1,
  pickedCards: [] as number[],
  packs: [
    Array(16).fill([]) as number[][],
    Array(16).fill([]) as number[][],
    Array(16).fill([]) as number[][],
  ],
  picks: [
    Array(16).fill(0) as number[],
    Array(16).fill(0) as number[],
    Array(16).fill(0) as number[],
  ],
};

export type DraftState = typeof draftStateObject;

export function setDraftId(arg: string): void {
  globalStore.currentDraft.id = arg;
}

export function setDraftData(arg: Partial<DraftState>): void {
  globalStore.currentDraft = { ...globalStore.currentDraft, ...arg };
}

export function setDraftSet(arg: string): void {
  globalStore.currentDraft.draftSet = arg;
}

export function resetCurrentDraft(): void {
  globalStore.currentDraft = Object.assign({}, draftStateObject);
  globalStore.currentDraft.pickedCards = [];
  globalStore.currentDraft.packs = [
    Array(16).fill([]) as number[][],
    Array(16).fill([]) as number[][],
    Array(16).fill([]) as number[][],
  ];
  globalStore.currentDraft.picks = [
    Array(16).fill([]) as number[],
    Array(16).fill([]) as number[],
    Array(16).fill([]) as number[],
  ];
}

export function setDraftPack(
  cards: number[],
  argPack: number | undefined,
  argPick: number | undefined
): void {
  const pack =
    argPack == undefined ? globalStore.currentDraft.currentPack : argPack;
  const pick =
    argPick == undefined ? globalStore.currentDraft.currentPick : argPick;
  globalStore.currentDraft.currentPack = pack;
  globalStore.currentDraft.currentPick = pick;
  globalStore.currentDraft.packs[pack][pick] = cards;
}

export function addDraftPick(
  grpId: number,
  argPack: number | undefined,
  argPick: number | undefined
): void {
  const pack =
    argPack == undefined ? globalStore.currentDraft.currentPack : argPack;
  const pick =
    argPick == undefined ? globalStore.currentDraft.currentPick : argPick;
  globalStore.currentDraft.currentPack = pack;
  globalStore.currentDraft.currentPick = pick;
  globalStore.currentDraft.pickedCards.push(grpId);
  globalStore.currentDraft.picks[pack][pick] = grpId;
}
