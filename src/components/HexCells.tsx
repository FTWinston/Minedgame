import { useState } from 'react';
import { useImmerReducer } from 'use-immer';
import Slide from '@mui/material/Slide';
import { InteractiveCells, hexCellReducer } from 'src/features/hexcells';
import { CellBoardDefinition } from 'src/features/hexcells/types/CellBoard';
import { Help } from 'src/features/help';
import { suspendPromise } from 'src/utils/suspendPromise';
import { Tools } from './Tools';
import { Result } from './Result';
import { useTimer } from 'src/hooks/useTimer';
import { createStagesState, stagesReducer } from 'src/utils/stagesReducer';

const getDefinitions = suspendPromise<CellBoardDefinition[]>(
    fetch(import.meta.env.VITE_GAME_DATA_URL)
        .then(result => result.json())
);

interface Props {
    showHelp: boolean;
    setShowHelp: (show: boolean) => void;
}

export const HexCells: React.FC<Props> = props => {
    const [{ instantiateStage, stageNumber, totalStages }, definitionsDispatch] = useImmerReducer(stagesReducer, getDefinitions(), createStagesState)
    const [game, gameDispatch] = useImmerReducer(hexCellReducer, 1, instantiateStage);
    const {
        display: timeSpent,
        enabled: timerEnabled,
        setEnabled: enableTimer
    } = useTimer();

    if (game.result && timerEnabled) {
        enableTimer(false);

        if (game.result === 'success' && stageNumber < totalStages) {
            definitionsDispatch({ type: 'increment' });
        }
    }

    const [displayNumber, setDisplayNumber] = useState(stageNumber);
    
    const result = game.result && (displayNumber >= totalStages || game.result === 'failure')
        ? (
            <Result
                result={game.result}
                bombsLeft={game.numBombs}
                errors={game.numErrors}
                hintsUsed={game.hintsUsed}
                stage={stageNumber}
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

            <Slide
                direction={displayNumber === stageNumber ? 'right' : 'left'}
                timeout={1000}
                appear={false}
                in={displayNumber === stageNumber}
                onExited={() => {
                    setDisplayNumber(stageNumber);
                    gameDispatch({ type: 'new', board: instantiateStage(stageNumber) });
                }}
            >
                <div>
                    <InteractiveCells
                        key={displayNumber}
                        cells={game.cells}
                        columns={game.columns}
                        revealCell={index => { enableTimer(true); gameDispatch({ type: 'reveal', index }) }}
                        flagCell={index => { enableTimer(true); gameDispatch({ type: 'flag', index }) }}
                        result={game.result}
                        errorIndex={game.errorIndex}
                    />
                </div>
            </Slide>

            <Tools
                bombsLeft={game.numBombs}
                errors={game.numErrors}
                hintsUsed={game.hintsUsed}
                currentStage={displayNumber}
                totalStages={totalStages}
                timeSpent={timeSpent}
                getHint={() => { enableTimer(true); gameDispatch({ type: 'hint' })} }
                showHelp={() => props.setShowHelp(true)}
            />

            {result}
        </>
    )
}
