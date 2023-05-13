import { MinimumResolvableBoardInfo } from '../types/CellBoard';
import { CellType, ClueCell } from '../types/CellState';
import { Clue, ClueMap } from '../types/Clue';
import { getAdjacentIndexes, getIndexesInRadius, getIndexesInRow } from './indexes';

/** Get a map of all clues currently on the board. */
export function getClues(board: MinimumResolvableBoardInfo): ClueMap {
    const info = new Map();
    
    addAvailableClues(board, info);

    return info;
}

/** Get the number of indexes provided that represent obscured cells. */
function updateClue(clue: Clue, board: MinimumResolvableBoardInfo) {
    let obscuredIndexes: number[] = [];
    let numBombsRevealed = 0;

    for (const index of clue.associatedIndexes) {
        if (index === null) {
            continue;
        }

        const cell = board.cells[index];
        
        if (cell?.type === CellType.Obscured) {
            obscuredIndexes.push(index);
        }
        else if (cell?.type === CellType.Bomb) {
            numBombsRevealed ++;
        }
    }

    const cell = board.cells[clue.clueIndex] as ClueCell;

    clue.associatedObscuredIndexes = obscuredIndexes;
    clue.numObscuredBombs = cell.number - numBombsRevealed;
}

export function addClue(
    board: MinimumResolvableBoardInfo,
    clues: ClueMap,
    index: number,
    cell: ClueCell,
    associatedIndexes: Array<number | null>
) {
    const loop = cell.type === CellType.Empty;
    
    const clue: Clue = {
        clueIndex: index,
        associatedIndexes,
        countType: cell.countType,
        loop,
        associatedObscuredIndexes: [],
        numObscuredBombs: 0,
    };

    updateClue(clue, board);

    clues.set(index, clue);

    return clue;
}

/** Any empty, row or radius clue cell without an associated clue should have one added. */
function addAvailableClues(board: MinimumResolvableBoardInfo, clues: ClueMap) {
    const rows = Math.ceil(board.cells.length / board.columns);

    for (let index = 0; index < board.cells.length; index++) {
        if (clues.has(index)) {
            continue;
        }

        const cell = board.cells[index];
        if (!cell) {
            continue;
        }

        let associatedIndexes: Array<number | null>;

        if (cell.type === CellType.Empty) {
            associatedIndexes = getAdjacentIndexes(index, board.columns, rows);
        }
        else if (cell.type === CellType.RowClue) {
            associatedIndexes = getIndexesInRow(index, cell.direction, board.columns, rows)
        }
        else if (cell.type === CellType.RadiusClue) {
            associatedIndexes = getIndexesInRadius(index, board.columns, rows);
        }
        else {
            continue;
        }

        addClue(board, clues, index, cell, associatedIndexes);
    }
}

/** Update numUnresolved on existing clues, and add any new clues. */
export function updateClues(board: MinimumResolvableBoardInfo, clues: ClueMap) {
    for (const clue of clues.values()) {
        if (clue.associatedObscuredIndexes.length !== 0) { // If a clue previously resolved all of its associated cells, don't bother updating it further.
            updateClue(clue, board);
        }
    }

}
