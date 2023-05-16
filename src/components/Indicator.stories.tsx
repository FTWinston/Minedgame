import { StoryObj } from '@storybook/react';
import { CellType } from 'src/features/hexcells/types/CellState';
import { Indicator } from './Indicator';

export default {
    title: 'Indicator',
    component: Indicator,
};

type Story = StoryObj<typeof Indicator>;

export const Obscured: Story = {
    args: {
        type: CellType.Obscured
    }
}

export const Error: Story = {
    args: {
        type: CellType.Exploded
    }
}
