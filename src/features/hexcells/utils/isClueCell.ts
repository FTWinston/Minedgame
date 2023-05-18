import { CellType, CellState, ClueCell } from '../types/CellState';

export function isClueCell(cell: CellState | null): cell is ClueCell {
    if (!cell) {
        return false;
    }
    
    return cell.type === CellType.Empty
        || cell.type === CellType.RowClue
        || cell.type === CellType.RadiusClue;
}