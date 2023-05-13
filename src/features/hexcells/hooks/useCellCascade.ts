import { useEffect, useState } from 'react';
import { getAdjacentIndexes } from '../utils/indexes';

/** Return a set of cell indexes that, once cascading is true, expands at a regular interval, adding all adjacent cells each time. */
export function useCellCascade(
    bombIndex: number,
    columns: number,
    rows: number
): Set<number> {
    const [cascadeCells, setCascadeCells] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (bombIndex < 0) {
            setCascadeCells(new Set());
            return;
        }
        
        setCascadeCells(cells => new Set([...cells, bombIndex]));

        const interval = setInterval(() => {            
            setCascadeCells(cells => {
                // Add any cells that were expanded into to the list of bombed cells.
                const expandedCells = new Set<number>([
                    ...[...cells]
                        .flatMap(cellIndex => getAdjacentIndexes(cellIndex, columns, rows).filter(cell => cell !== null) as number[]),
                    ...cells
                ]);

                if (cells.size === expandedCells.size) {
                    // Didn't expand to any new cells, so end the cascade.
                    clearInterval(interval);
                    return cells;
                }
                else {
                    return expandedCells;
                }
            });
        }, 333);
        return () => clearInterval(interval);
    }, [bombIndex]);

    return cascadeCells;
}
