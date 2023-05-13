import { Cells, hexCellReducer } from 'src/features/hexcells';
import { createCellBoardInstance } from 'src/features/hexcells/utils/createCellBoardInstance';
import { useImmerReducer } from 'use-immer';
import { CellBoardDefinition } from './features/hexcells/types/CellBoard';

const gameDefinition = fetchGameData();

export const HexCells: React.FC = () => {
    const [board, dispatch] = useImmerReducer(hexCellReducer, gameDefinition(), createCellBoardInstance);

    return (
        <>
            <Cells
                cells={board.cells}
                columns={board.columns}
                revealCell={index => dispatch({ type: 'reveal', index })}
                flagCell={index => dispatch({ type: 'flag', index })}
                getHint={() => dispatch({ type: 'hint' })}
                numBombs={board.numBombs}
                numErrors={board.numErrors}
                result={board.result}
                errorIndex={board.errorIndex}
            />

            <div style={{display: board.result ? undefined : 'none'}}>
                Result: {board.result}
            </div>
        </>
    )
}

// Fetch external data
function fetchGameData() {
    let status = 'pending';
    let result: CellBoardDefinition;
    let errorMessage: string;

    let fetching = fetch('game.json')
        .then(result => result.json())
        .then((json) => {
            status = 'fulfilled';
            result = json;
        })
        .catch((error: string) => {
            status = 'rejected';
            errorMessage = error;
        });
  
    return () => {
        if (status === 'pending') {
            throw fetching; // Suspend(A way to tell React data is still fetching)
        } else if (status === 'rejected') {
            throw errorMessage; // Result is an error
        } else if (status === 'fulfilled') {
            return result; // Result is a fulfilled promise
        } else {
            throw 'invalid state'
        }
    };
}
