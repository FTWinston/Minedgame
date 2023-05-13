import { MinimumResolvableBoardInfo } from '../types/CellBoard';
import { CellType, CountType } from '../types/CellState';
import { getClues } from './getClues';
import { getResolvableCells } from './getResolvableCells';

describe('two cells', () => {
    test('obscured, 1', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }],
            numBombs: 1,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 0, CellType.Bomb ]
        ]));
    });

    test('1, obscured', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 1,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 1, CellType.Bomb ]
        ]));
    });
    
    test('obscured, 0', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 0,
            }],
            numBombs: 0,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 0, CellType.Empty ]
        ]));
    });
    
    test('0, obscured', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 0,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 0,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 1, CellType.Empty ]
        ]));
    });
    
    test('obscured, obscured: two bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 2,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 0, CellType.Bomb ],
            [ 1, CellType.Bomb ]
        ]));
    });

    test('obscured, obscured: no bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 0,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 0, CellType.Empty ],
            [ 1, CellType.Empty ]
        ]));
    });

    test('obscured, obscured: one bomb', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 1,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map());
    });
    
    test('flag, flag', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Bomb,
            }, {
                type: CellType.Bomb,
            }],
            numBombs: 0,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map());
    });
    
    test('2, obscured', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 2,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 2,
        };

        const clues = getClues(board);
        
        expect(() => getResolvableCells(board, clues)).toThrowError();
    });

    test('obscured, 2', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 2,
            }],
            numBombs: 2,
        };

        const clues = getClues(board);
        
        expect(() => getResolvableCells(board, clues)).toThrowError();
    });
    
    test('flagged, 1', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Bomb,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }],
            numBombs: 0,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map());
    });

    test('1, flagged', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Bomb,
            }],
            numBombs: 0,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map());
    });
    
    test('flagged, 0', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Bomb,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 0,
            }],
            numBombs: 1,
        };

        const clues = getClues(board);
        
        expect(() => getResolvableCells(board, clues)).toThrowError();
    });
    
    test('0, flagged', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 0,
            }, {
                type: CellType.Bomb,
            }],
            numBombs: 1,
        };

        const clues = getClues(board);
        
        expect(() => getResolvableCells(board, clues)).toThrowError();
    });
    
    test('flagged, obscured: one bomb', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Bomb,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 1,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 1, CellType.Bomb ]
        ]));
    });

    test('flagged, obscured: no bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Bomb,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 0,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 1, CellType.Empty ]
        ]));
    });
    test('obscured, flagged: one bomb', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Bomb,
            }],
            numBombs: 1,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 0, CellType.Bomb ]
        ]));
    });

    test('obscured, flagged: no bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Bomb,
            }],
            numBombs: 0,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 0, CellType.Empty ]
        ]));
    });
});

