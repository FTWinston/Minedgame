import { CellBoard } from '../types/CellBoard';
import { CellType, DisplayCellState } from '../types/CellState';

export function isObscured(cell: DisplayCellState | null) {
    if (cell === null) {
        return false;
    }
    
    return cell.type === CellType.Obscured || cell.type === CellType.Hint;
}

export function isClueResolved(state: CellBoard, targetIndexes: number[]): boolean {
    return targetIndexes.every(index => {
        const cell = state.cells[index];
        return !isObscured(cell);
    });
}

export function markCluesAsResolved(state: CellBoard, clueIndexes: number[]) {
    for (const clueIndex of clueIndexes) {
        const clueCell = state.underlying[clueIndex];

        if (!clueCell) {
            continue;
        }

        if (clueCell.type === CellType.Empty || clueCell.type === CellType.RowClue || clueCell.type === CellType.RadiusClue) {
            if (isClueResolved(state, clueCell.targetIndexes)) {
                const display = state.cells[clueIndex];
                if (!display) {
                    continue;
                }
                if (display.type === CellType.Empty || display.type === CellType.RowClue || display.type === CellType.RadiusClue) {
                    display.resolved = true;
                }
            }
        }
    }
}
