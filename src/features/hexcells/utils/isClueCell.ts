import { CellType, CellState, ClueCell } from '../types/CellState';

export function isClueCell(cell: CellState | null): cell is ClueCell {
    if (!cell) {
        return false;
    }
    
    return isClueType(cell.type);
}

export function isClueType(cellType: CellType) {
    return cellType === CellType.AdjacentClue
        || cellType === CellType.RowClue
        || cellType === CellType.RadiusClue;
}