describe('four cells in a line', () => {
    test('obscured, obscured, obscured, 0: no bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 4,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 0,
            }],
            numBombs: 0,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 2, CellType.Empty ],
        ]));
    });

    test('obscured, obscured, obscured, 0: one bomb', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 4,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 0,
            }],
            numBombs: 1,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 2, CellType.Empty ],
        ]));
    });

    test('obscured, obscured, obscured, 0: two bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 4,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 0,
            }],
            numBombs: 2,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 2, CellType.Empty ],
        ]));
    });

    test('obscured, obscured, obscured, 1: one bomb', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 4,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }],
            numBombs: 1,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 2, CellType.Bomb ],
        ]));
    });

    test('obscured, obscured, bomb, bomb: no bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 4,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Bomb,
            }, {
                type: CellType.Bomb,
            }],
            numBombs: 0,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 0, CellType.Empty ],
            [ 1, CellType.Empty ],
        ]));
    });

    test('obscured, obscured, bomb, bomb: one bomb', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 4,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Bomb,
            }, {
                type: CellType.Bomb,
            }],
            numBombs: 1,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map());
    });

    test('obscured, obscured, bomb, bomb: two bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 4,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Bomb,
            }, {
                type: CellType.Bomb,
            }],
            numBombs: 2,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 0, CellType.Bomb ],
            [ 1, CellType.Bomb ],
        ]));
    });

    test('obscured, obscured, obscured, 1: two bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 4,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }],
            numBombs: 2,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 2, CellType.Bomb ],
        ]));
    });
    
    test('obscured, obscured, 0, obscured: no bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 4,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 0,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 0,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 1, CellType.Empty ],
            [ 3, CellType.Empty ],
        ]));
    });

    test('obscured, obscured, 0, obscured: one bomb', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 4,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 0,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 1,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 1, CellType.Empty ],
            [ 3, CellType.Empty ],
        ]));
    });

    test('obscured, obscured, 1, obscured: no bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 4,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 0,
        };

        const clues = getClues(board);
        
        expect(() => getResolvableCells(board, clues)).toThrowError();
    });

    test('obscured, obscured, 1, obscured: one bomb', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 4,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 1,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 0, CellType.Empty ], // Infer this from the only bomb being one of the other two.
        ]));
    });

    test('obscured, obscured, 1, obscured: two bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 4,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 2,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 0, CellType.Bomb ], // Infer this from one bomb being one of the other two.
        ]));
    });

    test('obscured, obscured, 2, obscured: no bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 4,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 0,
        };

        const clues = getClues(board);
        
        expect(() => getResolvableCells(board, clues)).toThrowError();
    });

    test('obscured, obscured, 2, obscured: two bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 4,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 2,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 2,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 1, CellType.Bomb ],
            [ 3, CellType.Bomb ],
        ]));
    });

    test('obscured, obscured, 2, obscured: three bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 4,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 2,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 3,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 1, CellType.Bomb ],
            [ 3, CellType.Bomb ],
        ]));
    });

    test('1, obscured, obscured, 1', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 4,
            cells: [{
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }],
            numBombs: 2,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 1, CellType.Bomb ],
            [ 2, CellType.Bomb ],
        ]));
    });

    test('obscured, 1, 1, obscured', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 4,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 2,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 0, CellType.Bomb ],
            [ 3, CellType.Bomb ],
        ]));
    });

    test('0, obscured, obscured, 0', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 4,
            cells: [{
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 0,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 0,
            }],
            numBombs: 0,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 1, CellType.Empty ],
            [ 2, CellType.Empty ],
        ]));
    });

    test('obscured, 0, 0, obscured', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 4,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 0,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 0,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 0,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 0, CellType.Empty ],
            [ 3, CellType.Empty ],
        ]));
    });

    test('1, obscured, 2, obscured: two bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 4,
            cells: [{
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 2,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 2,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 1, CellType.Bomb ],
            [ 3, CellType.Bomb ],
        ]));
    });
});

describe('two by two', () => {
    test('obscured, obscured, 0, obscured', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 0,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 0,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 0, CellType.Empty ],
            [ 3, CellType.Empty ],
        ]));
    });

    test('obscured, obscured, 1, obscured', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 1,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 1, CellType.Empty ], // Infer this from the bomb being one of the other two.
        ]));
    });

    test('obscured, obscured, 2, obscured: two bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 2,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 2,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 0, CellType.Bomb ],
            [ 3, CellType.Bomb ],
        ]));
    });

    test('flag, obscured, 2, flag: no bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Bomb,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 2,
            }, {
                type: CellType.Bomb,
            }],
            numBombs: 0,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 1, CellType.Empty ],
        ]));
    });

    test('flag, obscured, 2, flag: one bomb', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Bomb,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 2,
            }, {
                type: CellType.Bomb,
            }],
            numBombs: 1,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 1, CellType.Bomb ],
        ]));
    });

    test('obscured, obscured, 2, obscured: three bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 2,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 3,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 0, CellType.Bomb ],
            [ 3, CellType.Bomb ],
        ]));
    });

    test('obscured, 2, 2, obscured', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 2,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 2,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 2,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 0, CellType.Bomb ],
            [ 3, CellType.Bomb ],
        ]));
    });

    test('obscured, 1, 1, obscured', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 1,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map());
    });

    test('1, 1, 1, obscured', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Obscured,
            }],
            numBombs: 1,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 3, CellType.Bomb ],
        ]));
    });
});

