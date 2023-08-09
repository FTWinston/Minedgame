import { MinimumResolvableBoardInfo } from '../types/CellBoard';
import { CellType, CountType } from '../types/CellState';
import { Clue, ClueMap } from '../types/Clue';
import { areValuesContiguous } from './areValuesContiguous';

export type ResolutionResult = CellType.AdjacentClue | CellType.Bomb;

export type ResolvableCells = Map<number, ResolutionResult>;

function incrementCombination<TOtherValue = never>(combination: Array<ResolutionResult | TOtherValue>) {
    // Treat combination as a binary number, but potentially with holes in it. (i.e. indexes that aren't empty or bomb, to be ignored.)
    // Starting at the end, change every bomb value to be empty, until we find an empty value.
    // Change that empty value to a bomb and return true (there may be more combinations possible), or false if it's not found (all combinations have been handled.)
    let currentIndex = combination.length - 1;
    while (currentIndex >= 0 && combination[currentIndex] !== CellType.AdjacentClue) {
        if (combination[currentIndex] === CellType.Bomb) {
            combination[currentIndex] = CellType.AdjacentClue;
        }
        currentIndex--;
    }

    if (currentIndex >= 0) {
        combination[currentIndex] = CellType.Bomb;
        return true;
    }
    else {
        return false;
    }
}

function resolveContiguousOrSplitCells(
    results: ResolvableCells,
    clue: Clue,
    board: MinimumResolvableBoardInfo
) {
    const cells = clue.associatedIndexes
        .map(index => {
            if (index === null) {
                return null;
            }
            const cell = board.cells[index];
            if (cell === null) {
                return null;
            }
            return { index, cell };
        });

    const cellsThatCanBeEmpty = new Array<boolean>(cells.length).fill(false);
    const cellsThatCanBeBombs = new Array<boolean>(cells.length).fill(false);

    // Create an initial combination that won't bugger up based on existing values.
    const currentCombination: CellType[] = cells.map(cell => {
        if (cell === null || cell.cell.type === CellType.AdjacentClue) {
            return CellType.Unknown;
        }
        if (cell.cell.type === CellType.Obscured) {
            return CellType.AdjacentClue;
        }
        if (cell.cell.type === CellType.Bomb) {
            return CellType.Exploded;
        }
        return cell.cell.type;
    });

    const isBomb = (type: CellType) => type === CellType.Bomb || type === CellType.Exploded;
    const contiguous = clue.countType === CountType.Contiguous;

    // Consider every valid combination (right number of bombs, bombs are contiguous or not).
    while (true) { // eslint-disable-line no-constant-condition
        if (currentCombination.filter(value => value === CellType.Bomb).length === clue.numObscuredBombs
            && areValuesContiguous(currentCombination, isBomb, clue.loop) === contiguous) {
            
            // Update cellsThatCanBeEmpty & cellsThatCanBeBombs with the results of this combination.
            for (let i = 0; i < currentCombination.length; i++) {
                const currentValue = currentCombination[i];
                if (currentValue === CellType.Bomb) {
                    cellsThatCanBeBombs[i] = true;
                }
                else if (currentValue === CellType.AdjacentClue) {
                    cellsThatCanBeEmpty[i] = true;
                }
            }
        }
        
        if (!incrementCombination(currentCombination)) {
            break;
        }
    }

    // If a cell is a bomb or empty in every combination, add that to results.
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        if (cell === null) {
            continue;
        }

        const canBeEmpty = cellsThatCanBeEmpty[i];
        const canBeBomb = cellsThatCanBeBombs[i];

        if (canBeBomb !== canBeEmpty) {
            results.set(cell.index, canBeBomb ? CellType.Bomb : CellType.AdjacentClue);
        }
    }
}

function resolveIndividualClues(board: MinimumResolvableBoardInfo, clues: ClueMap) {
    const results: ResolvableCells = new Map();

    for (const clue of clues.values()) {
        // Where the number on a clue exactly matches the number of associated obscured cells minus the number of (associated) revealed bombs,
        // all associated obscured cells can be resolved to be bombs.
        if (clue.associatedObscuredIndexes.length === clue.numObscuredBombs) {
            for (const associatedObscuredCellIndex of clue.associatedObscuredIndexes) {
                results.set(associatedObscuredCellIndex, CellType.Bomb);
            }
        }

        // Where the number on a clue exactly matches the number of (associated) revealed bombs,
        // all associated obscured cells can be resolved to be empty.
        else if (clue.numObscuredBombs === 0) {
            for (const associatedObscuredCellIndex of clue.associatedObscuredIndexes) {
                results.set(associatedObscuredCellIndex, CellType.AdjacentClue);
            }
        }

        // If we have more bombs than we have obscured cells, we have a problem.
        else if (clue.numObscuredBombs > clue.associatedObscuredIndexes.length) {
            throw new Error(`Cell ${clue.clueIndex}'s number is greater than the number of associated obscured cells. (${clue.associatedObscuredIndexes.length} obscured cells, ${clue.numObscuredBombs} bombs in them)`);
        }

        else if (board.numBombs !== undefined && clue.numObscuredBombs > board.numBombs) {
            throw new Error(`Cell ${clue.clueIndex} has more bombs still to reveal (${clue.numObscuredBombs}) than the number of bombs remaining on the board (${board.numBombs}).`);
        }

        else if (clue.countType === CountType.Contiguous || clue.countType === CountType.Split) {
            resolveContiguousOrSplitCells(results, clue, board);
        }
    }

    return results;
}

