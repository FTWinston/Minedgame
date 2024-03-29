import { UnexpectedValueError } from 'src/utils/UnexpectedValueError';
import { CellBoard, CellBoardAction } from '../types/CellBoard';
import { CellType, DisplayCellState } from '../types/CellState';
import { isClueResolved, isObscured, markCluesAsResolved } from './resolved';

export function hexCellReducer(state: CellBoard, action: CellBoardAction): CellBoard | void {
    switch (action.type) {
        case 'reveal': {
            if (state.result) {
                return;
            }
            
            const currentState = state.cells[action.index];
            if (!isObscured(currentState)) {
                return;
            }

            const underlyingState = state.underlying[action.index];
            if (underlyingState === null) {
                return;
            }

            if (underlyingState.type === CellType.Bomb) {
                state.cells[action.index] = {
                    type: CellType.Exploded,
                };

                state.result = 'failure';
                state.errorIndex = action.index;
                state.numErrors ++;
                return;
            }
            
            if (underlyingState.type === CellType.AdjacentClue) {
                // Copy the underlying cell, without copying linked/associated cell data.
                const display: DisplayCellState = {
                    type: underlyingState.type,
                    countType: underlyingState.countType,
                    number: underlyingState.number,
                    targetIndexes: underlyingState.targetIndexes,
                    resolved: isClueResolved(state, underlyingState.targetIndexes),
                };

                state.cells[action.index] = display;
            }
            else {
                // Should just be "unknown" cells.
                state.cells[action.index] = underlyingState as DisplayCellState;
            }

            // Mark any associated clues as fully resolved.
            if (underlyingState.type === CellType.AdjacentClue || underlyingState.type === CellType.Unknown) {
                markCluesAsResolved(state, underlyingState.clueIndexes);
            }

            // Success when the last obscured cell is revealed.
            if (!state.cells.some(cell => cell?.type === CellType.Obscured)) {
                state.result = 'success';
            }
            return;
        }
        case 'flag': {
            if (state.result) {
                return;
            }

            const currentState = state.cells[action.index];
            if (!isObscured(currentState)) {
                return;
            }

            const underlyingState = state.underlying[action.index];
            if (underlyingState?.type !== CellType.Bomb) {
                state.errorIndex = action.index;
                state.numErrors ++;
                return;
            }

            state.cells[action.index] = { type: CellType.Bomb };

            state.numBombs--;

            // Mark any associated clues as fully resolved.
            markCluesAsResolved(state, underlyingState.clueIndexes);
            
            // Success when the last obscured cell is flagged.
            if (!state.cells.some(cell => cell?.type === CellType.Obscured)) {
                state.result = 'success';
            }

            return;
        }
        case 'hint': {
            for (let i = 0; i < state.hints.length; i++) {
                const hintIndex = state.hints[i];
                const hintCell = state.cells[hintIndex];

                // When we find a still-valid hint, apply that, and remove any prior hints, as they're all no longer valid.
                if (isObscured(hintCell)) {
                    const notAlreadyHinted = state.cells[hintIndex]?.type !== CellType.Hint;
                    state.cells[hintIndex] = { type: CellType.Hint };
                    state.hints.splice(0, i);
                    if (notAlreadyHinted) {
                        state.hintsUsed++;
                    }
                    break;
                }
            }
            return;
        }
        case 'next': {
            return {
                ...action.board,
                hintsUsed: state.hintsUsed,
                numErrors: state.numErrors,
            }
        }
        case 'reset': {
            return {
                ...action.board,
                hintsUsed: 0,
                numErrors: 0,
            }
        }
        default:
            throw new UnexpectedValueError(action);
    }
}