describe('Circle of seven cells', () => {
    test('0 in the middle', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 3,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 0,
            }, {
                type: CellType.Obscured,
            }, 
            null, {
                type: CellType.Obscured,
            }, null],
            numBombs: 0,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 0, CellType.Empty ],
            [ 1, CellType.Empty ],
            [ 2, CellType.Empty ],
            [ 3, CellType.Empty ],
            [ 5, CellType.Empty ],
            [ 7, CellType.Empty ],
        ]));
    });
    
    test('1 in the middle', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 3,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Obscured,
            }, 
            null, {
                type: CellType.Obscured,
            }, null],
            numBombs: 1,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map());
    });
    
    test('6 in the middle', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 3,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 6,
            }, {
                type: CellType.Obscured,
            }, 
            null, {
                type: CellType.Obscured,
            }, null],
            numBombs: 6,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 0, CellType.Bomb ],
            [ 1, CellType.Bomb ],
            [ 2, CellType.Bomb ],
            [ 3, CellType.Bomb ],
            [ 5, CellType.Bomb ],
            [ 7, CellType.Bomb ],
        ]));
    });

    test('1 on either side: one bomb', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 3,
            cells: [{
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, 
            null, {
                type: CellType.Obscured,
            }, null],
            numBombs: 1,
        };

        const clues = getClues(board);
        
        // This is one of those "overlapping set" situations.
        // Only the cell in both sets can be the bomb.
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 1, CellType.Empty ],
            [ 2, CellType.Empty ],
            [ 3, CellType.Empty ],
            [ 4, CellType.Bomb ],
            [ 7, CellType.Empty ],
        ]));
    });

    test('1 on three sides: one bomb', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 3,
            cells: [{
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, 
            null, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, null],
            numBombs: 1,
        };

        const clues = getClues(board);
        
        // This is the same "overlapping set" situation as above.
        // Only the cell in all three sets sets can be the bomb.
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 1, CellType.Empty ],
            [ 3, CellType.Empty ],
            [ 4, CellType.Bomb ],
            [ 5, CellType.Empty ],
        ]));
    });

    test.skip('1 on either side: two bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 3,
            cells: [{
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, 
            null, {
                type: CellType.Obscured,
            }, null],
            numBombs: 2,
        };

        const clues = getClues(board);
        
        // FIXME: More complicated "overlapping set" situation.
        // If the cell in both sets was the bomb, no one other cell could be the remaining bomb.
        // So the cell in both sets cannot be the bomb.
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 4, CellType.Empty ],
        ]));
    });

    test('2 on three sides: three bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 3,
            cells: [{
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 2,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 2,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, 
            null, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 2,
            }, null],
            numBombs: 3,
        };

        const clues = getClues(board);
        
        // More complicated version of the "overlapping set" situation as above.
        // If the cell in all three sets was the bomb, no combination of other cells leaves two bombs touching each clue.
        // So the cell in all three sets cannot be the bomb.
        // Hence, the other three cells must be bombs.
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 1, CellType.Bomb ],
            [ 3, CellType.Bomb ],
            [ 4, CellType.Empty ],
            [ 5, CellType.Bomb ],
        ]));
    });

    test('1, 2 on adjacent sides: three bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 3,
            cells: [{
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 2,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, 
            null, {
                type: CellType.Obscured,
            }, null],
            numBombs: 3,
        };

        const clues = getClues(board);

        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 2, CellType.Bomb ],
            [ 4, CellType.Bomb ],
        ]));
    });

    test('2, 1 on adjacent sides: three bombs', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 3,
            cells: [{
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 2,
            }, {
                type: CellType.Empty,
                countType: CountType.Normal,
                number: 1,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, 
            null, {
                type: CellType.Obscured,
            }, null],
            numBombs: 3,
        };

        const clues = getClues(board);

        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 3, CellType.Bomb ],
            [ 4, CellType.Bomb ],
        ]));
    });
});

describe('contiguous & split', () => {
    test('two by two contiguous, last bomb must be adjacent to flag', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 2,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Bomb,
            }, {
                type: CellType.Empty,
                countType: CountType.Contiguous,
                number: 2,
            }],
            numBombs: 1,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 0, CellType.Bomb ],
            [ 1, CellType.Empty ],
        ]));
    });

    test('three by two contiguous, space not adjacent to flag must be empty', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 3,
            cells: [{
                type: CellType.Bomb,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Contiguous,
                number: 2,
            }, null],
            numBombs: 1,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 2, CellType.Empty ],
        ]));
    });

    test('three by two split, space not adjacent to flag must be bomb', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 3,
            cells: [{
                type: CellType.Bomb,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Split,
                number: 2,
            }, null],
            numBombs: 1,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 1, CellType.Empty ],
            [ 2, CellType.Bomb ],
            [ 3, CellType.Empty ],
        ]));
    });

    test('three by two contiguous, bombs must fit into available space', () => {
        const board: MinimumResolvableBoardInfo = {
            columns: 3,
            cells: [{
                type: CellType.Obscured,
            }, {
                type: CellType.Unknown,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Obscured,
            }, {
                type: CellType.Empty,
                countType: CountType.Contiguous,
                number: 2,
            }, null],
            numBombs: 2,
        };

        const clues = getClues(board);
        
        expect(getResolvableCells(board, clues)).toEqual(new Map([
            [ 0, CellType.Bomb ],
            [ 2, CellType.Empty ],
            [ 3, CellType.Bomb ],
        ]));
    });
});
