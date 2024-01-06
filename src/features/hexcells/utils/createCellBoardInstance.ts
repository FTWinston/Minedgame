import { CellBoard, CellBoardDefinition } from '../types/CellBoard';
import { CellType, DisplayCellState } from '../types/CellState';
import { GenerationConfig, generateBoard } from './generateBoard';
import { isClueCell } from './isClueCell';
import { isClueResolved } from './resolved';

export function createCellBoardInstance(definition: CellBoardDefinition): CellBoard {
    const board: CellBoard = {
        columns: definition.columns,
        underlying: definition.underlying,
        cells: definition.cells.map((cell) => {
            if (cell === null) {
                return null;
            }
            
            // Intentionally skip targetIndexes and resolved properties now, will handle in subsequent loop.
            return { ...cell } as DisplayCellState;
        }),
        hints: definition.hints,
        hintsUsed: 0,
        numErrors: 0,
        numBombs: definition.underlying
            .filter(cell => cell?.type === CellType.Bomb)
            .length
    };

    for (let index = 0; index < board.cells.length; index++) {
        const cell = board.cells[index];
        
        if (isClueCell(cell)) {
            const underlying = board.underlying[index];

            if (isClueCell(underlying)) {
                cell.targetIndexes = underlying.targetIndexes;
                cell.resolved = isClueResolved(board, underlying.targetIndexes);
            }
        }
    }

    return board;
}

export function generateInstance(config: GenerationConfig) {
    return createCellBoardInstance(generateBoard(config));
}