function getAllObscuredCellIndexes(board: MinimumResolvableBoardInfo): Set<number> {
    const indexes = board.cells
        .reduce((output, cell, index) => {
            if (cell?.type === CellType.Obscured) {
                output.push(index);
            }
            return output;
        }, [] as number[]);

    return new Set(indexes);
}

function resolveCellsUsingBombCount(obscuredCellIndexes: ReadonlySet<number>, numBombs: number): ResolvableCells {
    const results: ResolvableCells = new Map();
    
    if (numBombs === 0) {
        // If there's no bombs left, every obscured cell can resolve to being empty.
        for (const obscuredCellIndex of obscuredCellIndexes) {
            results.set(obscuredCellIndex, CellType.AdjacentClue);
        }
    }
    else if (numBombs === obscuredCellIndexes.size) {
        // If the number of bombs left matches the number of obscured cells left.
        for (const obscuredCellIndex of obscuredCellIndexes) {
            results.set(obscuredCellIndex, CellType.Bomb);
        }
    }
    else if (numBombs > obscuredCellIndexes.size) {
        // Number of bombs left is greater than the number of obscured cells left.
        throw new Error(`Board has ${numBombs} bomb(s) left, but only ${obscuredCellIndexes.size} obscured cells.`);
    }

    return results;
}

function discardObscuredCellsAssociatedWithOnlyOneClue(
    obscuredCellIndexes: Set<number>,
    clues: ClueMap,
): number {
    const obscuredCellIndexesAssociatedWithAnyClue = new Set<number>();
    const cluesWithOnlyExclusiveAssociatedObscuredCells = new Set<Clue>([...clues.values()].filter(clue => clue.associatedObscuredIndexes.length > 0));

    // Filter out any revealed cells whose associated cells aren't exclusive.
    for (const clue of clues.values()) {
        for (const obscuredIndex of clue.associatedObscuredIndexes) {
            if (obscuredCellIndexesAssociatedWithAnyClue.has(obscuredIndex)) {
                // This cell index is already associated with another clue: it isn't exclusive!
                cluesWithOnlyExclusiveAssociatedObscuredCells.delete(clue);
            }
            else {
                // This cell index is exclusive, so far.
                obscuredCellIndexesAssociatedWithAnyClue.add(obscuredIndex);
            }
        }
    }

    if (cluesWithOnlyExclusiveAssociatedObscuredCells.size === 0) {
        return 0;
    }

    // For each "all exclusive" revealed cell, reduce the bomb count by its value, and remove its associated cells from the set.
    let numBombsDiscarded = 0;
    for (const clue of cluesWithOnlyExclusiveAssociatedObscuredCells) {
        numBombsDiscarded += clue.numObscuredBombs;
        for (const obscuredCellIndex of clue.associatedObscuredIndexes) {
            obscuredCellIndexes.delete(obscuredCellIndex);
        }
    }

    return numBombsDiscarded;
}

interface ClueGroup {
    clues: Clue[];
    obscuredCellIndexes: number[];
}

function groupRelatedClues(clues: ClueMap) {
    const results = new Set<ClueGroup>();
    const groupByObscuredCellIndex = new Map<number, ClueGroup>();

    for (const clue of clues.values()) {
        // Ignore fully-resolved clues.
        if (clue.associatedObscuredIndexes.length === 0) {
            continue;
        }

        // Create a new group immediately.
        let currentGroup: ClueGroup = {
            clues: [clue],
            obscuredCellIndexes: [...clue.associatedObscuredIndexes]
        }
        results.add(currentGroup);

        // For each of the current clue's cells, add a reference to the current group.
        // If a cell is already linked to an existing group, merge the current group into that.
        for (const obscuredCellIndex of clue.associatedObscuredIndexes) {
            const moveToGroup = groupByObscuredCellIndex.get(obscuredCellIndex);
            if (moveToGroup && moveToGroup !== currentGroup) {
                // Dump currentGroup, merge it into moveToGroup.
                for (const movingCellIndex of currentGroup.obscuredCellIndexes) {
                    groupByObscuredCellIndex.set(movingCellIndex, moveToGroup);
                }
                moveToGroup.obscuredCellIndexes.push(...currentGroup.obscuredCellIndexes);
                results.delete(currentGroup);

                currentGroup = moveToGroup;
            }
            else {
                groupByObscuredCellIndex.set(obscuredCellIndex, currentGroup);
            }
        }
    }

    // Remove any single-cell groups, cos they'll have been resolved individually already.
    for (const group of results) {
        if (group.clues.length === 1) {
            results.delete(group);
        }
    }

    return results;
}

