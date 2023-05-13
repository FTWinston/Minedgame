import { Cells, hexCellReducer } from 'src/features/hexcells';
import { createCellBoardInstance } from 'src/features/hexcells/utils/createCellBoardInstance';
import { CellBoardDefinition } from './features/hexcells/types/CellBoard';
import { useImmerReducer } from 'use-immer';

interface Props {
    definition: CellBoardDefinition;
}

export const HexCells: React.FC<Props> = props => {
    const [board, dispatch] = useImmerReducer(hexCellReducer, props.definition, createCellBoardInstance);

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
