import { Cells, hexCellReducer } from 'src/features/hexcells';
import { createCellBoardInstance } from 'src/features/hexcells/utils/createCellBoardInstance';
import { useImmerReducer } from 'use-immer';
import { CellBoardDefinition } from 'src/features/hexcells/types/CellBoard';
import { suspendPromise } from 'src/utils/suspendPromise';
import { Tools } from './Tools';
import { Result } from './Result';
import { useTimer } from 'src/hooks/useTimer';
import { Help } from './Help';

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

            <Cells
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
