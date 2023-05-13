import { StoryObj } from '@storybook/react';
import produce from 'immer';
import { useReducer } from 'react';
import { generateInstance } from '../utils/createCellBoardInstance';
import { GenerationConfig } from '../utils/generateBoard';
import { hexCellReducer } from '../utils/hexCellReducer';
import { Cells } from './Cells';

const CellsWithReducer: React.FC<GenerationConfig> = config => {
    const [board, dispatch] = useReducer(produce(hexCellReducer), undefined, () => generateInstance(config));

    return (
        <Cells
            cells={board.cells}
            columns={board.columns}
            revealCell={index => setTimeout(() => dispatch({ type: 'reveal', index }), 200)}
            flagCell={index => setTimeout(() => dispatch({ type: 'flag', index }), 200)}
            getHint={() => dispatch({ type: 'hint' })}
            numBombs={board.numBombs}
            numErrors={board.numErrors}
            result={board.result}
            errorIndex={board.errorIndex}
        />
    )
}

export default {
    title: 'Sensors/Cells',
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
    args: {
        orientation: 'landscape',
        numCells: 34,
        gapFraction: 0.3,
        bombFraction: 0.25,
        unknownFraction: 0.15,
        radiusClueChance: 0.05,
        revealChance: 0.1,
        contiguousClueChance: 0.5,
        splitClueChance: 0.4,
    },
}
