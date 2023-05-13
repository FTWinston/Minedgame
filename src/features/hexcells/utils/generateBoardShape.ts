import { getRandomFloat, getRandomInt } from 'src/utils/random';
import { indexFromCoordinate } from './indexes';

export interface ShapeConfig {
    orientation?: 'portrait' | 'landscape';

    /** Number of cells in the grid. */
    numCells: number;

    /** Fraction of the grid that contains spaces instead of cells. Lower values are easier. */
    gapFraction: number;
}

/** Decide bounds based on number of cells. */
function determineSize(landscapeOrientation: boolean, numCells: number, numGaps: number) {
    const totalCells = numCells + numGaps;
    
    let rows = Math.sqrt(totalCells);
    rows *= getRandomFloat() * 0.3 + 0.85;
    rows = Math.ceil(rows) + 2;

    let columns = Math.floor(totalCells / rows) + 2;

    if (landscapeOrientation) {
        const tmp = rows;
        rows = columns;
        columns = tmp;
    }

    return {
        rows,
        columns,
        numIndexesExcludingBorder: (rows - 2) * (columns - 2),
    };
}

/** Replace random cells with null, but do so symmetrically, either rotationally or mirrored. */
function placeNulls<TCellState>(board: Array<TCellState | null>, rows: number, columns: number, numToAssign: number) {
    let primaryIndexes: number[] = [];
    let mirroredIndexes: number[] = [];

    if (columns % 2 === 0) {
        // Rotational mirror
        const middleIndex = Math.ceil(board.length / 2);
        primaryIndexes = Array(middleIndex + 1).fill(0).map((_, i) => i);
        mirroredIndexes = Array(middleIndex + 1).fill(0).map((_, i) => board.length - i - 1);
    }
    else {
        // Horizontal reflection mirror
        const middlestColumn = Math.ceil(columns / 2);
        const getIndex = (row: number, col: number) => row * columns + col;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col <= middlestColumn; col++) {
                primaryIndexes.push(getIndex(row, col));
                mirroredIndexes.push(getIndex(row, columns - col - 1));
            }
        }
    }
    
    for (numToAssign; numToAssign > 0; numToAssign--) {
        let boardIndex: number;
        let indexIndex: number;

        do {
            indexIndex = getRandomInt(primaryIndexes.length);
            boardIndex = primaryIndexes[indexIndex];
        } while (board[boardIndex] === null);

        board[boardIndex] = null;

        let mirroredBoardIndex = mirroredIndexes[indexIndex];
        if (board[mirroredBoardIndex] !== null && numToAssign > 0) {
            board[mirroredBoardIndex] = null;
            numToAssign--;
        }
    }
}

export function generateBoardShape<TCellState>(config: ShapeConfig, cell: TCellState) {
    const numGaps = Math.round(config.gapFraction * config.numCells);

    const {
        rows,
        columns,
        numIndexesExcludingBorder 
    } = determineSize(config.orientation === 'landscape', config.numCells, numGaps);

    const cells: Array<TCellState | null> = new Array(rows * columns)
        .fill(cell);
    
    // Fill in nulls around the outer edge.
    for (let col = 0; col < columns; col++) {
        cells[indexFromCoordinate({ col, row: 0 }, columns)] = null;
        cells[indexFromCoordinate({ col, row: rows - 1 }, columns)] = null;
    }
    for (let row = 1; row < rows - 1; row++) {
        cells[indexFromCoordinate({ col: 0, row }, columns)] = null;
        cells[indexFromCoordinate({ col: columns - 1, row }, columns)] = null;
    }

    const numToRemove = Math.round(config.gapFraction * numIndexesExcludingBorder);
    if (numToRemove > 0) {
        placeNulls(cells, rows, columns, numToRemove);
    }

    return { rows, columns, cells };
}