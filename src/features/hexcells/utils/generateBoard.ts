import type { CellBoardDefinition } from '../types/CellBoard';
import { CellType, CountType, EmptyCell, RadiusClue, RowClue, RowDirection, UnderlyingCellState, CellState, ClueCell } from '../types/CellState';
import { Clue, ClueMap } from '../types/Clue';
import { areValuesContiguous } from './areValuesContiguous';
import { ShapeConfig, generateBoardShape } from './generateBoardShape';
import { addClue, updateClues } from './getClues';
import { ResolvableCells, getResolvableCells } from './getResolvableCells';
import { deleteRandom, getRandom, getRandomFloat, insertRandom } from 'src/utils/random';
import { shuffle } from 'src/utils/shuffle';
import { coordinateFromIndex, getAdjacentIndexes, getIndexesInRadius, getIndexesInRow } from './indexes';
import { isClueCell } from './isClueCell';

export interface GenerationConfig extends ShapeConfig {
    /** Fraction of obscured cells that will be revealed to be bombs. Lower values are easier. */
    bombFraction: number;

    /** Fraction of obscured cells that will be revealed to show a ? instead of a cell count. Lower values are easier. */
    unknownFraction?: number;

    /** When generating, chance of having a new cell start revealed. */
    revealChance?: number;

    /** When generating, chance of adding a "radius" clue. */
    radiusClueChance?: number;

    /** When generating, chance of adding a "row" clue (along any axis). */
    rowClueChance?: number;

    /** When generating, chance of upgrading a "normal" clue to indicate that adjacent bombs are contiguous. */
    contiguousClueChance?: number;

    /** When generating, chance of upgrading a "normal" clue to indicate that adjacent bombs are not contiguous. */
    splitClueChance?: number;

    /** Fraction of games that will require the remaining bomb count to be used to solve the last obscured cells. */
    remainingBombCountFraction?: number;
}

type FullConfig = Required<GenerationConfig> & {
    fullChance: number;
}

interface RowClueOption {
    index: number;
    directions: RowDirection[];
}

interface GeneratingState {
    cells: Array<CellState | null>;
    underlying: Array<CellState | null>;
    config: FullConfig;
    hints: number[];
    clues: ClueMap;
    rows: number;
    columns: number;
    numBombs?: number;
    numBombsSoFar: number;
    initiallyRevealedIndexes: Set<number>;
    obscuredIndexes: Set<number>;
    potentialContiguousClueCells: Clue[];
    potentialSplitClueCells: Clue[];
    potentialRowClueIndexes: RowClueOption[];
    potentialRadiusClueIndexes: number[];
    nextResolvableCells?: ResolvableCells;
}

function expandConfig(config: GenerationConfig): FullConfig {
    const fullConfig: FullConfig = {
        ...config,
        orientation: config.orientation ?? 'portrait',
        unknownFraction: config.unknownFraction ?? 0,
        contiguousClueChance: config.contiguousClueChance ?? 0,
        splitClueChance: config.splitClueChance ?? 0,
        rowClueChance: config.rowClueChance ?? 0,
        radiusClueChance: config.radiusClueChance ?? 0,
        revealChance: config.revealChance ?? 0,
        remainingBombCountFraction: config.remainingBombCountFraction ?? 0,
        fullChance: 0,
    };

    // Make the "chance" variables cumulative.
    fullConfig.splitClueChance += fullConfig.contiguousClueChance;
    fullConfig.rowClueChance += fullConfig.splitClueChance;
    fullConfig.radiusClueChance += fullConfig.rowClueChance;
    fullConfig.revealChance += fullConfig.radiusClueChance;
    if (fullConfig.revealChance === 0) {
        fullConfig.revealChance = 1;
    }
    fullConfig.fullChance = fullConfig.revealChance;

    return fullConfig;
}

const allDirections = [
    RowDirection.TopToBottom,
    RowDirection.BottomToTop,
    RowDirection.TLBR,
    RowDirection.BLTR,
    RowDirection.BRTL,
    RowDirection.TRBL,
]

