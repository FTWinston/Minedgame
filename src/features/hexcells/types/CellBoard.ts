import { CellState, DisplayCellState, UnderlyingCellState } from './CellState';

export interface CellBoardDefinition {
    columns: number;
    cells: Array<CellState | null>;
    underlying: Array<UnderlyingCellState | null>;
    hints: number[];
}

interface InstanceInfo {
    cells: Array<DisplayCellState | null>;
    numBombs: number;
    numErrors: number;
    result?: 'success' | 'failure';
    errorIndex?: number;
}

export interface MinimumResolvableBoardInfo {
    columns: number;
    cells: Array<CellState | null>;
    numBombs?: number;
}

export type CellBoard = Omit<CellBoardDefinition, 'cells'> & InstanceInfo;

export type CellBoardInfo = Omit<CellBoardDefinition, 'cells' | 'underlying' | 'hints'> & InstanceInfo;

export type CellBoardAction = {
    type: 'reveal';
    index: number;
} | {
    type: 'flag';
    index: number;
} | {
    type: 'hint';
} | {
    type: 'new';
    board: CellBoard;
}