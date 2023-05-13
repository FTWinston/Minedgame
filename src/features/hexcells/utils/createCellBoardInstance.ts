import { CellBoard, CellBoardDefinition } from "../types/CellBoard";
import { CellType, DisplayCellState } from '../types/CellState';
import { GenerationConfig, generateBoard } from './generateBoard';
import { isClueResolved } from './resolved';

export function createCellBoardInstance(definition: CellBoardDefinition): CellBoard {
    const board: CellBoard = {
        columns: definition.columns,
        underlying: definition.underlying,
        cells: definition.cells.map((cell, index) => {
            if (cell === null) {
                return null;
            }
            
            // Intentionally skip resolved property now, will handle in subsequent loop.
            return { ...cell } as DisplayCellState;
        }),
        hints: definition.hints,
        numErrors: 0,
        numBombs: definition.underlying
            .filter(cell => cell?.type === CellType.Bomb)
            .length
    };

    for (let index = 0; index < board.cells.length; index++) {
        const cell = board.cells[index];
        
        if (cell && (cell.type === CellType.Empty || cell.type === CellType.RowClue || cell.type === CellType.RadiusClue)) {
            const underlying = board.underlying[index];

            if (underlying && (underlying.type === CellType.Empty || underlying.type === CellType.RowClue || underlying.type === CellType.RadiusClue)) {
                cell.resolved = isClueResolved(board, underlying.targetIndexes);
            }
        }
    }

    return board;
}

export function generateInstance(config: GenerationConfig) {
    return createCellBoardInstance(generateBoard(config));
}
