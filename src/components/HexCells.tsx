import { InteractiveCells, hexCellReducer } from 'src/features/hexcells';
import { createCellBoardInstance } from 'src/features/hexcells/utils/createCellBoardInstance';
import { useImmerReducer } from 'use-immer';
import { CellBoardDefinition } from 'src/features/hexcells/types/CellBoard';
import { Help } from 'src/features/help';
import { suspendPromise } from 'src/utils/suspendPromise';
import { Tools } from './Tools';
import { Result } from './Result';
import { useTimer } from 'src/hooks/useTimer';
import { useEffect } from 'react';

const getDefinition = suspendPromise<CellBoardDefinition[]>(
    fetch(import.meta.env.VITE_GAME_DATA_URL)
        .then(result => result.json())
);

interface Props {
    showHelp: boolean;
    setShowHelp: (show: boolean) => void;
}

export const HexCells: React.FC<Props> = props => {
    const [board, dispatch] = useImmerReducer(hexCellReducer, getDefinition()[0], createCellBoardInstance);
    const {
        display: timeSpent,
        enabled: timerEnabled,
        setEnabled: enableTimer
    } = useTimer();

    if (board.result && timerEnabled) {
        enableTimer(false);
    }

    // Disable context menu everywhere when a game is rendering.
    // Otherwise, when right clicking to flag the final bomb, the context menu could show on account of a dialog or transition.
    useEffect(() => {
        const listener = (e: MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', listener);
        return () => document.removeEventListener('contextmenu', listener);
    }, []);
    
    const result = board.result
        ? (
            <Result
                result={board.result}
                bombsLeft={board.numBombs}
                errors={board.numErrors}
                hintsUsed={board.hintsUsed}
                timeSpent={timeSpent}
            />
        )
        : undefined;

    return (
        <>
            <Help 
                open={props.showHelp}
                close={() => props.setShowHelp(false)}
            />

            <InteractiveCells
                cells={board.cells}
                columns={board.columns}
                revealCell={index => { enableTimer(true); dispatch({ type: 'reveal', index }) }}
                flagCell={index => { enableTimer(true); dispatch({ type: 'flag', index }) }}
                result={board.result}
                errorIndex={board.errorIndex}
            />

            <Tools
                bombsLeft={board.numBombs}
                errors={board.numErrors}
                hintsUsed={board.hintsUsed}
                timeSpent={timeSpent}
                getHint={() => { enableTimer(true); dispatch({ type: 'hint' })} }
                showHelp={() => props.setShowHelp(true)}
            />

            {result}
        </>
    )
}
