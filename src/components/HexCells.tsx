import { Cells, hexCellReducer } from 'src/features/hexcells';
import { createCellBoardInstance } from 'src/features/hexcells/utils/createCellBoardInstance';
import { useImmerReducer } from 'use-immer';
import { CellBoardDefinition } from 'src/features/hexcells/types/CellBoard';
import { suspendPromise } from 'src/utils/suspendPromise';
import { Tools } from './Tools';

const getDefinition = suspendPromise<CellBoardDefinition>(
    fetch(import.meta.env.VITE_GAME_DATA_URL)
        .then(result => result.json())
);

export const HexCells: React.FC = () => {
    const [board, dispatch] = useImmerReducer(hexCellReducer, getDefinition(), createCellBoardInstance);

    return (
        <>
            <Cells
                cells={board.cells}
                columns={board.columns}
                revealCell={index => dispatch({ type: 'reveal', index })}
                flagCell={index => dispatch({ type: 'flag', index })}
                result={board.result}
                errorIndex={board.errorIndex}
            />

            <Tools
                bombsLeft={board.numBombs}
                errors={board.numErrors}
                hintsUsed={board.hintsUsed}
                timeSpent="0:00"
                getHint={() => dispatch({ type: 'hint' })}
                showHelp={() => alert('help')}
            />

            <div style={{display: board.result ? undefined : 'none'}}>
                Result: {board.result}
            </div>
        </>
    )
}
