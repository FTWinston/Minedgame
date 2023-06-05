import { StoryObj } from '@storybook/react';
import { useImmerReducer } from 'use-immer';
import { generateInstance } from '../utils/createCellBoardInstance';
import { GenerationConfig } from '../utils/generateBoard';
import { hexCellReducer } from '../utils/hexCellReducer';
import { InteractiveCells } from './InteractiveCells';
import { getConfiguration } from '../utils/getConfiguration';

const CellsWithReducer: React.FC<GenerationConfig> = config => {
    const [board, dispatch] = useImmerReducer(hexCellReducer, config, generateInstance);

    return (
        <>
            <InteractiveCells
                cells={board.cells}
                columns={board.columns}
                revealCell={index => setTimeout(() => dispatch({ type: 'reveal', index }), 200)}
                flagCell={index => setTimeout(() => dispatch({ type: 'flag', index }), 200)}
                result={board.result}
                errorIndex={board.errorIndex}
            />
            <div style={{position: 'absolute', left: 0, bottom: 0, color: 'white'}}>
                {board.numBombs}
            </div>
        </>
    )
}

export default {
    title: 'InteractiveCells',
    component: CellsWithReducer,
};

type Story = StoryObj<typeof CellsWithReducer>;

export const Basic: Story = {
    args: {
        orientation: 'portrait',
        numCells: 26,
        gapFraction: 0.15,
        bombFraction: 0.2,
    },
}

export const Complex: Story = {
    args: getConfiguration(),
}
