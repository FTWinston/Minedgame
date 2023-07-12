import { useEffect, useState } from 'react';
import { useImmerReducer } from 'use-immer';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import { InteractiveCells, hexCellReducer } from 'src/features/hexcells';
import { CellBoardDefinition } from 'src/features/hexcells/types/CellBoard';
import { Help } from 'src/features/help';
import { suspendPromise } from 'src/utils/suspendPromise';
import { Tools } from './Tools';
import { Result } from './Result';
import { useCounter } from 'src/hooks/useCounter';
import { createStagesState, stagesReducer } from 'src/utils/stagesReducer';

const getDefinitions = suspendPromise<CellBoardDefinition[]>(
    fetch(import.meta.env.VITE_GAME_DATA_URL)
        .then(result => result.json())
);

interface Props {
    date: Date;
    showHelp: boolean;
    setShowHelp: (show: boolean) => void;
}

const HexCells: React.FC<Props> = props => {
    const [{ instantiateStage, stageNumber, totalStages }, definitionsDispatch] = useImmerReducer(stagesReducer, getDefinitions(), createStagesState)
    const [game, gameDispatch] = useImmerReducer(hexCellReducer, 1, instantiateStage);
    const [timerEnabled, enableTimer] = useState(false); // TODO: rename and/or remove this

    if (game.result && timerEnabled) {
        enableTimer(false);

        if (game.result === 'success' && stageNumber < totalStages) {
            definitionsDispatch({ type: 'increment' });
        }
    }

    const [displayNumber, setDisplayNumber] = useState(stageNumber);
    const [attempt, addAttempt] = useCounter();

    const reset = () => {
        addAttempt();
        enableTimer(false);
        setDisplayNumber(1);
        definitionsDispatch({ type: 'reset' });
        gameDispatch({ type: 'reset', board: instantiateStage(1) })
    }

    // Disable context menu everywhere when a game is rendering.
    // Otherwise, when right clicking to flag the final bomb, the context menu could show on account of a dialog or transition.
    useEffect(() => {
        const listener = (e: MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', listener);
        return () => document.removeEventListener('contextmenu', listener);
    }, []);
    
    const result = game.result && (displayNumber >= totalStages || game.result === 'failure')
        ? (
            <Result
                date={props.date}
                result={game.result}
                bombsLeft={game.numBombs}
                errors={game.numErrors}
                hintsUsed={game.hintsUsed}
                stage={stageNumber}
                totalStages={totalStages}
                retry={reset}
            />
        )
        : undefined;

    return (
        <>
            <Help 
                open={props.showHelp}
                close={() => props.setShowHelp(false)}
            />

            <Slide
                direction={displayNumber === stageNumber ? 'left' : 'right'}
                timeout={1000}
                appear={false}
                in={displayNumber === stageNumber}
                onExited={() => {
                    setDisplayNumber(stageNumber);
                    gameDispatch({ type: 'next', board: instantiateStage(stageNumber) });
                }}
            >
                <Box key={attempt} position="fixed" top={0} left={0} right={0} bottom={0} display="flex" alignItems="center">
                    <InteractiveCells
                        key={displayNumber}
                        cells={game.cells}
                        columns={game.columns}
                        revealCell={index => { enableTimer(true); gameDispatch({ type: 'reveal', index }) }}
                        flagCell={index => { enableTimer(true); gameDispatch({ type: 'flag', index }) }}
                        result={game.result}
                        errorIndex={game.errorIndex}
                    />
                </Box>
            </Slide>

            <Tools
                bombsLeft={game.numBombs}
                errors={game.numErrors}
                hintsUsed={game.hintsUsed}
                currentStage={displayNumber}
                totalStages={totalStages}
                getHint={() => { enableTimer(true); gameDispatch({ type: 'hint' })} }
                showHelp={() => props.setShowHelp(true)}
            />

            {result}
        </>
    )
}

export default HexCells;