function getPotentialRowClueIndexes(cells: (CellState | null)[], columns: number, rows: number) {
    return cells.reduce((results, cell, index) => {
        if (cell === null && getAdjacentIndexes(index, columns, rows)
            .some(adjacentIndex => adjacentIndex !== null && cells[adjacentIndex] !== null)) {
            const directions = allDirections
                .filter(dir => {
                    const rowCells = getIndexesInRow(index, dir, columns, rows)
                        .map(index => cells[index]);

                    if (rowCells[0] === null) {
                        return false;
                    }

                    return rowCells.filter(cell => cell !== null).length > 3;
                });

            if (directions.length > 0) {
                insertRandom(results, { index, directions });
            }
        }
        return results;
    }, [] as RowClueOption[]);
}

function getPotentialRadiusClueIndexes(cells: (CellState | null)[], columns: number, rows: number) {
    return cells.reduce((results, _cell, index) => {
        const coordinate = coordinateFromIndex(index, columns);

        if (coordinate.col > 1 && coordinate.col < columns - 2
            && coordinate.row > 1 && coordinate.row < rows - 2) {
            insertRandom(results, index);
        }
        return results;
    }, [] as number[]);
}

/** Prepare the shape of the board, with every cell obscured, and any extra info needed for generation purposes. */
function createInitialState(config: FullConfig): GeneratingState {
    const { cells, rows, columns } = generateBoardShape<CellState>(config, { type: CellType.Obscured });

    const obscuredIndexes = new Set<number>();
    const underlying = cells.map((cell, index) => {
        if (cell === null) {
            return null;
        }

        obscuredIndexes.add(index);
        return { type: CellType.Exploded };
    }) as Array<UnderlyingCellState | null>;

    return {
        config,
        clues: new Map(),
        rows,
        columns,
        cells,
        underlying,
        hints: [],
        numBombsSoFar: 0,
        initiallyRevealedIndexes: new Set(),
        obscuredIndexes,
        potentialContiguousClueCells: [],
        potentialSplitClueCells: [],
        potentialRowClueIndexes: getPotentialRowClueIndexes(cells, columns, rows),
        potentialRadiusClueIndexes: getPotentialRadiusClueIndexes(cells, columns, rows),
    };
}

/** Determine what cells can be resolved. If they're bombs, mark them as such. If they're empty, mark them unknown, and add to state.revealableIndexes. */
function resolveCells(state: GeneratingState) {
    // If a previous step left some "pre-computed" resolvable cells, reuse those. Otherwise, resolve.
    const resolvableCells = state.nextResolvableCells
        ?? getResolvableCells(state, state.clues);
    delete state.nextResolvableCells;

    if (resolvableCells.size === 0) {
        return false;
    }
    
    const revealableIndexes: number[] = [];

    // Add the index of every resolvable cell to the hints, in a random order.
    const resolvableIndexes = [...resolvableCells.keys()];
    shuffle(resolvableIndexes)
    state.hints.push(...resolvableIndexes);

    for (const [index, cellType] of resolvableCells) {
        state.obscuredIndexes.delete(index);
        state.hints.push(index);

        // Allocate and reveal any just-resolved bombs.
        if (cellType === CellType.Bomb) {
            state.cells[index] = state.underlying[index] = { type: CellType.Bomb };
            state.numBombsSoFar++;
        }
        // Allocate just-resolved empty cells to unknown, but don't reveal them yet.
        // (All just-resolved bombs must be resolved before these can be allocated to Empty, as these may affect the clues we allocate!)
        else {
            state.underlying[index] = { type: CellType.Unknown };
            revealableIndexes.push(index);
        }
    }

    revealCells(state, revealableIndexes);
    return true;
}

