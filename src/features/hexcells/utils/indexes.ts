import { RowDirection } from '../types/CellState';

export interface Coordinate {
    row: number;
    col: number;
}

export function coordinateFromIndex(index: number, columns: number): Coordinate {
    const col = index % columns;
    const row = Math.floor(index / columns);

    return { row, col };
}

export function indexFromCoordinate(coordinate: Coordinate, columns: number): number {
    return coordinate.row * columns + coordinate.col;
}

function getAdjacentCoordinates(col: number, row: number, columns: number, rows: number): Array<Coordinate | null> {
    return col % 2 === 0
        ? [ // Even columns are shifted down.
            (row > 0 ? { row: row - 1, col } : null),
            (col < columns - 1 ? { row, col: col + 1 } : null),
            (row < rows - 1 && col < columns - 1 ? { row: row + 1, col: col + 1 } : null),
            (row < rows - 1 ? { row: row + 1, col } : null),
            (row < rows - 1 && col > 0 ? { row: row + 1, col: col - 1 } : null),
            (col > 0 ? { row, col: col - 1 } : null),
        ]
        : [ // Odd columns are shifted up.
            (row > 0 ? { row: row - 1, col } : null),
            (row > 0 && col < columns - 1 ? { row: row - 1, col: col + 1 } : null),
            (col < columns - 1 ? { row, col: col + 1 } : null),
            (row < rows - 1 ? { row: row + 1, col } : null),
            (col > 0 ? { row, col: col - 1 } : null),
            (row > 0 && col > 0 ? { row: row - 1, col: col - 1 } : null),
        ];
}

export function getAdjacentIndexes(index: number, columns: number, rows: number): Array<number | null> {
    const { row, col } = coordinateFromIndex(index, columns);

    return getAdjacentCoordinates(col, row, columns, rows)
        .map(coord => coord === null ? null : indexFromCoordinate(coord, columns));
}

export function getIndexesInRadius(index: number, columns: number, rows: number): number[] {
    const { row, col } = coordinateFromIndex(index, columns);

    const coordsInRadius = getAdjacentCoordinates(col, row, columns, rows)
        .filter(coord => coord !== null) as Coordinate[];

    if (row > 1) {
        coordsInRadius.push({ row: row - 2, col });
    }
    if (row < rows - 2) {
        coordsInRadius.push({ row: row + 2, col });
    }

    if (col % 2 === 0) {
        // Even columns are shifted down.
        if (col > 0) {
            if (row > 1) {
                coordsInRadius.push({ row: row - 1, col: col - 1 });
            }
            if (row < rows - 1) {
                coordsInRadius.push({ row: row + 2, col: col - 1 });
            }
        }
        if (col < columns - 1) {
            if (row > 1) {
                coordsInRadius.push({ row: row - 1, col: col + 1 });
            }
            if (row < rows - 1) {
                coordsInRadius.push({ row: row + 2, col: col + 1 });
            }
        }
    }
    else {
        // Odd columns are shifted up.
        if (col > 0) {
            if (row > 1) {
                coordsInRadius.push({ row: row - 2, col: col - 1 });
            }
            if (row < rows - 1) {
                coordsInRadius.push({ row: row + 1, col: col - 1 });
            }
        }
        if (col < columns - 1) {
            if (row > 1) {
                coordsInRadius.push({ row: row - 2, col: col + 1 });
            }
            if (row < rows - 1) {
                coordsInRadius.push({ row: row + 1, col: col + 1 });
            }
        }
    }

    if (col > 1) {
        if (row > 0) {
            coordsInRadius.push({ row: row - 1, col: col - 2 });
        }
        coordsInRadius.push({ row, col: col - 2 });
        if (row < rows - 1) {
            coordsInRadius.push({ row: row + 1, col: col - 2 });
        }
    }
    if (col < columns - 2) {
        if (row > 0) {
            coordsInRadius.push({ row: row - 1, col: col + 2 });
        }
        coordsInRadius.push({ row, col: col + 2 });
        if (row < rows - 1) {
            coordsInRadius.push({ row: row + 1, col: col + 2 });
        }
    }

    return coordsInRadius
        .map(coord => indexFromCoordinate(coord, columns));
}

function step(coord: Coordinate, direction: RowDirection): Coordinate {
    switch (direction) {
        case RowDirection.TopToBottom:
            return {
                row: coord.row + 1,
                col: coord.col,
            };
        case RowDirection.BottomToTop:    
            return {
                row: coord.row - 1,
                col: coord.col,
            };
        case RowDirection.BLTR:
            return {
                row: coord.col % 2 === 0
                    ? coord.row
                    : coord.row - 1,
                col: coord.col + 1,
            };
        case RowDirection.BRTL:
            return {
                row: coord.col % 2 === 0
                    ? coord.row
                    : coord.row - 1,
                col: coord.col - 1,
            };
        case RowDirection.TLBR:
            return {
                row: coord.col % 2 === 0
                    ? coord.row + 1
                    : coord.row,
                col: coord.col + 1,
            };
        case RowDirection.TRBL:
            return {
                row: coord.col % 2 === 0
                    ? coord.row + 1
                    : coord.row,
                col: coord.col - 1,
            };
    }
}

export function getIndexesInRow(fromIndex: number, direction: RowDirection, columns: number, rows: number): number[] {
    let coord = coordinateFromIndex(fromIndex, columns);

    const results: number[] = [];

    while (true) {
        coord = step(coord, direction);

        if (coord.col >= 0 && coord.col < columns && coord.row >= 0 && coord.row < rows) {
            results.push(indexFromCoordinate(coord, columns));
        }
        else {
            break;
        }
    }

    return results;
}