function isClueSatisfied(clue: Clue, resolutions: ResolvableCells) {
    let numBombsInResolution = 0;

    for (const obscuredCellIndex of clue.associatedObscuredIndexes) {
        if (resolutions.get(obscuredCellIndex) === CellType.Bomb) {
            numBombsInResolution++;
        }
    }

    return numBombsInResolution === clue.numObscuredBombs;
}

function resolveRelatedClueGroup(group: ClueGroup, maxNumBombs?: number): ResolvableCells | null {
    if (group.obscuredCellIndexes.length > 8) {
        return null;
    }

    let validResults: ResolvableCells | null = null;

    const currentCombination = new Array<ResolutionResult>(group.obscuredCellIndexes.length).fill(CellType.AdjacentClue);

    while (true) { // eslint-disable-line no-constant-condition
        // Don't consider combinations with more bombs than remain on the board.
        if (maxNumBombs === undefined || currentCombination.filter(value => value === CellType.Bomb).length <= maxNumBombs) {
            const potentialResult = new Map();
            for (let lookupIndex = 0; lookupIndex < currentCombination.length; lookupIndex++) {
                potentialResult.set(group.obscuredCellIndexes[lookupIndex], currentCombination[lookupIndex]);
            }

            // For each combination, check that every cell in cellChecks is satisfied.
            let isValid = true;
            for (const clue of group.clues) {
                if (!isClueSatisfied(clue, potentialResult)) {
                    isValid = false;
                    break;
                }
            }

            // If any cell check isn't satisfied, discard this combination.
            if (isValid) {
                if (validResults === null) {
                    // Save the results, as this is the first satisfactory combination uncovered.
                    validResults = potentialResult;
                }
                else {
                    // This isn't the first satisfactory combination, so there is no unique one.
                    return null;
                }
            }
        }

        // Treat currentCombination as a binary number, with CellTypes of Empty & Bomb in place of 0 and 1. Increment it by one each time.
        if (!incrementCombination(currentCombination)) {
            break;
        }
    }

    return validResults;
}

export function getResolvableCells(board: MinimumResolvableBoardInfo, clues: ClueMap): ResolvableCells {
    let results: ResolvableCells;

    // For the simplest scenario, look at each revealed cell (with associated unrevealed cells) individually.
    // If any have the same number of outstanding bombs as they have unrevealed cells, those unrevealed cells can all resolve.
    results = resolveIndividualClues(board, clues);

    // If the simplest scenario gave us any resolutions, return those.
    if (results.size > 0) {
        return results;
    }

    // Get all obscured cell indexes remaining on the board.
    const obscuredCellIndexes = getAllObscuredCellIndexes(board);

    // If the number in that set matches the number of bombs remaining, then we know what they all are.
    const numBombs = board.numBombs;
    if (numBombs !== undefined) {
        results = resolveCellsUsingBombCount(obscuredCellIndexes, numBombs);

        if (results.size > 0) {
            return results;
        }
    }

    // Now resolve "related" groups of cells, where some info is known. Each group should not overlap at all.
    const relatedClueGroups = groupRelatedClues(clues);

    for (const relatedClueGroup of relatedClueGroups) {
        // See if there's a single, unique combination for all cells in this group.
        const groupResults = resolveRelatedClueGroup(relatedClueGroup, numBombs);
        
        if (groupResults) {
            groupResults.forEach((value, index) => results.set(index, value));
        }
    }

    if (results.size > 0) {
        return results;
    }

    // Discard any cells from obscuredCellIndexes that are associated to only one revealed cell, reduce numBombs by that cell's amount, and re-run resolveCellsUsingBombCount on the obscured cells that remain.
    if (numBombs !== undefined) {
        const numRemainingBombsDiscarded = discardObscuredCellsAssociatedWithOnlyOneClue(obscuredCellIndexes, clues);
        if (numRemainingBombsDiscarded > 0) {
            results = resolveCellsUsingBombCount(obscuredCellIndexes, numBombs - numRemainingBombsDiscarded);
        }
    }

    return results;
}