function tryModifyClue(state: GeneratingState, cluesToTry: Clue[], countType: CountType): boolean {
    for (let tryIndex = 0; tryIndex < cluesToTry.length; tryIndex++) {
        const clue = cluesToTry[tryIndex];

        if (clue.associatedObscuredIndexes.length === 0) {
            // Nothing obscured next to this cell, it can't give us more info
            // if it is upgraded now, or in the future.
            cluesToTry.splice(tryIndex, 1);
            tryIndex--;
            continue;
        }

        const cell = state.cells[clue.clueIndex] as ClueCell;

        // Try each that remains, until we find one that lets more cells
        // be revealed if its type is changed.
        const prevType = clue.countType;
        clue.countType = cell.countType = countType;

        const nextResolvableCells = getResolvableCells(state, state.clues);
        if (nextResolvableCells.size > 0) {
            state.nextResolvableCells = nextResolvableCells;
            return true;
        }

        // Reset the count type on a cell that a cell that wasn't (yet) worth changing.
        clue.countType = cell.countType = prevType;
    }
    
    return false;
}

function tryAddRowClue(state: GeneratingState): boolean {
    for (let attempt = 1; attempt < 5; attempt++) {
        const clueInfo = deleteRandom(state.potentialRowClueIndexes);
        if (clueInfo === null) {
            return false;
        }

        const direction = getRandom(clueInfo.directions);
        if (direction === null) {
            continue;
        }

        if (addRowClue(state, clueInfo.index, direction)) {
            return true;
        }
    }

    return false;
}

function tryAddRadiusClue(state: GeneratingState): boolean {
    for (let attempt = 1; attempt < 5; attempt++) {
        const index = deleteRandom(state.potentialRadiusClueIndexes);
        if (index === null) {
            return false;
        }

        if (addRadiusClue(state, index)) {
            return true;
        };
    }

    return false;
}

function revealInitialCell(state: GeneratingState, obscuredIndexes: number[]): boolean {
    // Reveal an obscured cell at random. Ensure that it's not an entirely isolated zero on its own.
    // Try this a few times before giving up.
    for (let attempt = 1; attempt < 5; attempt++) {
        const index = getRandom(obscuredIndexes)!;

        if (addEmptyCellClue(state, index, true)) {
            state.initiallyRevealedIndexes.add(index);
            state.obscuredIndexes.delete(index);
            return true;
        }
    }

    return false;
}

function completeNewClue(
    state: GeneratingState,
    index: number,
    cell: ClueCell,
    associatedIndexes: Array<number | null>,
    mustHaveBombs: boolean = false,
) {
    const associatedCells = associatedIndexes
        .map(index => index === null ? null : state.underlying[index]) as Array<CellState | null>;
    
    let numBombs = 0;
    let hasAnyObscured = false;
    const toAllocate = new Map<number, CellState>();

    // Allocate associated cells now, so that our clue won't be made incorrect by a later allocation.
    // But leave these cells obscured, for now.
    for (let associationIndex = 0; associationIndex < associatedCells.length; associationIndex++) {
        const associatedCell = associatedCells[associationIndex];

        if (associatedCell === null) {
            continue;
        }

        const associatedCellIndex = associatedIndexes[associationIndex]!;
        if (state.obscuredIndexes.has(associatedCellIndex)) {
            hasAnyObscured = true;
        }

        if (associatedCell.type === CellType.Exploded) {
            const addBomb = getRandomFloat() < state.config.bombFraction;

            if (addBomb) {
                numBombs ++;
    
                toAllocate.set(associatedCellIndex, { type: CellType.Bomb });
            }
            else {
                toAllocate.set(associatedCellIndex, { type: CellType.Unknown });
            }
        }
        else if (associatedCell.type === CellType.Bomb) {
            numBombs++;
        }
    }

    if (mustHaveBombs && numBombs === 0) {
        return false;
    }

    for (const [allocateIndex, cell] of toAllocate) {
        state.underlying[allocateIndex] = cell;
    }
    
    cell.number = numBombs;
    state.cells[index] = state.underlying[index] = cell;

    const clue = addClue(state, state.clues, index, cell, associatedIndexes);

    if (cell.type !== CellType.RadiusClue && numBombs > 1) {
        const contiguous = areValuesContiguous(associatedCells, cell => cell?.type === CellType.Bomb, true);
        
        if (hasAnyObscured) {
            if (contiguous) {
                insertRandom(state.potentialContiguousClueCells, clue);
            }
            else {
                insertRandom(state.potentialSplitClueCells, clue);
            }
        }
        
        // TODO: generate "excess" contiguous / split clues here?
    }

    return true;
}

