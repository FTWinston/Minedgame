import { CountType } from './CellState';

export interface Clue {
    clueIndex: number;
    associatedIndexes: Array<number | null>;
    loop: boolean;
    countType: CountType;
    numObscuredBombs: number;
    associatedObscuredIndexes: number[];
}

export type ClueMap = Map<number, Clue>;