function addEmptyCellClue(state: GeneratingState, index: number, requireAdjacentCells: boolean = false) {
    const associatedIndexes = getAdjacentIndexes(index, state.columns, state.rows);

    if (requireAdjacentCells && !associatedIndexes.some(assoc => assoc !== null && state.underlying[assoc])) {
        return false;
    }

    const cell: EmptyCell = {
        type: CellType.Empty,
        countType: CountType.Normal,
        number: 0,
    }

    completeNewClue(state, index, cell, associatedIndexes);
    return true;
}

function addRowClue(state: GeneratingState, index: number, direction: RowDirection): boolean {
    const associatedIndexes = getIndexesInRow(index, direction, state.columns, state.rows);

    const cell: RowClue = {
        type: CellType.RowClue,
        countType: CountType.Normal,
        direction,
        number: 0,
    }

    if (!completeNewClue(state, index, cell, associatedIndexes, true)) {
        return false;
    }

    state.initiallyRevealedIndexes.add(index);

    return true;
}

function addRadiusClue(state: GeneratingState, index: number): boolean {
    const associatedIndexes = getIndexesInRadius(index, state.columns, state.rows);

    const cell: RadiusClue = {
        type: CellType.RadiusClue,
        countType: CountType.Normal,
        number: 0,
    }

    if (!completeNewClue(state, index, cell, associatedIndexes, true)) {
        return false;
    }

    state.initiallyRevealedIndexes.add(index);

    return true;
}

/** Add a "normal" empty cell clue into each cell index provided. */
function revealCells(state: GeneratingState, revealableIndexes: number[]) {
    // Ensure that at least one cell is revealed to be a empty (i.e. a clue), rather than unknown.
    let firstReveal = true;
    for (const indexToReveal of revealableIndexes) {
        if (!firstReveal && getRandomFloat() <= state.config.unknownFraction) {
            state.cells[indexToReveal] = state.underlying[indexToReveal] = {
                type: CellType.Unknown,
            };
        }
        else {
            addEmptyCellClue(state, indexToReveal);
            firstReveal = false;
        }
    }
}

/** Add an initial clue of any allowed type onto the board, or enhance an existing clue. */
function pickAndAddClue(state: GeneratingState): boolean {
    const chance = getRandomFloat() * state.config.fullChance;

    if (chance <= state.config.contiguousClueChance) {
        if (tryModifyClue(state, state.potentialContiguousClueCells, CountType.Contiguous)) {
            return true;
        }
    }
    else if (chance <= state.config.splitClueChance) {
        if (tryModifyClue(state, state.potentialSplitClueCells, CountType.Split)) {
            return true;
        }
    }
    else if (chance <= state.config.rowClueChance) {
        if (tryAddRowClue(state)) {
            return true;
        }
    }
    else if (chance <= state.config.radiusClueChance) {
        if (tryAddRadiusClue(state)) {
            return true;
        }
    }
    
    // TODO: not helpful that obscuredIndexes is a Set here. Could it be an array? (Or both!?)
    const allObscuredIndexes = [...state.obscuredIndexes];
    const revealableIndexes = allObscuredIndexes
        .filter(index => state.underlying[index]?.type !== CellType.Bomb);
        
    if (revealableIndexes.length === 0) {
        state.numBombs = state.obscuredIndexes.size;
        return true;
    }

    if (allObscuredIndexes.length <= 5 && getRandomFloat() < state.config.remainingBombCountFraction) {
        const anyMustBeBombs = allObscuredIndexes
            .some(index => state.underlying[index]?.type === CellType.Bomb);
        const anyMustBeEmpty = allObscuredIndexes
            .some(index => state.underlying[index]?.type === CellType.Unknown);

        if (!(anyMustBeBombs && anyMustBeEmpty)) {
            let allBombs: boolean;
            if (anyMustBeBombs) {
                allBombs = true;
            }
            else if (anyMustBeEmpty) {
                allBombs = false;
            }
            else {
                allBombs = getRandomFloat() < 0.5;
            }
            
            state.numBombs = allBombs ? allObscuredIndexes.length : 0;
            return true;
        }
    }

    // When no other type of clue has been added, reveal an additional cell.
    return revealInitialCell(state, revealableIndexes);
}

function createDisplayCell(state: GeneratingState, cell: CellState | null, index: number): CellState | null {
    if (cell === null) {
        return null;
    }

    // Only return state for revealed cells.
    if (!state.initiallyRevealedIndexes.has(index)) {
        return { type: CellType.Obscured };
    }

    return cell;
}

function createUnderlyingCell(state: GeneratingState, cell: CellState | null, index: number): UnderlyingCellState | null {
    if (cell === null) {
        return null;
    }

    const result = {
        ...cell,
    } as UnderlyingCellState;

    if (isClueCell(result)) {
        result.targetIndexes = state.clues.get(index)?.associatedIndexes
            .filter(index => index !== null) as number[]
            ?? [];
    }

    if (result.type === CellType.Empty || result.type === CellType.Bomb || result.type === CellType.Unknown) {
        result.clueIndexes = [...state.clues.values()]
            .filter(clue => clue.associatedIndexes.includes(index))
            .map(clue => clue.clueIndex);
    }

    return result;
}

/** Prepare the extra info that goes into "display" and "underlying" versions of the cells, such as obscuring display cells that aren't initially-revealed ones. */
function createBoardDefinition(state: GeneratingState): CellBoardDefinition {
    return {
        cells: state.underlying.map((cell, index) => createDisplayCell(state, cell, index)),
        underlying: state.underlying.map((cell, index) => createUnderlyingCell(state, cell, index)),
        columns: state.columns,
        hints: state.hints,
    };
}

export function generateBoard(config: GenerationConfig): CellBoardDefinition {
    const fullConfig = expandConfig(config);

    let state: GeneratingState = createInitialState(fullConfig);
    let prevState = state;
    let turnsSinceLastResolution = 0;

    // Repeat the following until there are no obscured cells left. Then the whole board has been resolved!
    while (state.obscuredIndexes.size > 0) {
        if (!resolveCells(state)) {
            // If a new clue was just added and it didn't help, discard it, unless we've been stuck for a while.
            if (++turnsSinceLastResolution < 100) {
                state = prevState;
            }

            // Copy the state when adding a clue, so we can roll back if the clue we add isn't helpful.
            // If adding a clue fails, try again. (It can pick a different clue type.)
            state = copyState(state);
            while (!pickAndAddClue(state))
                ;
        }
        else {
            prevState = state;
            turnsSinceLastResolution = 0;
        }

        updateClues(state, state.clues);
    }

    return createBoardDefinition(state);
}

function copyState(state: GeneratingState): GeneratingState {
    return {
        ...state,
        clues: new Map(state.clues),
        cells: [...state.cells],
        underlying: [...state.underlying],
        hints: [...state.hints],
        initiallyRevealedIndexes: new Set(state.initiallyRevealedIndexes),
        obscuredIndexes: new Set(state.obscuredIndexes),
        potentialContiguousClueCells: [...state.potentialContiguousClueCells],
        potentialSplitClueCells: [...state.potentialSplitClueCells],
        potentialRowClueIndexes: [...state.potentialRowClueIndexes],
        potentialRadiusClueIndexes: [...state.potentialRadiusClueIndexes],
    };
}
